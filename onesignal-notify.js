async function sendPushNotification(receiverId, title, message, url) {
    try {
        if (!receiverId) return;
        await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${APP_CONFIG.oneSignal.restApiKey}`
            },
            body: JSON.stringify({
                app_id: APP_CONFIG.oneSignal.appId,
                filters: [{ field: 'external_user_id', value: receiverId }],
                headings: { en: title, ar: title },
                contents: { en: message, ar: message },
                url: url || 'https://anon-ht.web.app',
                chrome_web_icon: 'https://anon-ht.web.app/images/logo.png',
            })
        });
    } catch(e) {
        console.error('OneSignal error:', e);
    }
}

// سؤال جديد
async function notifyNewQuestion(receiverId) {
    await sendPushNotification(
        receiverId,
        '❓ سؤال جديد!',
        'وصلك سؤال جديد، تفضل وشوفه!',
        'https://anon-ht.web.app/questions.html'
    );
}

// لايك جديد
async function notifyNewLike(receiverId, senderName) {
    await sendPushNotification(
        receiverId,
        '❤️ إعجاب جديد!',
        `أعجب ${senderName} بإجابتك`,
        'https://anon-ht.web.app/notifications.html'
    );
}

// متابع جديد
async function notifyNewFollow(receiverId, senderName) {
    await sendPushNotification(
        receiverId,
        '💙 متابع جديد!',
        `${senderName} بدأ متابعتك`,
        'https://anon-ht.web.app/notifications.html'
    );
}

// رد جديد
async function notifyNewReply(receiverId, senderName) {
    await sendPushNotification(
        receiverId,
        '💬 رد جديد!',
        `${senderName} رد على إجابتك`,
        'https://anon-ht.web.app/notifications.html'
    );
}
