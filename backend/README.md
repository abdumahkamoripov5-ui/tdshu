# TDShU Backend

Flask + SQLite + SMTP backend. Maqolalarni, murojaatlarni saqlaydi va email yuboradi.

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

## Eslatmalar

- **Maqsimal fayl hajmi**: 200MB (kodda o'zgartirish mumkin: `MAX_UPLOAD_MB`)
- **SQLite** — bitta fayl, alohida server kerak emas
- **Tokenlar xotirada** — backend qayta ishga tushganda admin qaytadan kirishi kerak
- **CORS** — barcha domenlardan ruxsat (production'da cheklash tavsiya)
- Production uchun: nginx + gunicorn, JWT tokenlar, parol hashing kerak bo'ladi
