document.addEventListener("DOMContentLoaded", function() {
    const headerAd = document.getElementById('header-ad-placeholder');
    if (!headerAd) return;

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.cssText = 'display:block;width:100%;min-height:50px;';
    ins.dataset.adClient = 'ca-pub-9442350195298931';
    ins.dataset.adFormat = 'auto';
    ins.dataset.fullWidthResponsive = 'true';
    headerAd.appendChild(ins);

    setTimeout(() => {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    }, 300);
});