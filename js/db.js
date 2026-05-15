// ============================================
// IndexedDB wrapper — katta fayllar uchun
// localStorage o'rniga, GB hajmgacha saqlash
// ============================================

(function(global) {
    'use strict';

    var DB_NAME = 'tdshu_db';
    var DB_VERSION = 1;
    var dbPromise = null;

    function openDB() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise(function(resolve, reject) {
            var req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = function(e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains('articles')) {
                    db.createObjectStore('articles', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('contacts')) {
                    db.createObjectStore('contacts', { keyPath: 'id' });
                }
            };
            req.onsuccess = function() { resolve(req.result); };
            req.onerror = function() { reject(req.error); };
        });
        return dbPromise;
    }

    function tx(storeName, mode) {
        return openDB().then(function(db) {
            return db.transaction(storeName, mode).objectStore(storeName);
        });
    }

    function reqToPromise(req) {
        return new Promise(function(resolve, reject) {
            req.onsuccess = function() { resolve(req.result); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function getAll(storeName) {
        return tx(storeName, 'readonly').then(function(store) {
            return reqToPromise(store.getAll());
        });
    }

    function getOne(storeName, id) {
        return tx(storeName, 'readonly').then(function(store) {
            return reqToPromise(store.get(id));
        });
    }

    function put(storeName, item) {
        return tx(storeName, 'readwrite').then(function(store) {
            return reqToPromise(store.put(item));
        });
    }

    function del(storeName, id) {
        return tx(storeName, 'readwrite').then(function(store) {
            return reqToPromise(store.delete(id));
        });
    }

    function clear(storeName) {
        return tx(storeName, 'readwrite').then(function(store) {
            return reqToPromise(store.clear());
        });
    }

    // ===== Bir martalik migratsiya: localStorage -> IndexedDB =====
    var migrationPromise = null;
    function migrate() {
        if (migrationPromise) return migrationPromise;
        migrationPromise = (function() {
            try {
                if (localStorage.getItem('tdshu_migrated_v1') === '1') {
                    return Promise.resolve();
                }
                var articles = [];
                var contacts = [];
                try { articles = JSON.parse(localStorage.getItem('articles') || '[]'); } catch (e) {}
                try { contacts = JSON.parse(localStorage.getItem('contacts') || '[]'); } catch (e) {}

                var ops = [];
                articles.forEach(function(a) { ops.push(put('articles', a)); });
                contacts.forEach(function(c) { ops.push(put('contacts', c)); });

                return Promise.all(ops).then(function() {
                    localStorage.removeItem('articles');
                    localStorage.removeItem('contacts');
                    localStorage.setItem('tdshu_migrated_v1', '1');
                });
            } catch (e) {
                console.warn('Migration skipped:', e);
                return Promise.resolve();
            }
        })();
        return migrationPromise;
    }

    // ===== Object URL keshini boshqarish =====
    var urlCache = new Map();
    function makeURL(blob) {
        if (!blob || typeof blob !== 'object') return '';
        // Eski base64 string'lar uchun (migratsiyadan oldingi ma'lumot)
        if (typeof blob === 'string') return blob;
        if (urlCache.has(blob)) return urlCache.get(blob);
        try {
            var url = URL.createObjectURL(blob);
            urlCache.set(blob, url);
            return url;
        } catch (e) {
            return '';
        }
    }

    // Maqolaga photoURL/attachmentURL qo'shadi (renderlash uchun)
    function decorate(item) {
        if (!item) return item;
        // Yangi format: photoBlob/attachmentBlob (Blob)
        if (item.photoBlob) {
            item.photoURL = makeURL(item.photoBlob);
        } else if (item.photo && typeof item.photo === 'string') {
            // Eski format: photo base64 string
            item.photoURL = item.photo;
        }
        if (item.attachmentBlob) {
            item.attachmentURL = makeURL(item.attachmentBlob);
        } else if (item.attachment && typeof item.attachment === 'string') {
            item.attachmentURL = item.attachment;
        }
        return item;
    }

    // ===== Public API =====
    global.tdshuDB = {
        ready: function() { return migrate(); },

        getArticles: function() {
            return migrate().then(function() { return getAll('articles'); })
                .then(function(items) { return items.map(decorate); });
        },
        getArticle: function(id) {
            return migrate().then(function() { return getOne('articles', id); })
                .then(decorate);
        },
        saveArticle: function(article) {
            return migrate().then(function() { return put('articles', article); });
        },
        deleteArticle: function(id) {
            return migrate().then(function() { return del('articles', id); });
        },

        getContacts: function() {
            return migrate().then(function() { return getAll('contacts'); });
        },
        saveContact: function(contact) {
            return migrate().then(function() { return put('contacts', contact); });
        },
        deleteContact: function(id) {
            return migrate().then(function() { return del('contacts', id); });
        },

        clearAll: function() {
            return Promise.all([clear('articles'), clear('contacts')]);
        },

        // Eksport uchun (JSON, fayllarsiz)
        exportJSON: function() {
            return Promise.all([getAll('articles'), getAll('contacts')]).then(function(r) {
                var articles = r[0].map(function(a) {
                    var copy = Object.assign({}, a);
                    delete copy.photoBlob;
                    delete copy.attachmentBlob;
                    if (copy.photoBlob) copy.photo = '[Blob fayl saqlangan]';
                    if (copy.attachmentBlob) copy.attachment = '[Blob fayl saqlangan: ' + (a.attachmentName || '') + ']';
                    return copy;
                });
                return {
                    exportedAt: new Date().toISOString(),
                    articles: articles,
                    contacts: r[1]
                };
            });
        }
    };
})(window);
