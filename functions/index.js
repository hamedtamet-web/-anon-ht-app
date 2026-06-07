const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// بعت إشعار بـ FCM
async function sendNotification(receiverId, title, message, url, senderPhoto) {
    try {
        const tokenDoc = await db.collection("fcmTokens").doc(receiverId).get();
        if (!tokenDoc.exists) return;
        const token = tokenDoc.data().token;
        if (!token) return;

        await messaging.send({
            token,
            notification: { title, body: message },
            android: {
                notification: {
                    icon: "ic_stat_onesignal_default",
                    color: "#f80566",
                    imageUrl: senderPhoto || "",
                    clickAction: "FLUTTER_NOTIFICATION_CLICK",
                },
            },
            webpush: {
                notification: {
                    icon: senderPhoto || "https://anonht.com/images/logo.png",
                    badge: "https://anonht.com/images/logo.png",
                },
                fcmOptions: { link: url || "https://anonht.com" },
            },
            data: { url: url || "https://anonht.com" },
        });
    } catch(e) {
        console.error("FCM error:", e);
    }
}

// Firestore trigger — لما يتضاف إشعار جديد
exports.onNewNotification = functions.firestore
    .document("notifications/{notifId}")
    .onCreate(async (snap, context) => {
        const n = snap.data();
        if (!n.receiverId) return;

        const lang = (n.receiverLang || "ar").split("-")[0];
        const name = n.senderName || "شخص ما";

        const texts = {
            ar: {
                like: ["❤️ إعجاب جديد", `${name} أعجب بإجابتك`],
                follow: ["👤 متابع جديد", `${name} بدأ متابعتك`],
                comment: ["💬 تعليق جديد", `${name} علق على إجابتك`],
                question: ["❓ سؤال جديد", `${name} أرسل لك سؤالاً`],
                gift: ["🎁 هدية جديدة", `${name} أرسل لك هدية`],
                shout_answer: ["📢 رد على شاوتك", `${name} رد على شاوتك`],
                personal_answer: ["💬 إجابة جديدة", `${name} أجاب على سؤالك`],
            },
            en: {
                like: ["❤️ New Like", `${name} liked your answer`],
                follow: ["👤 New Follower", `${name} started following you`],
                comment: ["💬 New Comment", `${name} commented on your answer`],
                question: ["❓ New Question", `${name} sent you a question`],
                gift: ["🎁 New Gift", `${name} sent you a gift`],
                shout_answer: ["📢 Shout Reply", `${name} replied to your shout`],
                personal_answer: ["💬 New Answer", `${name} answered your question`],
            },
            fr: {
                like: ["❤️ Nouveau like", `${name} a aimé votre réponse`],
                follow: ["👤 Nouvel abonné", `${name} a commencé à vous suivre`],
                comment: ["💬 Nouveau commentaire", `${name} a commenté votre réponse`],
                question: ["❓ Nouvelle question", `${name} vous a envoyé une question`],
                gift: ["🎁 Nouveau cadeau", `${name} vous a envoyé un cadeau`],
                shout_answer: ["📢 Réponse shout", `${name} a répondu à votre shout`],
                personal_answer: ["💬 Nouvelle réponse", `${name} a répondu à votre question`],
            },
        };

        const t = (texts[lang] || texts["ar"])[n.type] || ["🔔 إشعار جديد", n.message || ""];
        const url = n.link || "https://anonht.com/notifications.html";

        await sendNotification(n.receiverId, t[0], t[1], url, n.senderAvatar);
    });
