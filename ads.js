// build: 1780493004
const ADS_CONFIG = {
    publisherId: 'ca-pub-9442350195298931',
    slots: {
        feed:    '1551654347',
        display: '5299327669'
    },
    adsterra: {
        banner320x50:  'f36658d42131ec282e9ddb99816dbca4',
        banner300x250: 'fd66d93c42228f791d7d72b077964a6d'
    }
};

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

    if (document.querySelector(`script[src="${ADS_CONFIG.adsterra.socialBar}"]`)) return;
    const s = document.createElement('script');
    s.src = ADS_CONFIG.adsterra.socialBar;
    s.async = true;
    document.body.appendChild(s);
}

function createAdsterraBanner(size, onLoad) {
    const isLarge = size === '300x250';
    const key     = isLarge ? ADS_CONFIG.adsterra.banner300x250 : ADS_CONFIG.adsterra.banner320x50;
    const width   = isLarge ? 300 : 320;
    const height  = isLarge ? 250 : 50;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
        display:none;
        justify-content:center;
        align-items:center;
        margin:10px 0;
        background:#0d0d0d;
        border:1px solid rgba(255,255,255,0.06);
        border-radius:18px;
        padding:10px;
        overflow:hidden;
        min-height:${height + 20}px;
        position:relative;
    `;

    const blurOverlay = document.createElement('div');
    blurOverlay.style.cssText = `
        position:absolute;
        inset:0;
        backdrop-filter:blur(6px);
        -webkit-backdrop-filter:blur(6px);
        background:rgba(13,13,13,0.15);
        z-index:10;
        border-radius:18px;
        pointer-events:none;
    `;
    wrapper.appendChild(blurOverlay);

    const scriptOptions = document.createElement('script');
    scriptOptions.type = 'text/javascript';
    scriptOptions.text = `
        atOptions = {
            'key': '${key}',
            'format': 'iframe',
            'height': ${height},
            'width': ${width},
            'params': {}
        };
    `;

    const scriptInvoke = document.createElement('script');
    scriptInvoke.type = 'text/javascript';
    scriptInvoke.src = `https://assistedtogether.com/${key}/invoke.js`;

    scriptInvoke.onload = () => {
        wrapper.style.display = 'flex';
        if (typeof onLoad === 'function') onLoad();
    };

    scriptInvoke.onerror = () => {
        wrapper.remove();
    };

    setTimeout(() => {
        if (wrapper.style.display === 'none') wrapper.remove();
    }, 3000);

    wrapper.appendChild(scriptOptions);
    wrapper.appendChild(scriptInvoke);
    return wrapper;
}

const AdsManager = {

    init: function(userData) {
        if (this._initialized) return;
        this._initialized = true;
        this._showAds = shouldShowAds(userData);
        if (this._showAds) {
            this.injectStaticAd('AD_LOGIN_BOTTOM');
            this.injectStaticAd('AD_PROFILE_TOP');
            const topBanner = document.getElementById('topAdBanner');
            if (topBanner) {
                topBanner.style.display = 'none';
                const banner = createAdsterraBanner('320x50', () => {
                    topBanner.style.display = 'flex';
                });
                const invokeScript = banner.querySelector('script[src]');
                if (invokeScript) {
                    invokeScript.addEventListener('error', () => {
                        topBanner.style.display = 'none';
                    });
                }
                topBanner.appendChild(banner);
            }
        }
    },

    injectAds: function(feedEl) {
        if (!this._showAds) return;
        const cards = feedEl.querySelectorAll('.ans-card, .ask-card, .shout-inbox-card, .sada-card');
        cards.forEach((card, i) => {
            const pos = i + 1;

            if (pos % 8 === 0) {
                const b = createAdsterraBanner('300x250');
                card.after(b);

            } else if (pos % 99 === 0) {
                const b = createAdsterraBanner('320x50');
                card.after(b);
            }

            if (pos % 4 === 0) {
                const ipScript = document.createElement('script');
                ipScript.dataset.zone = '11116179';
                ipScript.src = 'https://nap5k.com/tag.min.js';
                ipScript.async = true;
                const ipWrapper = document.createElement('div');
                ipWrapper.style.cssText = 'margin:10px 0;border-radius:18px;overflow:hidden;display:block;';
                ipWrapper.appendChild(ipScript);
                card.after(ipWrapper);
            }

            if (pos % 12 === 0) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    display:none;
                    position:relative;
                    background:#0d0d0d;
                    border:1px solid rgba(255,255,255,0.06);
                    border-radius:18px;
                    padding:12px;
                    margin-bottom:12px;
                    width:100%;
                    overflow:hidden;
                    justify-content:center;
                `;
                const blurFeed = document.createElement('div');
                blurFeed.style.cssText = `
                    position:absolute;
                    inset:0;
                    backdrop-filter:blur(6px);
                    -webkit-backdrop-filter:blur(6px);
                    background:rgba(13,13,13,0.15);
                    z-index:10;
                    border-radius:18px;
                    pointer-events:none;
                `;
                wrapper.appendChild(blurFeed);
                const ins = document.createElement('ins');
                ins.className = 'adsbygoogle';
                ins.style.cssText = 'display:block;width:100%;max-width:320px;';
                ins.setAttribute('data-ad-client', ADS_CONFIG.publisherId);
                ins.setAttribute('data-ad-slot', ADS_CONFIG.slots.feed);
                ins.setAttribute('data-ad-format', 'auto');
                ins.setAttribute('data-full-width-responsive', 'true');
                wrapper.appendChild(ins);
                card.after(wrapper);

                setTimeout(() => {
                    try {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        const observer = new MutationObserver(() => {
                            if (ins.getAttribute('data-ad-status') === 'filled') {
                                wrapper.style.display = 'flex';
                                observer.disconnect();
                            } else if (ins.getAttribute('data-ad-status') === 'unfilled') {
                                wrapper.remove();
                                observer.disconnect();
                            }
                        });
                        observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
                        setTimeout(() => {
                            if (wrapper.style.display === 'none') wrapper.remove();
                        }, 5000);
                    } catch(e) {
                        wrapper.remove();
                    }
                }, 150);
            }
        });
    },

    injectStaticAd: function(containerId) {
        if (!this._showAds) return;
        const el = document.getElementById(containerId);
        if (!el) return;

        el.style.display = 'none';
        el.style.position = 'relative';
        el.style.overflow = 'hidden';

        const blur = document.createElement('div');
        blur.style.cssText = `
            position:absolute;
            inset:0;
            backdrop-filter:blur(6px);
            -webkit-backdrop-filter:blur(6px);
            background:rgba(13,13,13,0.15);
            z-index:10;
            border-radius:inherit;
            pointer-events:none;
        `;
        el.appendChild(blur);

        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.cssText = 'display:block;width:100%;';
        ins.setAttribute('data-ad-client', ADS_CONFIG.publisherId);
        ins.setAttribute('data-ad-slot', ADS_CONFIG.slots.display);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');
        el.appendChild(ins);

        setTimeout(() => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                const observer = new MutationObserver(() => {
                    if (ins.getAttribute('data-ad-status') === 'filled') {
                        el.style.display = 'block';
                        observer.disconnect();
                    } else if (ins.getAttribute('data-ad-status') === 'unfilled') {
                        el.style.display = 'none';
                        observer.disconnect();
                    }
                });
                observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
                setTimeout(() => {
                    if (el.style.display === 'none') el.remove();
                }, 5000);
            } catch(e) {
                el.style.display = 'none';
            }
        }, 100);
    }
};