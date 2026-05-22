// ============================================
// TDShU — yagona backend manzili sozlamasi
// DEPLOY paytida FAQAT pastdagi PROD_API qatorini o'zgartiring.
// Bu fayl barcha sahifalarda eng birinchi yuklanadi.
// ============================================
(function () {
    // Render'dagi backend URL'ingiz:
    var PROD_API = 'https://tdshu-backend.onrender.com';

    var isLocal = /localhost|127\.0\.0\.1/.test(location.hostname) || location.hostname === '';
    window.TDSHU_API = isLocal ? 'http://localhost:5000' : PROD_API;
})();
