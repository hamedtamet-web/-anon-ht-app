async function sendPushNotification(receiverId, title, message, url, senderPhoto) {
    try {
        if (!receiverId) return;

        const body = {
            app_id: APP_CONFIG.oneSignal.appId,
            target_channel: 'push',
            include_aliases: {
                external_id: [receiverId]
            },
            headings: { en: title, ar: title },
            contents: { en: message, ar: message },
            url: url || 'https://anonht.com',
            chrome_web_icon: senderPhoto || 'https://anonht.com/images/user.png',
            chrome_web_badge: 'https://anonht.com/images/logo.png',
            firefox_icon: senderPhoto || 'https://anonht.com/images/user.png',
            large_icon: senderPhoto || 'https://anonht.com/images/user.png',
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

        if (data.errors) {
            console.warn('[OneSignal] Notification errors:', data.errors);
        } else {
            console.log('[OneSignal] Sent to:', receiverId, '| ID:', data.id);
        }

    } catch(e) {
        console.error('[OneSignal] sendPushNotification failed:', e);
    }
}

async function notifyNewQuestion(receiverId, senderName, senderPhoto) {
    await sendPushNotification(
        receiverId,
        'سؤال جديد',
        `${senderName} أرسل لك سؤالاً جديداً`,
        'https://anonht.com/questions.html',
        senderPhoto
    );
}

async function notifyNewLike(receiverId, senderName, senderPhoto) {
    await sendPushNotification(
        receiverId,
        'اعجاب جديد',
        `${senderName} اعجب بإجابتك`,
        'https://anonht.com/notifications.html',
        senderPhoto
    );
}

async function notifyNewFollow(receiverId, senderName, senderPhoto) {
    await sendPushNotification(
        receiverId,
        'متابع جديد',
        `${senderName} بدأ متابعتك`,
        'https://anonht.com/notifications.html',
        senderPhoto
    );
}

async function notifyNewReply(receiverId, senderName, senderPhoto) {
    await sendPushNotification(
        receiverId,
        'رد جديد',
        `${senderName} رد على إجابتك`,
        'https://anonht.com/notifications.html',
        senderPhoto
    );
}

async function notifyNewComment(receiverId, senderName, senderPhoto) {
    await sendPushNotification(
        receiverId,
        'تعليق جديد',
        `${senderName} علق على إجابتك`,
        'https://anonht.com/notifications.html',
        senderPhoto
    );
}
