function showNotifyPrompt() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;
    if (document.getElementById('notifyPromptOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'notifyPromptOverlay';
    overlay.style.cssText = `
        position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
        background:linear-gradient(145deg,#0d0d0d,#111);
        border:1px solid rgba(248,5,102,0.3);
        border-radius:24px;padding:20px;width:90%;max-width:360px;
        z-index:9999;box-shadow:0 10px 40px rgba(0,0,0,0.8);
        font-family:'Cairo',sans-serif;
    `;
    overlay.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
            <img src="images/logo.png" style="width:40px;height:40px;border-radius:50%;">
            <div>
                <div style="font-size:14px;font-weight:900;color:#fff;">🔔 فعّل الإشعارات</div>
                <div style="font-size:11px;color:#888;font-weight:600;">احصل على إشعار فوري عند كل سؤال أو تفاعل</div>
            </div>
        </div>
        <div style="display:flex;gap:10px;">
            <button id="notifyAllowBtn" style="flex:1;padding:10px;border-radius:50px;border:none;background:linear-gradient(135deg,#f80566,#c0004e);color:#fff;font-weight:800;font-size:13px;cursor:pointer;font-family:'Cairo';">السماح بالإشعارات</button>
            <button id="notifyLaterBtn" style="flex:1;padding:10px;border-radius:50px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#888;font-weight:800;font-size:13px;cursor:pointer;font-family:'Cairo';">لاحقاً</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('notifyAllowBtn').onclick = async () => {
        overlay.remove();
        if (window.OneSignal) {
            await OneSignal.Notifications.requestPermission();
        } else {
            await Notification.requestPermission();
        }
    };
    document.getElementById('notifyLaterBtn').onclick = () => {
        overlay.remove();
    };
}

// استنى لحد ما Firebase يعمل auth
document.addEventListener('authReady', () => {
    setTimeout(showNotifyPrompt, 2000);
});

// fallback لو الـ event مش اشتغل
setTimeout(showNotifyPrompt, 5000);
