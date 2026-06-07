async function initFCM(userId) {
  if (!window.Capacitor || !Capacitor.isNativePlatform()) return;

  const { PushNotifications } = Capacitor.Plugins;

  const perm = await PushNotifications.requestPermissions();
  if (perm.receive !== 'granted') return;

  await PushNotifications.register();

  PushNotifications.addListener('registration', async (token) => {
    try {
      await firebase.firestore().collection('users').doc(userId).update({
        fcmTokens: firebase.firestore.FieldValue.arrayUnion(token.value),
        fcmUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('FCM token saved ✅');
    } catch (e) {
      console.error('FCM save error:', e);
    }
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    const url = action.notification.data?.url;
    if (url) window.location.href = url;
  });
}
