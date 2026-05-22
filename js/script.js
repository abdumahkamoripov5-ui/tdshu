// ============================================
// TDShU - Asosiy JavaScript fayli (backend API orqali)
// ============================================

// Form qiymatini name bo'yicha xavfsiz olish
function getField(form, name) {
    const el = form.querySelector('[name="' + name + '"]');
    return el ? (el.value || '').trim() : '';
}

// Backend manzili js/config.js da belgilanadi (production URL faqat o'sha yerda).
window.TDSHU_API = window.TDSHU_API || 'http://localhost:5000';

// Fayl hajmi cheklovlari (backend bilan mos) — MB
const MAX_PHOTO_MB = 25;
const MAX_ATTACH_MB = 100;

// MAQOLA YUBORISH FORMASI — backend API ('/api/articles', multipart)
async function submitArticle(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        // Hajm tekshiruvi (serverga ortiqcha yuk bormasligi uchun)
        const photoInput = form.querySelector('[name="photo"]');
        if (photoInput && photoInput.files && photoInput.files[0]) {
            const f = photoInput.files[0];
            if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
                alert('⚠️ Rasm hajmi ' + MAX_PHOTO_MB + 'MB dan oshmasligi kerak.\nHozirgi hajmi: ' + (f.size / 1024 / 1024).toFixed(1) + 'MB');
                return;
            }
        }
        const attachInput = form.querySelector('[name="attachment"]');
        if (attachInput && attachInput.files && attachInput.files[0]) {
            const f = attachInput.files[0];
            if (f.size > MAX_ATTACH_MB * 1024 * 1024) {
                alert('⚠️ Qo\'shimcha fayl hajmi ' + MAX_ATTACH_MB + 'MB dan oshmasligi kerak.\nHozirgi hajmi: ' + (f.size / 1024 / 1024).toFixed(1) + 'MB');
                return;
            }
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
        }

        // Forma maydonlari va fayllarni to'g'ridan-to'g'ri yuborish
        const fd = new FormData(form);

        const res = await fetch(window.TDSHU_API + '/api/articles', {
            method: 'POST',
            body: fd
        });

        if (!res.ok) {
            let msg = 'Server xatosi (' + res.status + ')';
            try { const d = await res.json(); if (d.error) msg = d.error; } catch (e) {}
            throw new Error(msg);
        }

        alert('✅ Maqolangiz muvaffaqiyatli yuborildi!\n\n' +
              'Administrator tomonidan ko\'rib chiqilgandan so\'ng saytda chop etiladi.\n' +
              'Tasdiqlash 24-48 soat ichida amalga oshiriladi.');

        form.reset();
    } catch (err) {
        console.error(err);
        alert('❌ Yuborib bo\'lmadi: ' + (err.message || err) +
              '\n\nServer vaqtincha ishlamayotgan bo\'lishi mumkin. Birozdan keyin qayta urinib ko\'ring.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Maqolani yuborish';
        }
    }
}

// ALOQA FORMASI — backend API ('/api/contacts')
async function submitContact(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    const payload = {
        name: getField(form, 'name'),
        phone: getField(form, 'phone'),
        email: getField(form, 'email'),
        type: getField(form, 'type'),
        subject: getField(form, 'subject'),
        message: getField(form, 'message')
    };

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
        }

        const res = await fetch(window.TDSHU_API + '/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            let msg = 'Server xatosi (' + res.status + ')';
            try { const d = await res.json(); if (d.error) msg = d.error; } catch (e) {}
            throw new Error(msg);
        }

        const data = await res.json().catch(() => ({}));
        alert(data.email_sent
            ? '✅ Murojaatingiz qabul qilindi va emailga yuborildi!\n\n24 soat ichida sizga javob beriladi.'
            : '✅ Murojaatingiz qabul qilindi!\n\nServerga saqlandi. 24 soat ichida javob beriladi.');

        form.reset();
    } catch (err) {
        console.error(err);
        alert('❌ Yuborib bo\'lmadi: ' + (err.message || err) +
              '\n\nServer vaqtincha ishlamayotgan bo\'lishi mumkin. Birozdan keyin qayta urinib ko\'ring.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Yuborish';
        }
    }
}

// Backend maydonlarini ko'rsatish uchun moslashtirish
function normalizeArticle(a) {
    a.date = a.created_at ? String(a.created_at).split('T')[0] : (a.date || '');
    a.photoURL = a.photo_url || '';
    a.attachmentURL = a.attachment_url || '';
    a.attachmentName = a.attachment_name || '';
    return a;
}

// MAQOLALAR SAHIFASIDA dinamik yuklash (backend API orqali)
let _approvedArticlesCache = [];

async function loadApprovedArticles() {
    const container = document.querySelector('.articles-grid');
    if (!container) return;

    const emptyState = document.getElementById('emptyArticles') || document.getElementById('indexEmptyArticles');

    let approved = [];
    try {
        const res = await fetch(window.TDSHU_API + '/api/articles');
        if (!res.ok) throw new Error('xato');
        approved = (await res.json()).map(normalizeArticle);
    } catch (e) {
        console.warn('Maqolalarni yuklab bo\'lmadi:', e.message);
        if (emptyState) emptyState.style.display = '';
        return;
    }
    _approvedArticlesCache = approved;

    if (approved.length > 0) {
        container.innerHTML = approved.map(article => `
            <div class="article-card">
                <div class="article-header">
                    <div class="teacher-photo">
                        ${article.photoURL
                            ? `<img src="${escapeAttr(article.photoURL)}" alt="${escapeAttr(article.author)}">`
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

        if (emptyState) emptyState.style.display = 'none';
        ensureArticleModal();
    } else {
        if (emptyState) emptyState.style.display = '';
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
    if (!article) {
        try {
            const res = await fetch(window.TDSHU_API + '/api/articles/' + id);
            if (res.ok) article = normalizeArticle(await res.json());
        } catch (e) {}
    }
    if (!article) return;

    ensureArticleModal();

    const photoEl = document.getElementById('artModalPhoto');
    if (article.photoURL) {
        photoEl.innerHTML = `<img src="${escapeAttr(article.photoURL)}" alt="${escapeAttr(article.author)}">`;
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
        ? `<a href="${escapeAttr(article.attachmentURL)}" download="${escapeAttr(article.attachmentName || 'fayl')}" class="art-attachment-btn">
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

// SEARCH ICON — search.js orqali boshqariladi

// Tasdiqlangan maqolalarni yuklash
loadApprovedArticles();

console.log('%c🎓 Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi', 'color: #1e4d8b; font-size: 20px; font-weight: bold;');
