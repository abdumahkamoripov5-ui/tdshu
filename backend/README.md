# TDShU Backend

Flask backend. Maqolalarni, murojaatlarni saqlaydi va email yuboradi.

**Ikki rejimda ishlaydi (avtomatik tanlanadi):**

| | Mahalliy (ishlab chiqish) | Production |
|---|---|---|
| **Baza** | SQLite (`data/tdshu.db`) | PostgreSQL — `DATABASE_URL` berilsa (Supabase) |
| **Fayllar** | `uploads/` papka | Supabase Storage — `SUPABASE_URL` berilsa |

`.env` da `DATABASE_URL`/`SUPABASE_URL` bo'sh bo'lsa mahalliy rejim ishlaydi —
hech narsa sozlamasdan `python app.py` bilan sinab ko'rsa bo'ladi.
Production sozlash uchun: [`../DEPLOY.md`](../DEPLOY.md) (3-bosqich: Supabase).

## Tezkor ishga tushirish

```powershell
cd backend
pip install -r requirements.txt
python app.py
```

Backend manzili: **http://localhost:5000**

## Email yuborishni sozlash

1. `.env.example` faylini `.env` deb nusxalang
2. Gmail uchun: https://myaccount.google.com/apppasswords sahifasidan App Password yarating (2FA yoqilgan bo'lishi kerak)
3. `.env` da quyidagilarni to'ldiring:

```env
SMTP_USER=siz@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
SMTP_FROM=siz@gmail.com
NOTIFY_EMAIL=admin@tdshu.uz
```

4. Backendni qayta ishga tushiring

## API endpointlari

### Ochiq
| Method | Yo'l | Tavsif |
|---|---|---|
| GET | `/api/articles` | Tasdiqlangan maqolalar |
| POST | `/api/articles` | Yangi maqola yuborish (multipart) |
| POST | `/api/contacts` | Aloqa formasi |
| GET | `/api/uploads/<fayl>` | Yuklangan fayl |
| GET | `/api/health` | Holatni tekshirish |

### Admin (token kerak — `Authorization: Bearer <token>`)
| Method | Yo'l | Tavsif |
|---|---|---|
| POST | `/api/auth/login` | Tizimga kirish |
| GET | `/api/articles` | Barcha maqolalar (status'larga qaramay) |
| PATCH | `/api/articles/<id>` | Status o'zgartirish (approved/rejected/pending) |
| DELETE | `/api/articles/<id>` | O'chirish |
| GET | `/api/contacts` | Barcha murojaatlar |
| POST | `/api/contacts/<id>/reply` | Email orqali javob |
| DELETE | `/api/contacts/<id>` | O'chirish |

## Test

```bash
curl http://localhost:5000/api/health
```

## Fayl tuzilishi

```
backend/
├── app.py            # Flask app, barcha endpointlar
├── requirements.txt  # Python paketlari
├── .env.example      # Konfiguratsiya namunasi
├── .env              # Sizning konfiguratsiyangiz (yaratilgandan keyin)
├── data/
│   └── tdshu.db      # SQLite ma'lumotlar bazasi (avtomatik)
└── uploads/          # Yuklangan rasmlar va PDF (avtomatik)
```

## Konfiguratsiya (.env) — to'liq ro'yxat namunasi `.env.example`'da

**Ma'lumotlar bazasi va fayllar:**
- `DATABASE_URL` — Supabase PostgreSQL ulanish satri (pooler). Bo'sh = mahalliy SQLite.
- `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` — Supabase Storage. Bo'sh = mahalliy `uploads/`.
- `SUPABASE_BUCKET` — Storage bucket nomi (standart `uploads`, public bo'lishi kerak).

**Xavfsizlik:**
- `SECRET_KEY` — tokenlarni imzolash kaliti. Belgilanmasa har restartda yangisi yaratiladi.
- `ADMIN_PASSWORD` — standart `admin123` ni ALBATTA o'zgartiring.
- `ALLOWED_ORIGINS` — API'ga ruxsat etilgan domenlar (vergul bilan). `*` — faqat sinov uchun.
- `DEBUG` — production'da `false` (Werkzeug debugger RCE xavfini oldini oladi).
- `TOKEN_TTL_SECONDS` — token amal qilish muddati (standart 8 soat).

## Eslatmalar

- **Maksimal fayl hajmi**: rasm 25MB, qo'shimcha fayl 100MB. Faqat ruxsat etilgan turlar
  (rasm: jpg/png/..., fayl: pdf/doc/...) qabul qilinadi.
- **Baza** — mahalliy ishda SQLite (bitta fayl, sozlash shart emas). Production'da
  `DATABASE_URL` orqali Supabase PostgreSQL ishlatiladi va deploy'da o'chmaydi
  (qarang: `../DEPLOY.md`). Render Disk endi kerak emas.
- **Tokenlar imzolangan (stateless)** — HMAC-SHA256, muddati bor. `--workers 1` bilan
  ishlaydi; rate-limit ham worker ichida hisoblanadi.
- **Login rate-limit** — 5 daqiqada 10 urinishdan keyin 429 qaytaradi.
- Yanada qattiqroq production uchun: parol hashing (bcrypt) va alohida ma'lumotlar bazasi
  (PostgreSQL) tavsiya etiladi.
