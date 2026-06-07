const SUPPORTED_LANGS = ['ar', 'en', 'fr', 'es', 'tr'];

function getDeviceLang() {
    const deviceLang = (navigator.language || 'ar').split('-')[0];
    return SUPPORTED_LANGS.includes(deviceLang) ? deviceLang : null;
}

async function getReceiverLang(receiverId) {
    const device = getDeviceLang();
    if (device) return device;
    try {
        const doc = await db.collection('users').doc(receiverId).get();
        const firestoreLang = doc.data()?.language;
        return SUPPORTED_LANGS.includes(firestoreLang) ? firestoreLang : 'ar';
    } catch(e) { return 'ar'; }
}

async function sendPushNotification(receiverId, title, message, url, senderPhoto) {
    try {
        if (!receiverId) return;
        const body = {
            app_id: APP_CONFIG.oneSignal.appId,
            target_channel: 'push',
            include_aliases: { external_id: [receiverId] },
            headings: { en: title, ar: title },
            contents: { en: message, ar: message },
            url: url || 'https://anonht.com',
            chrome_web_icon: senderPhoto || 'https://anonht.com/images/user.png',
            chrome_web_badge: 'https://anonht.com/images/logo.png',
            firefox_icon: senderPhoto || 'https://anonht.com/images/user.png',
            large_icon: senderPhoto || 'https://anonht.com/images/user.png',
            android_accent_color: 'FFF80566',
            web_push_topic: 'anon-notification',
        };
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${APP_CONFIG.oneSignal.restApiKey}`
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.errors) console.warn('[OneSignal] errors:', data.errors);
        else console.log('[OneSignal] Sent to:', receiverId);
    } catch(e) {
        console.error('[OneSignal] failed:', e);
    }
}

function getLangTexts(lang) {
    const L = {
        ar: {
            new_question_title: '❓ سؤال جديد',
            new_question_msg: (n) => `${n} أرسل لك سؤالاً جديداً`,
            new_like_title: '❤️ إعجاب جديد',
            new_like_msg: (n) => `${n} أعجب بإجابتك`,
            new_follow_title: '👤 متابع جديد',
            new_follow_msg: (n) => `${n} بدأ متابعتك`,
            new_reply_title: '💬 رد جديد',
            new_reply_msg: (n) => `${n} رد على إجابتك`,
            new_comment_title: '💬 تعليق جديد',
            new_comment_msg: (n) => `${n} علق على إجابتك`,
            new_gift_title: '🎁 هدية جديدة',
            new_gift_msg: (n, g) => `${n} أرسل لك ${g}`,
            shout_answer_title: '📢 رد على شاوتك',
            shout_answer_msg: (n) => `${n} رد على شاوتك`,
            personal_answer_title: '💬 إجابة جديدة',
            personal_answer_msg: (n) => `${n} أجاب على سؤالك`,
        },
        en: {
            new_question_title: '❓ New Question',
            new_question_msg: (n) => `${n} sent you a new question`,
            new_like_title: '❤️ New Like',
            new_like_msg: (n) => `${n} liked your answer`,
            new_follow_title: '👤 New Follower',
            new_follow_msg: (n) => `${n} started following you`,
            new_reply_title: '💬 New Reply',
            new_reply_msg: (n) => `${n} replied to your answer`,
            new_comment_title: '💬 New Comment',
            new_comment_msg: (n) => `${n} commented on your answer`,
            new_gift_title: '🎁 New Gift',
            new_gift_msg: (n, g) => `${n} sent you ${g}`,
            shout_answer_title: '📢 Shout Reply',
            shout_answer_msg: (n) => `${n} replied to your shout`,
            personal_answer_title: '💬 New Answer',
            personal_answer_msg: (n) => `${n} answered your question`,
        },
        fr: {
            new_question_title: '❓ Nouvelle question',
            new_question_msg: (n) => `${n} vous a envoyé une question`,
            new_like_title: '❤️ Nouveau like',
            new_like_msg: (n) => `${n} a aimé votre réponse`,
            new_follow_title: '👤 Nouvel abonné',
            new_follow_msg: (n) => `${n} a commencé à vous suivre`,
            new_reply_title: '💬 Nouvelle réponse',
            new_reply_msg: (n) => `${n} a répondu à votre réponse`,
            new_comment_title: '💬 Nouveau commentaire',
            new_comment_msg: (n) => `${n} a commenté votre réponse`,
            new_gift_title: '🎁 Nouveau cadeau',
            new_gift_msg: (n, g) => `${n} vous a envoyé ${g}`,
            shout_answer_title: '📢 Réponse shout',
            shout_answer_msg: (n) => `${n} a répondu à votre shout`,
            personal_answer_title: '💬 Nouvelle réponse',
            personal_answer_msg: (n) => `${n} a répondu à votre question`,
        },
        es: {
            new_question_title: '❓ Nueva pregunta',
            new_question_msg: (n) => `${n} te envió una pregunta`,
            new_like_title: '❤️ Nuevo like',
            new_like_msg: (n) => `${n} le gustó tu respuesta`,
            new_follow_title: '👤 Nuevo seguidor',
            new_follow_msg: (n) => `${n} comenzó a seguirte`,
            new_reply_title: '💬 Nueva respuesta',
            new_reply_msg: (n) => `${n} respondió tu respuesta`,
            new_comment_title: '💬 Nuevo comentario',
            new_comment_msg: (n) => `${n} comentó tu respuesta`,
            new_gift_title: '🎁 Nuevo regalo',
            new_gift_msg: (n, g) => `${n} te envió ${g}`,
            shout_answer_title: '📢 Respuesta shout',
            shout_answer_msg: (n) => `${n} respondió tu shout`,
            personal_answer_title: '💬 Nueva respuesta',
            personal_answer_msg: (n) => `${n} respondió tu pregunta`,
        },
        tr: {
            new_question_title: '❓ Yeni soru',
            new_question_msg: (n) => `${n} size yeni bir soru gönderdi`,
            new_like_title: '❤️ Yeni beğeni',
            new_like_msg: (n) => `${n} cevabınızı beğendi`,
            new_follow_title: '👤 Yeni takipçi',
            new_follow_msg: (n) => `${n} sizi takip etmeye başladı`,
            new_reply_title: '💬 Yeni yanıt',
            new_reply_msg: (n) => `${n} cevabınızı yanıtladı`,
            new_comment_title: '💬 Yeni yorum',
            new_comment_msg: (n) => `${n} cevabınızı yorumladı`,
            new_gift_title: '🎁 Yeni hediye',
            new_gift_msg: (n, g) => `${n} size ${g} gönderdi`,
            shout_answer_title: '📢 Shout yanıtı',
            shout_answer_msg: (n) => `${n} shoutunuzu yanıtladı`,
            personal_answer_title: '💬 Yeni yanıt',
            personal_answer_msg: (n) => `${n} sorunuzu yanıtladı`,
        },
    };
    return L[lang] || L['ar'];
}

async function notifyNewQuestion(receiverId, senderName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.new_question_title, t.new_question_msg(senderName), 'https://anonht.com/questions.html', senderPhoto);
}

async function notifyNewLike(receiverId, senderName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.new_like_title, t.new_like_msg(senderName), 'https://anonht.com/notifications.html', senderPhoto);
}

async function notifyNewFollow(receiverId, senderName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.new_follow_title, t.new_follow_msg(senderName), 'https://anonht.com/notifications.html', senderPhoto);
}

async function notifyNewReply(receiverId, senderName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.new_reply_title, t.new_reply_msg(senderName), 'https://anonht.com/notifications.html', senderPhoto);
}

async function notifyNewComment(receiverId, senderName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.new_comment_title, t.new_comment_msg(senderName), 'https://anonht.com/notifications.html', senderPhoto);
}

async function notifyNewGift(receiverId, senderName, giftName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.new_gift_title, t.new_gift_msg(senderName, giftName), 'https://anonht.com/notifications.html', senderPhoto);
}

async function notifyShoutAnswer(receiverId, senderName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.shout_answer_title, t.shout_answer_msg(senderName), 'https://anonht.com/notifications.html', senderPhoto);
}

async function notifyPersonalAnswer(receiverId, senderName, senderPhoto) {
    const lang = await getReceiverLang(receiverId);
    const t = getLangTexts(lang);
    await sendPushNotification(receiverId, t.personal_answer_title, t.personal_answer_msg(senderName), 'https://anonht.com/questions.html', senderPhoto);
}
