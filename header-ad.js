document.addEventListener("DOMContentLoaded", function() {
    const headerAd = document.getElementById('header-ad-placeholder');
    if (headerAd) {
        // حط هنا كود الإعلان بتاعك
        headerAd.innerHTML = `
            <a href="#">
                <img src="https://via.placeholder.com/728x90?text=Your+Ad+Here" style="width:100%; border-radius:12px;">
            </a>
        `;
    }
});


