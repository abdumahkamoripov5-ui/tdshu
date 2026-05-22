# Saytni internetga chiqarish bo'yicha qo'llanma

Sayt 2 qismdan iborat: **Frontend** (statik HTML/CSS/JS) va **Backend** (Flask). Ikkalasi alohida deploy qilinadi.

## Umumiy reja

| Qism | Joy | Narxi |
|---|---|---|
| **Kod** | GitHub | Bepul |
| **Frontend** | Netlify (`tdshu.netlify.app`) | Bepul |
| **Backend** | Render (`tdshu-backend.onrender.com`) | Bepul (uxlab qoladi) |
| **Domen** (keyin) | `.uz` yoki `.com` | ~$10–25/yil |

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

## 3-bosqich: Backend — Render

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

6. **(Tavsiya) Doimiy disk** — `Disks` bo'limida disk qo'shing va `Mount Path`
   ni `/opt/render/project/src/backend/data` (va alohida `.../uploads`) qiling.
   Aks holda Render bepul tarifida har deploy'da maqolalar va fayllar o'chadi.

7. **Create Web Service** ni bosing

~5 daqiqada backend ishga tushadi. URL: `https://tdshu-backend.onrender.com`

### Gmail App Password olish:
1. https://myaccount.google.com/security — 2-bosqichli tasdiqlashni yoqing
2. https://myaccount.google.com/apppasswords — yangi App Password yarating
3. Yaratilgan 16 belgili parolni `SMTP_PASSWORD` ga yozing

---

## 4-bosqich: Frontend'ni backend bilan bog'lash

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

## 5-bosqich (ixtiyoriy): O'z domeningiz

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
Render bepul tarifda fayllar saqlanmaydi (har deploy'da o'chadi). Buning uchun:
- Render'ning **PostgreSQL** bepul bazasiga o'tish, yoki
- Mahalliyda muhim ma'lumotlarni admin orqali eksport qilish (JSON)
- Yoki har oyda backup olib turish

**Yangiliklar va galereya ishlaydimi?**
Ha, ular tashqi servislardan oladi (kun.uz, Wikimedia, tsuos.uz). Internet ulansa yetadi.

---

## Yordam kerakmi?

Har bir bosqichni birga qilamiz — birortasida tushunmovchilik bo'lsa, ayting:

- "GitHub'ga qanday yuklayman?" — Git komandalarni tushuntiraman
- "Netlify'da xato chiqdi" — xato matnini yuboring, hal qilamiz
- "Render uxlab qolmasin desam-chi?" — pulli tarif yoki Cron-ping yechimi bor

Sayt internetda paydo bo'lganda menga URL'ni ko'rsating — birga sinab ko'ramiz!
