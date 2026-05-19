// ============================================
// Sayt bo'ylab qidiruv
// Sahifa, o'qituvchi, til, ta'lim yo'nalishi, maqola bo'yicha
// ============================================

(function() {
    'use strict';

    const INDEX = [
        // Sahifalar
        { type: 'page', title: 'Bosh sahifa', subtitle: 'Asosiy sahifa', url: 'index.html', icon: 'fa-home', kw: 'tdshu tarjimashunoslik tilshunoslik xalqaro jurnalistika oliy maktab' },
        { type: 'page', title: "Oliy maktab haqida", subtitle: 'Tarix, missiya, yutuqlar', url: 'about.html', icon: 'fa-info-circle', kw: 'tarix missiya yutuqlar moddiy texnika baza hamkorlar 2024' },
        { type: 'page', title: "Ta'lim yo'nalishlari", subtitle: 'Bakalavriat, magistratura, doktorantura', url: 'faculties.html', icon: 'fa-graduation-cap', kw: 'bakalavriat magistratura doktorantura phd yo\'nalish' },
        { type: 'page', title: "O'qituvchilar", subtitle: 'Professor-o\'qituvchilar tarkibi', url: 'teachers.html', icon: 'fa-users', kw: 'professor dotsent o\'qituvchi muallim' },
        { type: 'page', title: 'Maqolalar', subtitle: 'Ilmiy maqolalar to\'plami', url: 'articles.html', icon: 'fa-newspaper', kw: 'maqola ilmiy tadqiqot' },
        { type: 'page', title: 'Maqola yuborish', subtitle: 'Yangi ilmiy maqola formasi', url: 'submit-article.html', icon: 'fa-paper-plane', kw: 'maqola yuborish forma' },
        { type: 'page', title: 'Yangiliklar', subtitle: "O'zbek OAV'laridan so'nggi xabarlar", url: 'news.html', icon: 'fa-bullhorn', kw: 'yangilik news media kun.uz gazeta.uz' },
        { type: 'page', title: 'Galereya', subtitle: 'Tematik rasmlar to\'plami', url: 'gallery.html', icon: 'fa-images', kw: 'galereya rasm foto tasvir' },
        { type: 'page', title: 'Aloqa', subtitle: 'Manzil, telefon, xarita', url: 'contact.html', icon: 'fa-envelope', kw: 'aloqa manzil telefon email xarita' },

        // O'qituvchilar
        { type: 'teacher', title: 'Mustafayeva Samida Toshmuxammedovna', subtitle: "Oliy maktab boshlig'i, FFD, dotsent", url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Xomidov Xayrillo Xudoyorovich', subtitle: 'Professor', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Usmanova Shoira Rustamovna', subtitle: 'Professor', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Omonov Qudratilla Sharipovich', subtitle: 'Professor, birinchi prorektor', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Nasirova Saodat Abdullayevna', subtitle: 'Professor', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Ismatullayeva Nargiza Rasuljonovna', subtitle: 'Dotsent', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Maxamadtoirova Adiba Botir qizi', subtitle: 'Dotsent', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: "Roziqulov Dilshod Shuhrat o'g'li", subtitle: 'Dotsent', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Saliyeva Muxabbat Kushanovna', subtitle: 'Dotsent', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Sharipov Rustam Husniddinovich', subtitle: 'Dotsent', url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Allanyazov Rustem Baxavedinovich', subtitle: "O'qituvchi", url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Elmuratova Ruxsora Tolibjanovna', subtitle: "O'qituvchi", url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Ergasheva Sadoqat Muratovna', subtitle: "O'qituvchi", url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Nazrullayeva Gulnoza Karimovna', subtitle: "O'qituvchi", url: 'teachers.html', icon: 'fa-user-tie' },
        { type: 'teacher', title: 'Taylanova Muqaddas Nazarboy qizi', subtitle: "O'qituvchi", url: 'teachers.html', icon: 'fa-user-tie' },

        // Tillar
        { type: 'lang', title: 'Arab tili', subtitle: "Semit tillari, 400+ million so'zlovchi", url: 'faculties.html', icon: 'fa-mosque' },
        { type: 'lang', title: 'Fors tili', subtitle: 'Hind-Yevropa, klassik sharq adabiyoti tili', url: 'faculties.html', icon: 'fa-feather' },
        { type: 'lang', title: 'Turk tili', subtitle: 'Turkiy tillar oilasi', url: 'faculties.html', icon: 'fa-star-and-crescent' },
        { type: 'lang', title: 'Hind tili', subtitle: 'Hindiston rasmiy tili', url: 'faculties.html', icon: 'fa-om' },
        { type: 'lang', title: 'Urdu tili', subtitle: 'Pokiston davlat tili', url: 'faculties.html', icon: 'fa-pen-nib' },
        { type: 'lang', title: 'Dariy tili', subtitle: "Afg'oniston rasmiy tili", url: 'faculties.html', icon: 'fa-scroll' },
        { type: 'lang', title: 'Xitoy tili', subtitle: "1.3 milliarddan ortiq so'zlovchi", url: 'faculties.html', icon: 'fa-dragon' },
        { type: 'lang', title: 'Yapon tili', subtitle: 'Yaponiyaning yagona rasmiy tili', url: 'faculties.html', icon: 'fa-torii-gate' },
        { type: 'lang', title: 'Koreys tili', subtitle: 'Hangul yozuvi', url: 'faculties.html', icon: 'fa-yin-yang' },
        { type: 'lang', title: 'Indonez tili', subtitle: 'Indoneziya davlat tili', url: 'faculties.html', icon: 'fa-globe-asia' },
        { type: 'lang', title: 'Malay tili', subtitle: 'Malayziya davlat tili', url: 'faculties.html', icon: 'fa-leaf' },

        // Yo'nalishlar
        { type: 'program', title: 'Tarjima nazariyasi va amaliyoti', subtitle: 'Bakalavriat, 4 yil', url: 'faculties.html', icon: 'fa-language' },
        { type: 'program', title: 'Xalqaro jurnalistika', subtitle: 'Bakalavriat, 4 yil', url: 'faculties.html', icon: 'fa-newspaper' },
        { type: 'program', title: "Yo'lboshchi va talqin faoliyati", subtitle: 'Bakalavriat, 4 yil', url: 'faculties.html', icon: 'fa-route' },
        { type: 'program', title: 'Qiyosiy tilshunoslik, lingvistik talqin', subtitle: 'Magistratura, 2 yil', url: 'faculties.html', icon: 'fa-book-open' },
        { type: 'program', title: 'Sinxron tarjima', subtitle: 'Magistratura, 2 yil', url: 'faculties.html', icon: 'fa-headphones' },
        { type: 'program', title: 'Doktorantura (PhD)', subtitle: 'Ilmiy daraja, 3 yil', url: 'faculties.html', icon: 'fa-flask' }
    ];

    const TYPE_LABEL = {
        page: 'Sahifa', teacher: "O'qituvchi", lang: 'Til',
        program: "Yo'nalish", article: 'Maqola'
    };

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function buildModal() {
        if (document.getElementById('siteSearchModal')) return;
        const m = document.createElement('div');
        m.id = 'siteSearchModal';
        m.className = 'site-search-overlay';
        m.innerHTML = `
            <div class="site-search-box">
                <div class="site-search-header">
                    <i class="fas fa-search"></i>
                    <input type="text" id="siteSearchInput" placeholder="Sayt bo'ylab qidirish...">
                    <kbd class="site-search-kbd">Esc</kbd>
                </div>
                <div class="site-search-results" id="siteSearchResults">
                    <div class="search-hint">
                        <i class="fas fa-search"></i>
                        <p>Sahifa, o'qituvchi, til, yo'nalish yoki maqola nomini yozing</p>
                        <p style="font-size: 12px; margin-top: 10px;">Tezkor kirish: <kbd>Ctrl</kbd> + <kbd>K</kbd></p>
                    </div>
                </div>
            </div>
        `;
        m.addEventListener('click', function(e) {
            if (e.target === m) closeSiteSearch();
        });
        document.body.appendChild(m);

        const input = document.getElementById('siteSearchInput');
        let debounce;
        input.addEventListener('input', function() {
            clearTimeout(debounce);
            debounce = setTimeout(performSearch, 120);
        });
    }

    async function performSearch() {
        const input = document.getElementById('siteSearchInput');
        const target = document.getElementById('siteSearchResults');
        const q = (input.value || '').toLowerCase().trim();

        if (!q) {
            target.innerHTML = `
                <div class="search-hint">
                    <i class="fas fa-search"></i>
                    <p>Sahifa, o'qituvchi, til, yo'nalish yoki maqola nomini yozing</p>
                </div>`;
            return;
        }

        let results = INDEX.filter(item => {
            const hay = ((item.title || '') + ' ' + (item.subtitle || '') + ' ' + (item.kw || '')).toLowerCase();
            return hay.includes(q);
        });

        // Tasdiqlangan maqolalarni IndexedDB'dan qidirish
        if (window.tdshuDB) {
            try {
                const articles = await window.tdshuDB.getArticles();
                articles.filter(a => a.status === 'approved').forEach(a => {
                    const t = ((a.title || '') + ' ' + (a.author || '') + ' ' +
                               (a.description || '') + ' ' + (a.category || '') + ' ' +
                               (a.keywords || '')).toLowerCase();
                    if (t.includes(q)) {
                        results.push({
                            type: 'article',
                            title: a.title,
                            subtitle: a.author + (a.category ? ' • ' + a.category : ''),
                            url: 'articles.html',
                            icon: 'fa-file-alt'
                        });
                    }
                });
            } catch (e) { /* sukutda */ }
        }

        if (!results.length) {
            target.innerHTML = `
                <div class="search-hint">
                    <i class="fas fa-inbox"></i>
                    <p>Hech nima topilmadi</p>
                    <p style="font-size: 12px;">Boshqa so'z bilan qidirib ko'ring</p>
                </div>`;
            return;
        }

        target.innerHTML = `
            <div class="search-results-count">${results.length} ta natija topildi</div>
        ` + results.slice(0, 30).map(r => `
            <a href="${r.url}" class="search-result">
                <div class="search-result-icon"><i class="fas ${r.icon}"></i></div>
                <div class="search-result-info">
                    <div class="search-result-title">${escapeHtml(r.title)}</div>
                    <div class="search-result-sub">${escapeHtml(r.subtitle || '')}</div>
                </div>
                <span class="search-result-type">${TYPE_LABEL[r.type] || r.type}</span>
            </a>
        `).join('');
    }

    window.openSiteSearch = function() {
        buildModal();
        document.getElementById('siteSearchModal').classList.add('show');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const i = document.getElementById('siteSearchInput');
            if (i) { i.focus(); i.select(); }
        }, 80);
    };

    window.closeSiteSearch = function() {
        const m = document.getElementById('siteSearchModal');
        if (m) m.classList.remove('show');
        document.body.style.overflow = '';
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSiteSearch();
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            openSiteSearch();
        }
    });

    // .search-icon ni bog'lash
    function bindSearchIcons() {
        document.querySelectorAll('.search-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openSiteSearch();
            }, true);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindSearchIcons);
    } else {
        bindSearchIcons();
    }
})();
