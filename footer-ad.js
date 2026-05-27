document.addEventListener("DOMContentLoaded", function() {
    const footerAd = document.getElementById('footer-ad-placeholder');
    if (footerAd) {
        footerAd.innerHTML = `
            <div style="background: #222; color: #fff; padding: 10px; border-radius: 12px;">
                <p>إعرض إعلانك هنا...</p>
            </div>
        `;
    }
});


