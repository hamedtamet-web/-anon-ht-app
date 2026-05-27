const ADS_CONFIG = {
    loginAds: {
        topHTML: `<div style="color:#444;font-size:12px;">إعلان علوي</div>`,
        sideHTML: `<div style="color:#333;font-size:11px;">مساحة إعلانية</div>`,
        bottomHTML: `<div style="color:#444;font-size:12px;">إعلان سفلي</div>`
    },
    feedAds: {
        adHTML: `
            <div style="background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.1);
                        border-radius:20px;padding:15px;margin:20px 0;text-align:center;">
                <span style="display:block;font-size:9px;color:#444;font-weight:900;">إعلان</span>
                <div style="min-height:100px;display:flex;align-items:center;
                            justify-content:center;color:#555;font-size:13px;">
                    مساحة إعلانية متوفرة
                </div>
            </div>`,
        frequency: 5
    }
};

const AdsManager = {
    injectAds: function(feedEl) {
        const cards = feedEl.querySelectorAll('.ans-card');
        const freq = ADS_CONFIG.feedAds.frequency;
        cards.forEach((card, i) => {
            if ((i + 1) % freq === 0) {
                const ad = document.createElement('div');
                ad.innerHTML = ADS_CONFIG.feedAds.adHTML;
                card.after(ad);
            }
        });
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const topAd    = document.getElementById('AD_LOGIN_TOP');
    const sideAd   = document.getElementById('AD_LOGIN_SIDE');
    const bottomAd = document.getElementById('AD_LOGIN_BOTTOM');
    if (topAd)    topAd.innerHTML    = ADS_CONFIG.loginAds.topHTML;
    if (sideAd)   sideAd.innerHTML   = ADS_CONFIG.loginAds.sideHTML;
    if (bottomAd) bottomAd.innerHTML = ADS_CONFIG.loginAds.bottomHTML;
});