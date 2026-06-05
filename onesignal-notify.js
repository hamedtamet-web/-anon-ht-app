async function sendPushNotification(receiverId, title, message, url) {
    try {
        if (!receiverId) return;

        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${APP_CONFIG.oneSignal.restApiKey}`
            },
            body: JSON.stringify({
                app_id: APP_CONFIG.oneSignal.appId,
                target_channel: 'push',
                include_aliases: {
                    external_id: [receiverId]
                },
                headings: { en: title, ar: title },
                contents: { en: message, ar: message },
                url: url || 'https://anonht.com',
                chrome_web_icon: 'https://anonht.com/images/logo.png',
                chrome_web_badge: 'https://anonht.com/images/logo.png',
                firefox_icon: 'https://anonht.com/images/logo.png',
                web_push_topic: 'anon-notification',
            })
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

async function notifyNewQuestion(receiverId) {
    await sendPushNotification(
        receiverId,
        '❓ سؤال جديد!',
        'وصلك سؤال جديد، تفضل وشوفه!',
        'https://anonht.com/questions.html'
    );
}

async function notifyNewLike(receiverId, senderName) {
    await sendPushNotification(
        receiverId,
        '❤️ إعجاب جديد!',
        `أعجب ${senderName} بإجابتك`,
        'https://anonht.com/notifications.html'
    );
}

async function notifyNewFollow(receiverId, senderName) {
    await sendPushNotification(
        receiverId,
        '💙 متابع جديد!',
        `${senderName} بدأ متابعتك`,
        'https://anonht.com/notifications.html'
    );
}

async function notifyNewReply(receiverId, senderName) {
    await sendPushNotification(
        receiverId,
        '💬 رد جديد!',
        `${senderName} رد على إجابتك`,
        'https://anonht.com/notifications.html'
    );
}
