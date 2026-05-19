"""
TDShU Backend — Flask + SQLite + SMTP email
Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi
"""
import os
import sqlite3
import secrets
import smtplib
import mimetypes
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

# Maksimal so'rov hajmi: 200MB
MAX_UPLOAD_MB = 200

# ===== FLASK =====
app = Flask(__name__)
CORS(app, expose_headers=["Content-Type", "Authorization"])
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024

# Faol tokenlar (xotirada)
TOKENS = set()


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


def require_token():
    token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    return token in TOKENS


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


def save_upload(file_storage, max_mb):
    """Faylni saqlash. Hajm nazorat qilinadi."""
    if not file_storage or not file_storage.filename:
        return "", ""
    file_storage.stream.seek(0, 2)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > max_mb * 1024 * 1024:
        return None, f"Fayl hajmi {max_mb}MB dan oshmasligi kerak"
    fname = file_storage.filename
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
    data = request.get_json(silent=True) or {}
    if data.get("username") == ADMIN_USERNAME and data.get("password") == ADMIN_PASSWORD:
        token = secrets.token_urlsafe(32)
        TOKENS.add(token)
        return jsonify({"token": token, "username": ADMIN_USERNAME})
    return jsonify({"error": "Login yoki parol noto'g'ri"}), 401


@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    TOKENS.discard(token)
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

    # Rasm (majburiy emas)
    photo_path, _ = "", ""
    if "photo" in request.files:
        result = save_upload(request.files["photo"], max_mb=50)
        if result[0] is None:
            return jsonify({"error": result[1]}), 400
        photo_path, _ = result

    # Qo'shimcha fayl (ixtiyoriy)
    attachment_path, attachment_name = "", ""
    if "attachment" in request.files:
        result = save_upload(request.files["attachment"], max_mb=100)
        if result[0] is None:
            return jsonify({"error": result[1]}), 400
        attachment_path, attachment_name = result

    db = get_db()
    cur = db.execute("""
        INSERT INTO articles
            (title, author, position, department, subject, category, keywords,
             email, phone, description, content,
             photo_path, attachment_path, attachment_name,
             status, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'pending', ?)
    """, (
        data.get("title", "").strip(),
        data.get("fullName", "").strip(),
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
            f"Yangi maqola: {data.get('title', '')}",
            f"Yangi maqola yuborildi va tasdiqlash kutilmoqda.\n\n"
            f"Muallif: {data.get('fullName', '')}\n"
            f"Sarlavha: {data.get('title', '')}\n"
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
        "admin_user": ADMIN_USERNAME,
    })


if __name__ == "__main__":
    print("=" * 60)
    print("  TDShU Backend ishga tushdi")
    print(f"  Manzil: http://localhost:5000")
    print(f"  SMTP:   {'sozlangan' if (SMTP_USER and SMTP_PASSWORD) else 'SOZLANMAGAN (email ishlamaydi)'}")
    print(f"  DB:     {DB_PATH}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
