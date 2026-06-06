document.addEventListener("DOMContentLoaded", function() {
    const footerAd = document.getElementById('footer-ad-placeholder');
    if (!footerAd) return;

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.cssText = 'display:block;width:100%;min-height:50px;';
    ins.dataset.adClient = 'ca-pub-9442350195298931';
    ins.dataset.adFormat = 'auto';
    ins.dataset.fullWidthResponsive = 'true';
    footerAd.appendChild(ins);

    setTimeout(() => {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    }, 400);
});