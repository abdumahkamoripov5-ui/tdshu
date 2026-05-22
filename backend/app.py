"""
TDShU Backend — Flask + SQLite + SMTP email
Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi
"""
import os
import time
import json
import hmac
import base64
import hashlib
import sqlite3
import secrets
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ===== KONFIGURATSIYA =====
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

# Token imzolash kaliti. Belgilanmagan bo'lsa tasodifiy yaratiladi
# (server qayta ishga tushganda admin qaytadan kirishi kerak bo'ladi).
SECRET_KEY    = os.getenv("SECRET_KEY") or secrets.token_hex(32)
TOKEN_TTL     = int(os.getenv("TOKEN_TTL_SECONDS", str(8 * 3600)))  # 8 soat

# CORS: vergul bilan ajratilgan domenlar. "*" — hammaga ruxsat (faqat sinov uchun).
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").strip()

SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER     = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM     = os.getenv("SMTP_FROM", SMTP_USER)
NOTIFY_EMAIL  = os.getenv("NOTIFY_EMAIL", SMTP_USER)

BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
DATA_DIR      = os.path.join(BASE_DIR, "data")
UPLOAD_DIR    = os.path.join(BASE_DIR, "uploads")
DB_PATH       = os.path.join(DATA_DIR, "tdshu.db")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Maksimal so'rov hajmi: 150MB (rasm 25MB + fayl 100MB + zaxira)
MAX_UPLOAD_MB = 150

# Ruxsat etilgan fayl turlari
ALLOWED_PHOTO_EXT  = {"jpg", "jpeg", "png", "gif", "webp"}
ALLOWED_ATTACH_EXT = {"pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "rtf"}

# Login uchun rate-limit
RATE_LIMIT_MAX    = 10          # bir oynada nechta urinish
RATE_LIMIT_WINDOW = 300         # oyna (soniya) = 5 daqiqa

# ===== FLASK =====
app = Flask(__name__)
if ALLOWED_ORIGINS == "*":
    CORS(app)
else:
    origins = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]
    CORS(app, origins=origins)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024

# Login urinishlari (xotirada): ip -> [timestamp, ...]
_login_attempts = {}


# ===== DB =====
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS articles (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        title           TEXT,
        author          TEXT,
        position        TEXT,
        department      TEXT,
        subject         TEXT,
        category        TEXT,
        keywords        TEXT,
        email           TEXT,
        phone           TEXT,
        description     TEXT,
        content         TEXT,
        photo_path      TEXT,
        attachment_path TEXT,
        attachment_name TEXT,
        status          TEXT DEFAULT 'pending',
        created_at      TEXT,
        updated_at      TEXT
    );

    CREATE TABLE IF NOT EXISTS contacts (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT,
        phone       TEXT,
        email       TEXT,
        type        TEXT,
        subject     TEXT,
        message     TEXT,
        status      TEXT DEFAULT 'pending',
        created_at  TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
    """)
    conn.commit()
    conn.close()


init_db()


# ===== UTIL =====
def now_iso():
    return datetime.utcnow().isoformat()


# ----- Imzolangan (stateless) tokenlar -----
def _b64e(b):
    return base64.urlsafe_b64encode(b).decode().rstrip("=")


def _b64d(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def _sign(body):
    return _b64e(hmac.new(SECRET_KEY.encode(), body.encode(), hashlib.sha256).digest())


def make_token(username):
    payload = {"u": username, "exp": int(time.time()) + TOKEN_TTL}
    body = _b64e(json.dumps(payload, separators=(",", ":")).encode())
    return f"{body}.{_sign(body)}"


def verify_token(token):
    if not token or "." not in token:
        return False
    body, _, sig = token.partition(".")
    if not hmac.compare_digest(sig, _sign(body)):
        return False
    try:
        payload = json.loads(_b64d(body))
    except Exception:
        return False
    return int(payload.get("exp", 0)) > int(time.time())


def require_token():
    token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    return verify_token(token)


# ----- Rate limit -----
def is_rate_limited(ip):
    now = time.time()
    attempts = [t for t in _login_attempts.get(ip, []) if now - t < RATE_LIMIT_WINDOW]
    _login_attempts[ip] = attempts
    return len(attempts) >= RATE_LIMIT_MAX


def record_attempt(ip):
    _login_attempts.setdefault(ip, []).append(time.time())


def row_to_dict(row, host_url):
    """SQLite Row -> dict, fayl yo'llarini to'liq URL qiladi."""
    d = dict(row)
    if d.get("photo_path"):
        d["photo_url"] = f"{host_url}api/uploads/{d['photo_path']}"
    else:
        d["photo_url"] = ""
    if d.get("attachment_path"):
        d["attachment_url"] = f"{host_url}api/uploads/{d['attachment_path']}"
    else:
        d["attachment_url"] = ""
    return d


def save_upload(file_storage, max_mb, allowed_ext):
    """Faylni saqlash. Hajm va tur nazorat qilinadi.
    Muvaffaqiyatda (storage_name, original_name), xatoda (None, xabar) qaytaradi."""
    if not file_storage or not file_storage.filename:
        return "", ""

    fname = file_storage.filename
    ext = fname.rsplit(".", 1)[-1].lower() if "." in fname else ""
    if allowed_ext and ext not in allowed_ext:
        return None, f"Ruxsat etilmagan fayl turi: .{ext}"

    file_storage.stream.seek(0, 2)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > max_mb * 1024 * 1024:
        return None, f"Fayl hajmi {max_mb}MB dan oshmasligi kerak"

    safe = secure_filename(fname) or "file"
    final_name = f"{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{secrets.token_hex(4)}_{safe}"
    file_storage.save(os.path.join(UPLOAD_DIR, final_name))
    return final_name, fname  # storage_name, original_name


# ===== EMAIL =====
def send_email(to_addr, subject, body, reply_to=None):
    """SMTP orqali email yuborish. SMTP sozlanmagan bo'lsa False qaytaradi."""
    if not (SMTP_USER and SMTP_PASSWORD and to_addr):
        print(f"[email] SMTP not configured or no recipient. Subject: {subject}")
        return False

    msg = MIMEMultipart()
    msg["From"] = SMTP_FROM or SMTP_USER
    msg["To"] = to_addr
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"[email] sent to {to_addr}")
        return True
    except Exception as e:
        print(f"[email] failed: {e}")
        return False


# ===== AUTH =====
@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    ip = request.remote_addr or "unknown"
    if is_rate_limited(ip):
        return jsonify({"error": "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring."}), 429

    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")
    user_ok = hmac.compare_digest(str(username), ADMIN_USERNAME)
    pass_ok = hmac.compare_digest(str(password), ADMIN_PASSWORD)
    if user_ok and pass_ok:
        return jsonify({"token": make_token(ADMIN_USERNAME), "username": ADMIN_USERNAME})

    record_attempt(ip)
    return jsonify({"error": "Login yoki parol noto'g'ri"}), 401


@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    # Tokenlar stateless — chiqish mijoz tomonida tokenni o'chirish bilan amalga oshadi.
    return jsonify({"ok": True})


@app.route("/api/auth/check", methods=["GET"])
def auth_check():
    return jsonify({"valid": require_token()})


# ===== ARTICLES =====
@app.route("/api/articles", methods=["GET"])
def list_articles():
    is_admin = require_token()
    db = get_db()
    if is_admin:
        rows = db.execute("SELECT * FROM articles ORDER BY id DESC").fetchall()
    else:
        rows = db.execute("SELECT * FROM articles WHERE status='approved' ORDER BY id DESC").fetchall()
    db.close()
    return jsonify([row_to_dict(r, request.host_url) for r in rows])


@app.route("/api/articles/<int:aid>", methods=["GET"])
def get_article(aid):
    is_admin = require_token()
    db = get_db()
    row = db.execute("SELECT * FROM articles WHERE id=?", (aid,)).fetchone()
    db.close()
    if not row:
        return jsonify({"error": "not found"}), 404
    if not is_admin and row["status"] != "approved":
        return jsonify({"error": "not found"}), 404
    return jsonify(row_to_dict(row, request.host_url))


@app.route("/api/articles", methods=["POST"])
def submit_article():
    data = request.form

    # Rasm (ixtiyoriy)
    photo_path = ""
    if "photo" in request.files:
        result = save_upload(request.files["photo"], max_mb=25, allowed_ext=ALLOWED_PHOTO_EXT)
        if result[0] is None:
            return jsonify({"error": result[1]}), 400
        photo_path, _ = result

    # Qo'shimcha fayl (ixtiyoriy)
    attachment_path, attachment_name = "", ""
    if "attachment" in request.files:
        result = save_upload(request.files["attachment"], max_mb=100, allowed_ext=ALLOWED_ATTACH_EXT)
        if result[0] is None:
            return jsonify({"error": result[1]}), 400
        attachment_path, attachment_name = result

    title = data.get("title", "").strip()
    author = data.get("fullName", "").strip()
    if not (title and author):
        return jsonify({"error": "Sarlavha va muallif ismi to'ldirilishi kerak"}), 400

    db = get_db()
    cur = db.execute("""
        INSERT INTO articles
            (title, author, position, department, subject, category, keywords,
             email, phone, description, content,
             photo_path, attachment_path, attachment_name,
             status, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'pending', ?)
    """, (
        title,
        author,
        data.get("position", "").strip(),
        data.get("department", "").strip(),
        data.get("subject", "").strip(),
        data.get("category", "").strip(),
        data.get("keywords", "").strip(),
        data.get("email", "").strip(),
        data.get("phone", "").strip(),
        data.get("description", "").strip(),
        data.get("content", "").strip(),
        photo_path, attachment_path, attachment_name,
        now_iso(),
    ))
    new_id = cur.lastrowid
    db.commit()
    db.close()

    # Admin'ga xabar yuborish
    if NOTIFY_EMAIL:
        send_email(
            NOTIFY_EMAIL,
            f"Yangi maqola: {title}",
            f"Yangi maqola yuborildi va tasdiqlash kutilmoqda.\n\n"
            f"Muallif: {author}\n"
            f"Sarlavha: {title}\n"
            f"Kategoriya: {data.get('category', '')}\n"
            f"Email: {data.get('email', '')}\n"
            f"Telefon: {data.get('phone', '')}\n\n"
            f"Tasdiqlash uchun admin panelga kiring.",
            reply_to=data.get("email") or None,
        )

    return jsonify({"id": new_id, "status": "pending"}), 201


@app.route("/api/articles/<int:aid>", methods=["PATCH"])
def update_article_status(aid):
    if not require_token():
        return jsonify({"error": "unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    if new_status not in ("pending", "approved", "rejected"):
        return jsonify({"error": "invalid status"}), 400

    db = get_db()
    row = db.execute("SELECT email, author, title FROM articles WHERE id=?", (aid,)).fetchone()
    if not row:
        db.close()
        return jsonify({"error": "not found"}), 404
    db.execute("UPDATE articles SET status=?, updated_at=? WHERE id=?", (new_status, now_iso(), aid))
    db.commit()
    db.close()

    # Tasdiqlanganda muallifga email
    if new_status == "approved" and row["email"]:
        send_email(
            row["email"],
            f"Maqolangiz tasdiqlandi: {row['title']}",
            f"Hurmatli {row['author']},\n\n"
            f"\"{row['title']}\" nomli maqolangiz administrator tomonidan tasdiqlandi "
            f"va saytda chop etildi.\n\n"
            f"Hurmat bilan,\n"
            f"Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi",
        )
    elif new_status == "rejected" and row["email"]:
        send_email(
            row["email"],
            f"Maqolangiz haqida bildirishnoma",
            f"Hurmatli {row['author']},\n\n"
            f"\"{row['title']}\" nomli maqolangiz qayta ko'rib chiqilishi kerakligi sababli "
            f"hozircha chop etilmadi. Aniq sabablar va tavsiyalar uchun ma'muriyatga murojaat qiling.",
        )

    return jsonify({"ok": True, "status": new_status})


@app.route("/api/articles/<int:aid>", methods=["DELETE"])
def delete_article(aid):
    if not require_token():
        return jsonify({"error": "unauthorized"}), 401
    db = get_db()
    row = db.execute("SELECT photo_path, attachment_path FROM articles WHERE id=?", (aid,)).fetchone()
    if row:
        for p in (row["photo_path"], row["attachment_path"]):
            if p:
                try:
                    os.remove(os.path.join(UPLOAD_DIR, p))
                except OSError:
                    pass
    db.execute("DELETE FROM articles WHERE id=?", (aid,))
    db.commit()
    db.close()
    return jsonify({"ok": True})


# ===== CONTACTS =====
@app.route("/api/contacts", methods=["POST"])
def submit_contact():
    data = request.get_json(silent=True) or request.form

    name    = (data.get("name") or "").strip()
    phone   = (data.get("phone") or "").strip()
    email   = (data.get("email") or "").strip()
    ctype   = (data.get("type") or "").strip()
    subject = (data.get("subject") or "").strip()
    message = (data.get("message") or "").strip()

    if not (name and email and message):
        return jsonify({"error": "Ism, email va xabar to'ldirilishi kerak"}), 400

    db = get_db()
    db.execute("""
        INSERT INTO contacts (name, phone, email, type, subject, message, status, created_at)
        VALUES (?,?,?,?,?,?, 'pending', ?)
    """, (name, phone, email, ctype, subject, message, now_iso()))
    db.commit()
    db.close()

    # Admin'ga email yuborish
    email_sent = False
    if NOTIFY_EMAIL:
        email_sent = send_email(
            NOTIFY_EMAIL,
            f"Yangi murojaat: {subject or 'TDShU saytidan'}",
            f"Ism: {name}\n"
            f"Telefon: {phone}\n"
            f"Email: {email}\n"
            f"Turi: {ctype}\n\n"
            f"Sarlavha: {subject}\n\n"
            f"Xabar:\n{message}",
            reply_to=email,
        )

    return jsonify({"ok": True, "email_sent": email_sent}), 201


@app.route("/api/contacts", methods=["GET"])
def list_contacts():
    if not require_token():
        return jsonify({"error": "unauthorized"}), 401
    db = get_db()
    rows = db.execute("SELECT * FROM contacts ORDER BY id DESC").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/contacts/<int:cid>", methods=["DELETE"])
def delete_contact(cid):
    if not require_token():
        return jsonify({"error": "unauthorized"}), 401
    db = get_db()
    db.execute("DELETE FROM contacts WHERE id=?", (cid,))
    db.commit()
    db.close()
    return jsonify({"ok": True})


@app.route("/api/contacts/<int:cid>/reply", methods=["POST"])
def reply_contact(cid):
    """Admin foydalanuvchiga to'g'ridan-to'g'ri email orqali javob yuboradi."""
    if not require_token():
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json(silent=True) or {}
    body = (data.get("body") or "").strip()
    subject = (data.get("subject") or "Murojaatingizga javob").strip()
    if not body:
        return jsonify({"error": "Xabar matnini kiriting"}), 400

    db = get_db()
    row = db.execute("SELECT email, name FROM contacts WHERE id=?", (cid,)).fetchone()
    db.close()
    if not row or not row["email"]:
        return jsonify({"error": "Email topilmadi"}), 404

    ok = send_email(row["email"], subject, f"Hurmatli {row['name']},\n\n{body}\n\nHurmat bilan,\nTDShU ma'muriyati")
    return jsonify({"ok": ok})


# ===== UPLOADS =====
@app.route("/api/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)


# ===== HEALTH =====
@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "time": now_iso(),
        "smtp_configured": bool(SMTP_USER and SMTP_PASSWORD),
    })


# ===== FRONTEND (statik sayt) =====
# Backend frontend'ni ham serve qiladi: `python app.py` -> http://localhost:5000/
FRONTEND_DIR = os.path.dirname(BASE_DIR)  # loyiha ildizi — index.html shu yerda


@app.route("/")
def serve_index():
    return send_from_directory(FRONTEND_DIR, "index.html")


# Bu papka/fayllar hech qachon serve qilinmaydi (maxfiy ma'lumotlar)
_BLOCKED_TOP = {"backend", ".git", ".vscode", ".idea"}


@app.route("/<path:path>")
def serve_frontend(path):
    """Statik fayllarni (HTML/CSS/JS/rasm) beradi. /api/* marshrutlari bu yerga tushmaydi."""
    norm = path.replace("\\", "/").lstrip("/")
    top = norm.split("/", 1)[0].lower()
    # backend/ papkasi va yashirin fayllar (.env, .git, ...) — taqiqlangan
    if top in _BLOCKED_TOP or top.startswith("."):
        return send_from_directory(FRONTEND_DIR, "404.html"), 404
    target = os.path.join(FRONTEND_DIR, norm)
    if os.path.isfile(target):
        return send_from_directory(FRONTEND_DIR, norm)
    return send_from_directory(FRONTEND_DIR, "404.html"), 404


if __name__ == "__main__":
    debug = os.getenv("DEBUG", "false").lower() == "true"
    port = int(os.getenv("PORT", "5000"))
    print("=" * 60)
    print("  TDShU ishga tushdi")
    print(f"  Sayt:   http://localhost:{port}/")
    print(f"  Admin:  http://localhost:{port}/admin-login.html")
    print(f"  API:    http://localhost:{port}/api/")
    print(f"  SMTP:   {'sozlangan' if (SMTP_USER and SMTP_PASSWORD) else 'SOZLANMAGAN (email ishlamaydi)'}")
    print(f"  CORS:   {ALLOWED_ORIGINS}")
    print(f"  DB:     {DB_PATH}")
    if ADMIN_PASSWORD == "admin123":
        print("  DIQQAT: standart parol ishlatilmoqda! ADMIN_PASSWORD ni o'zgartiring.")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=debug)
