// build: 1780493004
const ADS_CONFIG = {
    publisherId: 'ca-pub-9442350195298931',
    adsterra: {
        banner320x50:  'f36658d42131ec282e9ddb99816dbca4',
        banner160x600: 'eba2ff3449ef46f7c120906aac6a42b7',
        banner300x250: 'fd66d93c42228f791d7d72b077964a6d',
        native:        'b004239438e274daed1a4cef1fe206b5'
    },
    safeMode: true,
    blockedCategories: ['adult', 'gambling', 'pharma']
};

const AdSession = {
    get: (key) => {
        try { return JSON.parse(sessionStorage.getItem('ads_' + key)); } catch(e) { return null; }
    },
    set: (key, val) => {
        try { sessionStorage.setItem('ads_' + key, JSON.stringify(val)); } catch(e) {}
    }
};

function checkAdBlock() {
    const test = document.createElement('div');
    test.className = 'ad adsbox pub_300x250';
    test.style.cssText = 'width:1px;height:1px;position:absolute;left:-9999px;';
    document.body.appendChild(test);
    setTimeout(() => {
        if (test.offsetHeight === 0 || test.offsetParent === null) {
            showAntiAdblockMessage();
        }
        test.remove();
    }, 500);
}

function showAntiAdblockMessage() {
    const already = AdSession.get('adblock_shown');
    if (already) return;
    AdSession.set('adblock_shown', true);

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed;
        bottom:20px;
        left:50%;
        transform:translateX(-50%);
        background:#1a1a2e;
        border:1px solid rgba(255,255,255,0.1);
        border-radius:16px;
        padding:14px 20px;
        z-index:99999;
        display:flex;
        align-items:center;
        gap:12px;
        max-width:320px;
        width:90%;
        box-shadow:0 8px 32px rgba(0,0,0,0.4);
    `;
    overlay.innerHTML = `
        <span style="font-size:22px;">🙏</span>
        <div style="flex:1;">
            <div style="color:#fff;font-size:13px;font-weight:700;margin-bottom:4px;">ساعد في دعم الموقع</div>
            <div style="color:#aaa;font-size:11px;">أوقف مانع الإعلانات عشان نقدر نكمل</div>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#666;font-size:18px;cursor:pointer;">✕</button>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 6000);
}

function shouldShowAds(userData) {
    if (!userData) return true;
    if (!userData.isPremium) return true;
    if (!userData.premiumUntil) return true;
    const until = userData.premiumUntil.toDate
        ? userData.premiumUntil.toDate()
        : new Date(userData.premiumUntil);
    if (until > new Date()) return false;
    return true;
}

function lazyLoad(wrapper, loadFn) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadFn(wrapper);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });
    observer.observe(wrapper);
}

/* ══════════════════════════════════════
   الإعلانات معزولة جوه iframe مستقل عشان
   أي document.write أو كود غريب من شبكة
   الإعلان يفضل حبيس جوه مكانه بالظبط
   ومايبوظش لاي أوت الصفحة أو "يطلع براه"

   ملاحظة: ارتفاع النيتيف ثابت (مش ديناميكي) عمدًا —
   شبكة Adsterra بترجع فييد فيه كذا إعلان جوه نفس
   الوحدة، فلو سبنا الارتفاع يتمدد حسب المحتوى
   هيظهروا كلهم فوق بعض.

   كمان في blur خفيف على محتوى الإعلان نفسه (مش بس
   الإطار) كإجراء أمان إضافي — لو شبكة الإعلانات سربت
   محتوى غير لائق (كازينو/+18) يفضل غير واضح تمامًا.
══════════════════════════════════════ */

function createAdsterraNative() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ad-card native-ad-card';
    wrapper.style.cssText = `
        background:#0d0d0d;
        border:1px solid rgba(255,255,255,0.06);
        border-radius:18px;
        padding:12px;
        margin:12px 0;
        overflow:hidden;
        width:100%;
        max-height:280px;
        box-sizing:border-box;
        position:relative;
    `;

    lazyLoad(wrapper, (el) => {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width:100%;
            height:260px;
            border:none;
            display:block;
            filter:blur(3px);
            transform:scale(1.02);
        `;
        iframe.scrolling = 'no';
        iframe.setAttribute('loading', 'lazy');
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    html,body{margin:0;padding:0;background:transparent;overflow:hidden;}
                </style>
            </head>
            <body>
                <script async data-cfasync="false"
                    src="https://www.highrevenueformat.com/${ADS_CONFIG.adsterra.native}/invoke.js"></script>
                <div id="container-${ADS_CONFIG.adsterra.native}"></div>
            </body>
            </html>
        `;
        el.appendChild(iframe);
    });
    return wrapper;
}

function createAdsterraBanner(size) {
    let key, width, height;

    if (size === '300x250') {
        key = ADS_CONFIG.adsterra.banner300x250;
        width = 300;
        height = 250;
    } else if (size === '160x600') {
        key = ADS_CONFIG.adsterra.banner160x600;
        width = 160;
        height = 600;
    } else {
        key = ADS_CONFIG.adsterra.banner320x50;
        width = 320;
        height = 50;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'ad-card banner-ad-card';
    wrapper.style.cssText = `
        display:flex;
        justify-content:center;
        align-items:center;
        background:#0d0d0d;
        border:1px solid rgba(255,255,255,0.06);
        border-radius:18px;
        padding:12px;
        margin:12px 0;
        overflow:hidden;
        min-height:${height + 24}px;
        width:100%;
        box-sizing:border-box;
        position:relative;
    `;

    lazyLoad(wrapper, (el) => {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width:${width}px;
            height:${height}px;
            max-width:100%;
            border:none;
            display:block;
            filter:blur(3px);
            transform:scale(1.02);
        `;
        iframe.scrolling = 'no';
        iframe.setAttribute('loading', 'lazy');
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;}</style>
            </head>
            <body>
                <script>
                    atOptions = {
                        'key': '${key}',
                        'format': 'iframe',
                        'height': ${height},
                        'width': ${width},
                        'params': {}
                    };
                <\/script>
                <script src="https://www.highrevenueformat.com/${key}/invoke.js"><\/script>
            </body>
            </html>
        `;
        el.appendChild(iframe);

        setTimeout(() => {
            // لو الإعلان فشل يحمل، رجّع نيتيف بدل البانر
            try {
                const doc = iframe.contentWindow.document;
                if (!doc.body || doc.body.scrollHeight < 10) {
                    el.innerHTML = '';
                    el.appendChild(createAdsterraNative());
                }
            } catch(e) {
                // لو فشل الوصول أصلاً (كروس أوريجن)، سيب الإعلان زي ما هو
            }
        }, 3000);
    });

    return wrapper;
}

const AdsManager = {
    init: function(userData) {
        this._showAds = shouldShowAds(userData);
        if (this._showAds && !this._adblockChecked) {
            this._adblockChecked = true;
            checkAdBlock();
        }
    },

    injectAds: function(feedEl) {
        if (!this._showAds) return;
        const cards = feedEl.querySelectorAll('.ans-card, .ask-card, .shout-inbox-card, .sada-card');
        let adIndex = 0;

        cards.forEach((card, i) => {
            // الكارت ده اتحط جنبه إعلان قبل كده — متكررش
            if (card.dataset.adAfter) return;

            const pos = i + 1;

            // إعلان واحد كل 3 بطاقات منشورات
            if (pos % 3 === 0) {
                adIndex++;
                let adCard;

                // نوّع الإعلانات
                if (adIndex % 2 === 0) {
                    adCard = createAdsterraBanner('300x250');
                } else {
                    adCard = createAdsterraNative();
                }

                card.dataset.adAfter = "1";
                card.after(adCard);
            }
        });
    }
};