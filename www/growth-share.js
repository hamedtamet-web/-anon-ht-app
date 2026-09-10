'use strict';
function ghRoundRect(ctx,x,y,w,h,r){
    ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
function ghWrapLines(ctx, text, maxWidth) {
    const words = String(text||'').split(' ');
    const lines = [];
    let line = '';
    for (let i=0;i<words.length;i++){
        const test = line + words[i] + ' ';
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line.trim());
            line = words[i] + ' ';
        } else line = test;
    }
    if (line.trim()) lines.push(line.trim());
    if (lines.length === 0) lines.push('');
    return lines;
}
function ghDrawLines(ctx, lines, x, y, lineHeight) {
    let cy = y;
    lines.forEach(l => { ctx.fillText(l, x, cy); cy += lineHeight; });
    return cy - lineHeight;
}
function ghLoadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
function ghDrawCircularImage(ctx, img, cx, cy, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const size = radius * 2;
    const ratio = Math.max(size / img.width, size / img.height);
    const w = img.width * ratio, h = img.height * ratio;
    ctx.drawImage(img, cx - w/2, cy - h/2, w, h);
    ctx.restore();
}
async function ghBuildShareCanvas(question, answer, name, username, avatarUrl) {
    if (typeof document.fonts !== 'undefined') {
        try { await Promise.all([
            document.fonts.load('900 48px Cairo'),
            document.fonts.load('800 38px Cairo'),
            document.fonts.load('700 38px Cairo'),
            document.fonts.load('600 36px Cairo')
        ]); } catch(e) {}
    }
    const logoUrl = location.origin + '/images/logo.png';
    let logoImg = null, avatarImg = null;
    try { logoImg = await ghLoadImage(logoUrl); } catch(e) { console.warn('logo load failed', e); }
    if (avatarUrl) {
        try { avatarImg = await ghLoadImage(avatarUrl); } catch(e) { console.warn('avatar load failed', e); }
    }

    const mctx = document.createElement('canvas').getContext('2d');
    const CW = 820;
    mctx.font = "600 36px Cairo,Arial";
    const qLines = ghWrapLines(mctx, question, CW);
    mctx.font = "900 44px Cairo,Arial";
    const aLines = ghWrapLines(mctx, answer, CW);

    const qLineH = 50, aLineH = 58;
    const headerH = 260;
    const cardX = 64, cardW = 952;
    const cardY = headerH;

    const padTop = 64;
    const qIconGap = 62;
    const sepGap = 40;
    const aLabelGap = 46;
    const aStartGap = 116;
    const nameGap = 78;
    const cardBottomPad = 46;

    const qBlockH = (qLines.length - 1) * qLineH;
    const aBlockH = (aLines.length - 1) * aLineH;
    const nameRowY = padTop + qIconGap + qBlockH + sepGap + aLabelGap + aStartGap + aBlockH + nameGap;
    const cardH = nameRowY + cardBottomPad;

    const ctaGap = 64, badgeGap = 30, badgeH = 84, footerGap = 42, bottomMargin = 46;
    const totalH = cardY + cardH + ctaGap + badgeGap + badgeH + footerGap + bottomMargin;
    const canvasH = Math.max(880, Math.min(2200, Math.round(totalH)));

    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = canvasH;
    const ctx = canvas.getContext('2d');

    // ═══ الخلفية ═══
    const bgGrad = ctx.createLinearGradient(0,0,0,canvasH);
    bgGrad.addColorStop(0,"#0b0007");
    bgGrad.addColorStop(0.5,"#050505");
    bgGrad.addColorStop(1,"#0b0007");
    ctx.fillStyle = bgGrad; ctx.fillRect(0,0,1080,canvasH);

    const glow1 = ctx.createRadialGradient(540,150,0,540,150,780);
    glow1.addColorStop(0,"rgba(248,5,102,0.20)"); glow1.addColorStop(1,"transparent");
    ctx.fillStyle = glow1; ctx.fillRect(0,0,1080,canvasH);

    const glow2 = ctx.createRadialGradient(540,canvasH-100,0,540,canvasH-100,650);
    glow2.addColorStop(0,"rgba(248,5,102,0.09)"); glow2.addColorStop(1,"transparent");
    ctx.fillStyle = glow2; ctx.fillRect(0,0,1080,canvasH);

    // نقشة نقاط خفيفة جدًا للعمق
    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.fillStyle = "#ffffff";
    for (let gx = 40; gx < 1080; gx += 60) {
        for (let gy = 40; gy < canvasH; gy += 60) {
            ctx.beginPath(); ctx.arc(gx, gy, 1.4, 0, Math.PI*2); ctx.fill();
        }
    }
    ctx.restore();

    // ═══ الشعار ═══
    const logoY = 108, logoR = 44;
    if (logoImg) {
        const outerGlow = ctx.createRadialGradient(540,logoY,logoR*0.9,540,logoY,logoR*1.6);
        outerGlow.addColorStop(0,"rgba(248,5,102,0.4)"); outerGlow.addColorStop(1,"transparent");
        ctx.fillStyle = outerGlow;
        ctx.beginPath(); ctx.arc(540,logoY,logoR*1.6,0,Math.PI*2); ctx.fill();

        ctx.fillStyle = "#0d0d10";
        ctx.beginPath(); ctx.arc(540,logoY,logoR,0,Math.PI*2); ctx.fill();

        const logoPad = 9;
        ghDrawCircularImage(ctx, logoImg, 540, logoY, logoR - logoPad);

        ctx.save();
        ctx.shadowColor = "rgba(248,5,102,0.75)"; ctx.shadowBlur = 14;
        ctx.strokeStyle = "rgba(248,5,102,0.65)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(540,logoY,logoR,0,Math.PI*2); ctx.stroke();
        ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#f80566"; ctx.font = "900 48px Cairo,Arial";
    ctx.shadowColor = "rgba(248,5,102,0.55)"; ctx.shadowBlur = 16;
    ctx.fillText("Anon HT", 540, logoY + 92);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#888"; ctx.font = "600 24px Cairo,Arial";
    ctx.fillText("اسأل بشكل مجهول  •  anonht.com", 540, logoY + 128);

    // ═══ الكارت ═══
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 45; ctx.shadowOffsetY = 18;
    ctx.fillStyle = "#0d0d10";
    ghRoundRect(ctx, cardX, cardY, cardW, cardH, 42); ctx.fill();
    ctx.restore();

    const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY+cardH);
    cardGrad.addColorStop(0,"rgba(248,5,102,0.5)");
    cardGrad.addColorStop(0.45,"rgba(248,5,102,0.12)");
    cardGrad.addColorStop(1,"rgba(248,5,102,0.04)");
    ctx.strokeStyle = cardGrad; ctx.lineWidth = 2;
    ghRoundRect(ctx, cardX, cardY, cardW, cardH, 42); ctx.stroke();

    // خط علوي متوهج
    const topLine = ctx.createLinearGradient(cardX,0,cardX+cardW,0);
    topLine.addColorStop(0,"transparent"); topLine.addColorStop(0.5,"rgba(248,5,102,0.85)"); topLine.addColorStop(1,"transparent");
    ctx.fillStyle = topLine; ctx.fillRect(cardX+50, cardY, cardW-100, 3);

    let cy = cardY + padTop;

    // ═══ علامة اقتباس + عنوان السؤال ═══
    ctx.textAlign = "right";
    ctx.fillStyle = "#f80566"; ctx.font = "900 40px Georgia, serif";
    ctx.fillText("”", cardX + cardW - 52, cy + 6);
    ctx.font = "800 30px Cairo,Arial";
    ctx.fillText("سؤال", cardX + cardW - 90, cy);

    ctx.textAlign = "center"; ctx.fillStyle = "#a8a8ac"; ctx.font = "600 36px Cairo,Arial";
    const qEndY = ghDrawLines(ctx, qLines, 540, cy + qIconGap, qLineH);

    // ═══ فاصل بنقطة مركزية ═══
    const sepY = qEndY + sepGap;
    const sepGrad = ctx.createLinearGradient(cardX+56, 0, cardX+cardW-56, 0);
    sepGrad.addColorStop(0,"transparent"); sepGrad.addColorStop(0.5,"rgba(248,5,102,0.45)"); sepGrad.addColorStop(1,"transparent");
    ctx.strokeStyle = sepGrad; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cardX+56, sepY); ctx.lineTo(cardX+cardW-56, sepY); ctx.stroke();
    ctx.fillStyle = "#f80566";
    ctx.beginPath(); ctx.arc(540, sepY, 4.5, 0, Math.PI*2); ctx.fill();

    // ═══ الإجابة ═══
    ctx.textAlign = "right"; ctx.fillStyle = "#f80566"; ctx.font = "800 30px Cairo,Arial";
    ctx.fillText("الإجابة  💬", cardX + cardW - 52, sepY + aLabelGap);

    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#ffffff"; ctx.font = "900 44px Cairo,Arial";
    const aEndY = ghDrawLines(ctx, aLines, 540, sepY + aStartGap, aLineH);
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

    // ═══ صف الاسم ═══
    const nameY = aEndY + nameGap;
    if (avatarImg) {
        const ar = 28;
        ctx.save();
        ctx.shadowColor = "rgba(248,5,102,0.4)"; ctx.shadowBlur = 10;
        ghDrawCircularImage(ctx, avatarImg, 540 - 118, nameY - 16, ar);
        ctx.restore();
        const aRing = ctx.createLinearGradient(540-118-ar, nameY-16-ar, 540-118+ar, nameY-16+ar);
        aRing.addColorStop(0,"#f80566"); aRing.addColorStop(1,"rgba(248,5,102,0.25)");
        ctx.strokeStyle = aRing; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(540 - 118, nameY - 16, ar, 0, Math.PI*2); ctx.stroke();
    }
    ctx.textAlign = "center"; ctx.fillStyle = "#f80566"; ctx.font = "800 34px Cairo,Arial";
    ctx.fillText("— " + (name || "مجهول"), avatarImg ? 540 + 22 : 540, nameY);

    // ═══ CTA ═══
    const ctaY = cardY + cardH + ctaGap;
    ctx.fillStyle = "#ffffff"; ctx.font = "800 40px Cairo,Arial";
    ctx.fillText("اسألني أنت كمان 👀", 540, ctaY);

    // ═══ شارة الرابط ═══
    const badgeY = ctaY + badgeGap;
    const badgeText = "anonht.com/" + (username || "");
    ctx.font = "800 34px Cairo,Arial";
    const textW = ctx.measureText(badgeText).width;
    const iconGap = logoImg ? 58 : 0;
    const badgeW = textW + 130 + iconGap;
    const badgeX = 540 - badgeW/2;

    ctx.save();
    ctx.shadowColor = "rgba(248,5,102,0.55)"; ctx.shadowBlur = 22;
    const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX+badgeW, badgeY);
    badgeGrad.addColorStop(0,"#ff1a75"); badgeGrad.addColorStop(1,"#c4024e");
    ctx.fillStyle = badgeGrad;
    ghRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 46); ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.5;
    ghRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 46); ctx.stroke();

    if (logoImg) {
        ghDrawCircularImage(ctx, logoImg, badgeX + 52, badgeY + badgeH/2, 24);
    }
    ctx.fillStyle = "#ffffff"; ctx.font = "800 34px Cairo,Arial"; ctx.textAlign = "center";
    ctx.fillText(badgeText, 540 + (logoImg ? 24 : 0), badgeY + badgeH/2 + 12);

    // ═══ فوتر ═══
    ctx.fillStyle = "#555"; ctx.font = "600 24px Cairo,Arial";
    ctx.fillText("Anon HT  —  أسئلة مجهولة وصريحة", 540, badgeY + badgeH + footerGap);

    return canvas;
}
async function ghShareAnswerCard(question, answer, name, username, avatarUrl) {
    const canvas = await ghBuildShareCanvas(question, answer, name, username, avatarUrl);

    const ua = navigator.userAgent || '';
    const looksLikeRestrictedWebView = /; wv\)/.test(ua) || (/Android/.test(ua) && !window.chrome);

    if (!looksLikeRestrictedWebView) {
        try {
            const blob = await new Promise(res => canvas.toBlob(res, 'image/png', 0.95));
            const file = new File([blob], 'anonht-answer.png', { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Anon HT',
                    text: 'اسألني أنت كمان 👀 anonht.com/' + (username||'')
                });
                return;
            }
        } catch(e) {
            if (e.name === 'AbortError') return;
            console.warn('navigator.share failed, falling back:', e.name, e.message);
        }
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'anonht-answer.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function showGrowthSharePrompt(question, answer, name, username, avatarUrl) {
    const old = document.getElementById('ghSharePrompt');
    if (old) old.remove();
    const el = document.createElement('div');
    el.id = 'ghSharePrompt';
    el.style.cssText = `
        position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);
        width:calc(100% - 32px);max-width:420px;
        background:linear-gradient(135deg,rgba(14,14,14,0.98),rgba(30,0,20,0.98));
        border:1px solid rgba(248,5,102,0.4);border-radius:20px;padding:14px 16px;
        display:flex;align-items:center;gap:12px;z-index:9999;
        box-shadow:0 8px 32px rgba(248,5,102,0.25);backdrop-filter:blur(20px);
        opacity:0;transition:opacity 0.4s,transform 0.4s;font-family:Cairo,sans-serif;`;
    el.innerHTML = `
        <div style="width:44px;height:44px;min-width:44px;background:linear-gradient(135deg,#f80566,#c4024e);
            border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;">📸</div>
        <div style="flex:1;">
            <div style="color:#fff;font-size:13px;font-weight:800;">اتنشرت إجابتك! 🎉</div>
            <div style="color:#aaa;font-size:11px;">شارك الصورة في الستوري واكسب متابعين جدد</div>
        </div>
        <button id="ghShareBtn" style="background:linear-gradient(135deg,#f80566,#c4024e);color:#fff;
            border:none;border-radius:12px;padding:9px 16px;font-family:Cairo;font-size:12px;
            font-weight:800;cursor:pointer;white-space:nowrap;">شارك</button>
        <button id="ghCloseBtn" style="background:rgba(255,255,255,0.07);border:none;color:#888;
            width:26px;height:26px;border-radius:50%;font-size:12px;cursor:pointer;flex-shrink:0;">✕</button>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity='1'; el.style.transform='translateX(-50%) translateY(0)'; });
    document.getElementById('ghShareBtn').onclick = async () => {
        try {
            await ghShareAnswerCard(question, answer, name, username, avatarUrl);
        } catch(e) {
            console.error('ghShare error:', e);
            alert('خطأ في المشاركة: ' + (e && e.message ? e.message : e));
        }
        el.remove();
    };
    document.getElementById('ghCloseBtn').onclick = () => el.remove();
    setTimeout(() => { if (document.getElementById('ghSharePrompt')) el.remove(); }, 15000);
}
