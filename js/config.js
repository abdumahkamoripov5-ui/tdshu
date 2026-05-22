// ============================================
// TDShU — yagona backend manzili sozlamasi
// DEPLOY paytida FAQAT pastdagi PROD_API qatorini o'zgartiring.
// Bu fayl barcha sahifalarda eng birinchi yuklanadi.
// ============================================
(function () {
    // Render'dagi backend URL'ingiz (faqat production/Netlify uchun):
    var PROD_API = 'https://tdshu-backend.onrender.com';

    var h = location.hostname;

    // Mahalliy tarmoq IP'lari (10.x, 192.168.x, 172.16–31.x)
    var isLanIp = /^10\./.test(h) || /^192\.168\./.test(h) ||
                  /^172\.(1[6-9]|2\d|3[01])\./.test(h);

    if (h === 'localhost' || h === '127.0.0.1' || h === '') {
        // Mahalliy ish: backend localhost:5000 da
        // (Live Server boshqa portda bo'lsa ham backend shu yerda)
        window.TDSHU_API = 'http://localhost:5000';
    } else if (isLanIp) {
        // Tarmoq IP orqali ochilgan (masalan 10.80.0.49:5000) —
        // Flask saytni o'zi serve qiladi, backend xuddi shu manzilda.
        window.TDSHU_API = location.origin;
    } else {
        // Public domen (Netlify) — backend Render'da, alohida origin
        window.TDSHU_API = PROD_API;
    }
})();
