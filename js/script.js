// ============================================
// TDShU - Asosiy JavaScript fayli
// ============================================

// FILE -> Base64 konvertatsiya (rasm uchun)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Form qiymatini name bo'yicha xavfsiz olish
function getField(form, name) {
    const el = form.querySelector('[name="' + name + '"]');
    return el ? (el.value || '').trim() : '';
}

// MAQOLA YUBORISH FORMASI (IndexedDB orqali — katta fayllarni qo'llab-quvvatlaydi)
async function submitArticle(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
        }

        if (!window.tdshuDB) {
            alert('❌ Ma\'lumotlar bazasi ulanmagan (db.js yuklanmagan).');
            return;
        }

        // Hajm cheklovlari (MB) — IndexedDB GB hajmgacha qo'llab-quvvatlaydi
        const MAX_PHOTO_MB = 50;
        const MAX_ATTACH_MB = 500;

        // Rasm faylini olish (majburiy)
        const photoInput = form.querySelector('[name="photo"]');
        let photoBlob = null;
        if (photoInput && photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
            if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
                alert('⚠️ Rasm hajmi ' + MAX_PHOTO_MB + 'MB dan oshmasligi kerak.\nHozirgi hajmi: ' + (file.size / 1024 / 1024).toFixed(1) + 'MB');
                return;
            }
            photoBlob = file;
        }

        // Qo'shimcha fayl (ixtiyoriy)
        const attachInput = form.querySelector('[name="attachment"]');
        let attachmentBlob = null;
        let attachmentName = '';
        let attachmentType = '';
        if (attachInput && attachInput.files && attachInput.files[0]) {
            const file = attachInput.files[0];
            if (file.size > MAX_ATTACH_MB * 1024 * 1024) {
                alert('⚠️ Qo\'shimcha fayl hajmi ' + MAX_ATTACH_MB + 'MB dan oshmasligi kerak.\nHozirgi hajmi: ' + (file.size / 1024 / 1024).toFixed(1) + 'MB');
                return;
            }
            attachmentBlob = file;
            attachmentName = file.name;
            attachmentType = file.type;
        }

        const article = {
            id: Date.now(),
            title: getField(form, 'title'),
            author: getField(form, 'fullName'),
            position: getField(form, 'position'),
            department: getField(form, 'department'),
            subject: getField(form, 'subject'),
            category: getField(form, 'category'),
            keywords: getField(form, 'keywords'),
            email: getField(form, 'email'),
            phone: getField(form, 'phone'),
            description: getField(form, 'description'),
            content: getField(form, 'content'),
            photoBlob: photoBlob,
            attachmentBlob: attachmentBlob,
            attachmentName: attachmentName,
            attachmentType: attachmentType,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        try {
            await window.tdshuDB.saveArticle(article);
        } catch (e) {
            if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
                alert('⚠️ Brauzer xotirasi to\'lib qoldi!\n\nFaylni kichikroq qiling yoki admin paneldan eski maqolalarni o\'chiring.');
                return;
            }
            throw e;
        }

        alert('✅ Maqolangiz muvaffaqiyatli yuborildi!\n\n' +
              'Administrator tomonidan ko\'rib chiqilgandan so\'ng saytda chop etiladi.\n' +
              'Tasdiqlash 24-48 soat ichida amalga oshiriladi.');

        form.reset();
    } catch (err) {
        console.error(err);
        alert('❌ Xato yuz berdi: ' + (err.message || err));
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Maqolani yuborish';
        }
    }
}

// ALOQA FORMASI (IndexedDB orqali)
async function submitContact(event) {
    event.preventDefault();
    const form = event.target;

    try {
        if (!window.tdshuDB) {
            alert('❌ Ma\'lumotlar bazasi ulanmagan (db.js yuklanmagan).');
            return;
        }

        await window.tdshuDB.saveContact({
            id: Date.now(),
            name: getField(form, 'name'),
            phone: getField(form, 'phone'),
            email: getField(form, 'email'),
            type: getField(form, 'type'),
            subject: getField(form, 'subject'),
            message: getField(form, 'message'),
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            status: 'pending'
        });

        alert('✅ Murojaatingiz qabul qilindi!\n\n' +
              'Sizning xabaringiz universitet ma\'muriyatiga yuborildi.\n' +
              '24 soat ichida sizga javob beriladi.');

        form.reset();
    } catch (err) {
        console.error(err);
        alert('❌ Xato yuz berdi: ' + (err.message || err));
    }
}

// MAQOLALAR SAHIFASIDA dinamik yuklash (IndexedDB orqali)
let _approvedArticlesCache = [];

async function loadApprovedArticles() {
    const container = document.querySelector('.articles-grid');
    if (!container || !window.tdshuDB) return;

    let articles = [];
    try {
        articles = await window.tdshuDB.getArticles();
    } catch (e) {
        console.error('Maqolalarni yuklab bo\'lmadi:', e);
        return;
    }
    const approved = articles.filter(a => a.status === 'approved');
    _approvedArticlesCache = approved;

    const emptyState = document.getElementById('emptyArticles') || document.getElementById('indexEmptyArticles');

    if (approved.length > 0) {
        const newCards = approved.map(article => `
            <div class="article-card">
                <div class="article-header">
                    <div class="teacher-photo">
                        ${article.photoURL
                            ? `<img src="${article.photoURL}" alt="${escapeAttr(article.author)}">`
                            : `<i class="fas fa-user-tie" style="font-size: 28px; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; height: 100%;"></i>`}
                    </div>
                    <div class="teacher-info">
                        <h4>${escapeHtml(article.author)}</h4>
                        <span>${escapeHtml(article.position || '')}</span>
                    </div>
                </div>
                <div class="article-body">
                    <h3>${escapeHtml(article.title)}</h3>
                    <p>${escapeHtml(article.description)}</p>
                    <div class="article-meta">
                        <span class="subject-badge">${escapeHtml(article.category)}</span>
                        <span><i class="far fa-calendar"></i> ${escapeHtml(article.date)}</span>
                    </div>
                    <button class="article-read-btn" onclick="openArticle(${article.id})">
                        <i class="fas fa-book-open"></i> Batafsil o'qish
                    </button>
                </div>
            </div>
        `).join('');
        container.innerHTML = newCards;

        if (emptyState) emptyState.style.display = 'none';

        // Modal HTML'ni bir marta sahifaga qo'shamiz
        ensureArticleModal();
    }
}

// ============================================
// MAQOLA MODALI — to'liq matn va fayl yuklash
// ============================================
function ensureArticleModal() {
    if (document.getElementById('publicArticleModal')) return;
    const modal = document.createElement('div');
    modal.id = 'publicArticleModal';
    modal.className = 'art-modal-overlay';
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeArticle();
    });
    modal.innerHTML = `
        <div class="art-modal">
            <div class="art-modal-header">
                <div class="art-modal-author">
                    <div class="art-modal-photo" id="artModalPhoto"></div>
                    <div>
                        <h3 id="artModalAuthor"></h3>
                        <p id="artModalPosition"></p>
                    </div>
                </div>
                <button class="art-modal-close" onclick="closeArticle()" aria-label="Yopish">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="art-modal-body">
                <h1 id="artModalTitle"></h1>
                <div class="art-modal-meta" id="artModalMeta"></div>
                <div id="artModalDescription" class="art-modal-description"></div>
                <div id="artModalContent" class="art-modal-content"></div>
                <div id="artModalKeywords"></div>
                <div id="artModalAttachment"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Esc bilan yopish
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeArticle();
        }
    });
}

window.openArticle = async function(id) {
    let article = _approvedArticlesCache.find(a => a.id === id);
    if (!article && window.tdshuDB) {
        try { article = await window.tdshuDB.getArticle(id); } catch (e) {}
    }
    if (!article) return;

    ensureArticleModal();

    const photoEl = document.getElementById('artModalPhoto');
    if (article.photoURL) {
        photoEl.innerHTML = `<img src="${article.photoURL}" alt="${escapeAttr(article.author)}">`;
    } else {
        photoEl.innerHTML = '<i class="fas fa-user-tie"></i>';
    }

    document.getElementById('artModalAuthor').textContent = article.author || '';
    document.getElementById('artModalPosition').textContent = article.position || '';
    document.getElementById('artModalTitle').textContent = article.title || '';

    const metaParts = [];
    if (article.category)   metaParts.push(`<span class="subject-badge">${escapeHtml(article.category)}</span>`);
    if (article.department) metaParts.push(`<span><i class="fas fa-graduation-cap"></i> ${escapeHtml(article.department)}</span>`);
    if (article.subject)    metaParts.push(`<span><i class="fas fa-book"></i> ${escapeHtml(article.subject)}</span>`);
    if (article.date)       metaParts.push(`<span><i class="far fa-calendar"></i> ${escapeHtml(article.date)}</span>`);
    document.getElementById('artModalMeta').innerHTML = metaParts.join('');

    document.getElementById('artModalDescription').innerHTML = article.description
        ? `<div class="art-section-label">Annotatsiya</div><p>${escapeHtml(article.description)}</p>`
        : '';

    document.getElementById('artModalContent').innerHTML = article.content
        ? `<div class="art-section-label">Maqola matni</div><div class="art-content-text">${escapeHtml(article.content).replace(/\n/g, '<br>')}</div>`
        : '';

    document.getElementById('artModalKeywords').innerHTML = article.keywords
        ? `<div class="art-section-label">Kalit so'zlar</div><p style="color: var(--accent-blue);">${escapeHtml(article.keywords)}</p>`
        : '';

    document.getElementById('artModalAttachment').innerHTML = article.attachmentURL
        ? `<a href="${article.attachmentURL}" download="${escapeAttr(article.attachmentName || 'fayl')}" class="art-attachment-btn">
             <i class="fas fa-file-download"></i> Faylni yuklab olish: ${escapeHtml(article.attachmentName || 'fayl')}
           </a>`
        : '';

    document.getElementById('publicArticleModal').classList.add('show');
    document.body.style.overflow = 'hidden';
};

window.closeArticle = function() {
    const modal = document.getElementById('publicArticleModal');
    if (modal) modal.classList.remove('show');
    document.body.style.overflow = '';
};

function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// SCROLL ANIMATION
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.faculty-card, .article-card, .news-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// SEARCH ICON
document.querySelectorAll('.search-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const query = prompt('Qidirayotgan ma\'lumotingizni kiriting:');
        if (query) {
            alert(`Qidiruv: "${query}"\n\n(Qidiruv tizimi keyinroq qo'shiladi.)`);
        }
    });
});

// Tasdiqlangan maqolalarni yuklash
loadApprovedArticles();

console.log('%c🎓 Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi', 'color: #1e4d8b; font-size: 20px; font-weight: bold;');
console.log('Admin panel: /admin-login.html (login: admin, parol: admin123)');
