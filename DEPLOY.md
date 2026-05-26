# Saytni internetga chiqarish bo'yicha qo'llanma

Sayt 3 qismdan iborat: **Frontend** (statik HTML/CSS/JS), **Backend** (Flask) va **Supabase** (ma'lumotlar bazasi + fayllar). Har biri alohida deploy qilinadi.

## Umumiy reja

| Qism | Joy | Narxi |
|---|---|---|
| **Kod** | GitHub | Bepul |
| **Frontend** | Netlify (`tdshu.netlify.app`) | Bepul |
| **Backend** | Render (`tdshu-backend.onrender.com`) | Bepul (uxlab qoladi) |
| **Baza + fayllar** | Supabase (PostgreSQL + Storage) | Bepul |
| **Domen** (keyin) | `.uz` yoki `.com` | ~$10–25/yil |

> **Nega Supabase?** Render bepul tarifida disk har deploy'da o'chadi — maqolalar
> yo'qolardi. Supabase doimiy PostgreSQL bazasi va fayl ombori (Storage) beradi,
> avtomatik backup bilan. 1000+ foydalanuvchiga bemalol yetadi.

---

## 1-bosqich: GitHub'ga kodni joylash

### A) Akkaunt yarating (5 daq)
1. https://github.com sahifasiga o'ting → **Sign up**
2. Email, parol, foydalanuvchi nomini kiriting

### B) Git'ni o'rnating (agar yo'q bo'lsa)
1. https://git-scm.com/download/win — yuklab oling va o'rnating
2. PowerShell'ni qayta oching

### C) Loyihani Git bilan boshlang

PowerShell ochib `tdshu` papkaga o'ting va quyidagilarni yozing:

```powershell
cd C:\Users\User\Desktop\tdshu

# Git boshlash
git init
git add .
git commit -m "Saytning birinchi versiyasi"

# GitHub'da yangi repo yaratib oling: https://github.com/new
# Repo nomi: tdshu (yoki o'zingiz xohlagan nom)
# Public yoki Private — farqi yo'q

# Repo yaratilgach, GitHub ko'rsatadigan buyruqlarni bajaring:
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/tdshu.git
git push -u origin main
```

> **Eslatma**: `SIZNING_USERNAME` o'rniga o'zingizning GitHub username'ingizni yozing.

---

## 2-bosqich: Frontend — Netlify (eng oson)

1. https://netlify.com → **Sign up with GitHub**
2. Bosh sahifada **"Add new site" → "Import an existing project"**
3. **GitHub** ni tanlang, repo nomini bering (`tdshu`)
4. Sozlamalar:
   - **Build command**: bo'sh qoldiring
   - **Publish directory**: `.` (nuqta)
5. **Deploy site** tugmasini bosing

~30 soniyada sayt ishga tushadi. URL ko'rinishi: `https://random-name-123.netlify.app`

### Saytga chiroyli nom berish:
**Site settings → Change site name** → `tdshu-tarjima` deb yozing
Endi URL: `https://tdshu-tarjima.netlify.app`

✅ **Frontend tayyor!** Ammo backend o'zgartirilmasdan email yuborilmaydi.

---

## 3-bosqich: Supabase — ma'lumotlar bazasi va fayllar

Backend'ni Render'ga qo'yishdan **oldin** Supabase'ni tayyorlang.

### A) Loyiha yarating
1. https://supabase.com → **Start your project** → GitHub bilan kiring
2. **New project** → nom: `tdshu`, kuchli **Database Password** o'ylab toping (saqlab qo'ying!)
3. Region: `Central EU (Frankfurt)` (O'zbekistonga eng yaqini) → **Create new project**
4. ~2 daqiqada baza tayyor bo'ladi

### B) Ulanish satrini (DATABASE_URL) oling
1. Yuqori o'ngdagi **Connect** tugmasini bosing
2. **Connection string → Transaction pooler** (yoki **Session pooler**) ni tanlang
3. Ko'rinadigan satrni nusxalang, masalan:
   ```
   postgresql://postgres.abcdxyz:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
4. `[YOUR-PASSWORD]` o'rniga A-bosqichda o'ylab topgan parolingizni yozing.
   Bu — Render'ga qo'yiladigan `DATABASE_URL`. Jadvallarni backend o'zi yaratadi.

> **Pooler** satrini ishlating (port 6543/5432), to'g'ridan-to'g'ri ulanish emas —
> bepul tarifda ulanishlar soni cheklangan, pooler buni hal qiladi.

### C) Fayllar uchun Storage bucket yarating
1. Chap menyuda **Storage → New bucket**
2. Nom: `uploads`, **Public bucket** ni YOQING (rasmlar saytda ko'rinishi uchun)
3. **Create bucket**

### D) API kalitlarini oling
**Project Settings → API** sahifasida:
- **Project URL** → `SUPABASE_URL` (masalan `https://abcdxyz.supabase.co`)
- **service_role** kaliti → `SUPABASE_SERVICE_KEY`

> ⚠️ `service_role` kaliti — MAXFIY. Faqat Render'da (backend) saqlang,
> hech qachon frontend kodiga yoki GitHub'ga qo'ymang.

---

## 4-bosqich: Backend — Render

1. https://render.com → **Sign up with GitHub**
2. **New + → Web Service**
3. GitHub repo'ni tanlang (`tdshu`)
4. Sozlamalar:
   - **Name**: `tdshu-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --workers 1 --timeout 120`
   - **Instance Type**: **Free**

5. **Environment Variables** (pastda) — qo'shing:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Supabase **pooler** ulanish satri (3-bosqich B) |
   | `SUPABASE_URL` | Supabase **Project URL** (3-bosqich D) |
   | `SUPABASE_SERVICE_KEY` | Supabase **service_role** kaliti (3-bosqich D) |
   | `SUPABASE_BUCKET` | `uploads` |
   | `ADMIN_USERNAME` | `admin` (yoki o'zgartiring) |
   | `ADMIN_PASSWORD` | **kuchli parol yozing** (admin123 emas!) |
   | `SECRET_KEY` | uzun tasodifiy satr — `python -c "import secrets;print(secrets.token_hex(32))"` |
   | `ALLOWED_ORIGINS` | Netlify domeningiz, masalan `https://tdshu-tarjima.netlify.app` |
   | `DEBUG` | `false` |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | Gmail manzilingiz |
   | `SMTP_PASSWORD` | Gmail App Password |
   | `SMTP_FROM` | Gmail manzilingiz |
   | `NOTIFY_EMAIL` | Murojaatlar keladigan email |

   > **Muhim:** `SECRET_KEY` ni belgilamasangiz, server har qayta ishga tushganda
   > admin tizimdan chiqib ketadi. `ALLOWED_ORIGINS` ni o'z domeningizga
   > cheklash boshqa saytlarning API'ngizdan foydalanishini to'sadi.

   > **Eslatma:** `DATABASE_URL` va `SUPABASE_URL` belgilangani uchun backend
   > avtomatik Supabase'ni ishlatadi. Doimiy disk (Render Disk) **kerak emas** —
   > maqolalar bazada, fayllar Supabase Storage'da saqlanadi va deploy'da o'chmaydi.

6. **Create Web Service** ni bosing

~5 daqiqada backend ishga tushadi. URL: `https://tdshu-backend.onrender.com`

### Gmail App Password olish:
1. https://myaccount.google.com/security — 2-bosqichli tasdiqlashni yoqing
2. https://myaccount.google.com/apppasswords — yangi App Password yarating
3. Yaratilgan 16 belgili parolni `SMTP_PASSWORD` ga yozing

---

## 5-bosqich: Frontend'ni backend bilan bog'lash

1. **Render'dan olingan backend URL**'ni nusxalang (masalan `https://tdshu-backend.onrender.com`)
2. `js/config.js` faylini oching (backend manzili FAQAT shu bitta faylda)
3. Quyidagi qatorni toping va URL'ingizga o'zgartiring:
   ```js
   var PROD_API = 'https://tdshu-backend.onrender.com';
   ```
4. O'zgartirishni GitHub'ga yuboring:
   ```powershell
   git add js/config.js
   git commit -m "Backend URL ni yangilash"
   git push
   ```
5. Netlify avtomatik qayta deploy qiladi (~30 soniya)

✅ **Endi to'liq ishlaydi!** Aloqa formasi email yuboradi.

---

## 6-bosqich (ixtiyoriy): O'z domeningiz

### Variantlar:
- **`.uz`** domen — `Cctld.uz` (~$20/yil), `saytim.uz` (~$25/yil) — mahalliy obro'
- **`.com`** — Namecheap (~$10/yil), Cloudflare (~$8/yil) — xalqaro
- **`.org`** — universitet/ta'lim uchun mos

### Netlify'ga ulanish:
1. Domen sotib olgach, Netlify'da: **Domain settings → Add custom domain**
2. Domeningizni yozing (masalan `tdshu-tarjima.uz`)
3. Netlify ko'rsatadigan **DNS yozuvlarini** (A va CNAME) domen sotib olgan saytingizda sozlang
4. SSL sertifikati avtomatik o'rnatiladi (24 soat ichida)

---

## Tez-tez beriladigan savollar

**Sayt qancha turadi?**
Bepul tariflarda yiliga $0 (faqat domen olsangiz $10–25/yil).

**Render bepul tarif uxlab qoladi deysiz, bu nima degani?**
15 daqiqa ishlatilmagandan keyin backend uxlaydi. Birinchi so'rovda ~30 sekund kutish kerak. Keyin tezligi normal.

**Kuniga qancha tashrifchi ko'tara oladi?**
Netlify bepul tarifi oyiga 100GB trafik beradi. Bu kuniga ~10 000 tashrif. Render bepul tarif oyiga 750 soat. Yetarli.

**Ma'lumotlar bazasi yo'qoladimi?**
Yo'q. Maqolalar va murojaatlar **Supabase PostgreSQL** bazasida, fayllar (rasm/PDF)
**Supabase Storage**'da saqlanadi — Render deploy qilinganda ham o'chmaydi.
Supabase avtomatik kunlik backup ham oladi. (Render Disk endi kerak emas.)

**Supabase bepul tarifi yetadimi?**
Ha. Bepul tarifda 500MB baza + 1GB fayl ombori bor — bu minglab maqolaga yetadi.
Yagona shart: baza 7 kun ishlatilmasa "pauza"ga o'tadi (bir tugma bilan qayta yoqiladi);
sayt doim ishlatilgani uchun bu muammo bo'lmaydi.

**Yangiliklar va galereya ishlaydimi?**
Ha, ular tashqi servislardan oladi (kun.uz, Wikimedia, tsuos.uz). Internet ulansa yetadi.

---

## Yordam kerakmi?

Har bir bosqichni birga qilamiz — birortasida tushunmovchilik bo'lsa, ayting:

- "GitHub'ga qanday yuklayman?" — Git komandalarni tushuntiraman
- "Netlify'da xato chiqdi" — xato matnini yuboring, hal qilamiz
- "Render uxlab qolmasin desam-chi?" — pulli tarif yoki Cron-ping yechimi bor

Sayt internetda paydo bo'lganda menga URL'ni ko'rsating — birga sinab ko'ramiz!
