(function() {
    const PROTECTED = '.avatar-img, .cover-img, .leader-avatar, .coins-avatar, .shout-avatar, .shout-original-avatar, .reply-avatar, .subreply-avatar';

    function isProtected(el) {
        return el && el.tagName === 'IMG' && el.matches(PROTECTED);
    }

    document.addEventListener('contextmenu', function(e) {
        if (isProtected(e.target)) e.preventDefault();
    });

    document.addEventListener('dragstart', function(e) {
        if (isProtected(e.target)) e.preventDefault();
    });

    let touchTimer = null;
    document.addEventListener('touchstart', function(e) {
        if (isProtected(e.target)) {
            touchTimer = setTimeout(function() {
                e.target.style.opacity = '0.999';
            }, 350);
        }
    }, { passive: true });

    document.addEventListener('touchend', function() {
        if (touchTimer) clearTimeout(touchTimer);
    }, { passive: true });

    const style = document.createElement('style');
    style.textContent = `
        .avatar-img, .cover-img, .leader-avatar, .coins-avatar,
        .shout-avatar, .shout-original-avatar, .reply-avatar, .subreply-avatar {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }
    `;
    document.head.appendChild(style);
})();
