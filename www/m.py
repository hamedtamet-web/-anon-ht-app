with open('profile.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# ===== 1) إضافة السويتش في HTML =====
old1 = '''<label class=\"status-switch\">
                            <input type=\"checkbox\" id=\"switchShowOnline\" onchange=\"saveStatusSettings()\">
                            <span class=\"status-slider\"></span>
                        </label>'''

new1 = old1 + '''
                    </div>
                    <div style=\"display:flex;align-items:center;justify-content:space-between;margin-top:14px;\">
                        <div>
                            <div style=\"font-size:12px;font-weight:700;color:#ddd;font-family:Cairo,sans-serif;\">استقبال الأسئلة المجهولة</div>
                            <div style=\"font-size:10px;color:#555;font-family:Cairo,sans-serif;margin-top:2px;\">إيقافه يمنع وصول أي سؤال مجهول جديد لك</div>
                        </div>
                        <label class=\"status-switch\">
                            <input type=\"checkbox\" id=\"switchAllowQuestions\" onchange=\"saveStatusSettings()\">
                            <span class=\"status-slider\"></span>
                        </label>'''

if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print('✅ 1) تم إضافة السويتش في HTML')
else:
    print('❌ 1) لم يتم العثور على كود السويتش الأصلي (HTML)')

# ===== 2) تعديل loadStatusSettings لقراءة الإعداد الجديد =====
old2 = '''async function loadStatusSettings() {
    if (!auth.currentUser) return;
    try {
        const doc = await db.collection('users').doc(auth.currentUser.uid).get();
        const d = doc.data() || {};
        const s1 = document.getElementById('switchShowOnline');
        if (s1) s1.checked = d.showOnlineStatus !== false;
    } catch(e) { console.error(e); }
}'''

new2 = '''async function loadStatusSettings() {
    if (!auth.currentUser) return;
    try {
        const doc = await db.collection('users').doc(auth.currentUser.uid).get();
        const d = doc.data() || {};
        const s1 = document.getElementById('switchShowOnline');
        if (s1) s1.checked = d.showOnlineStatus !== false;
        const s2 = document.getElementById('switchAllowQuestions');
        if (s2) s2.checked = d.allowAnonQuestions !== false;
    } catch(e) { console.error(e); }
}'''

if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print('✅ 2) تم تعديل loadStatusSettings')
else:
    print('❌ 2) لم يتم العثور على loadStatusSettings الأصلية')

# ===== 3) تعديل saveStatusSettings لحفظ الإعداد الجديد =====
old3 = '''async function saveStatusSettings() {
    if (!auth.currentUser) return;
    const s1 = document.getElementById('switchShowOnline');
    try {
        await db.collection('users').doc(auth.currentUser.uid).update({
            showOnlineStatus: s1 ? s1.checked : true,
        });
        toast('success', '✅ تم حفظ إعدادات الخصوصية');
    } catch(e) { console.error(e); }
}'''

new3 = '''async function saveStatusSettings() {
    if (!auth.currentUser) return;
    const s1 = document.getElementById('switchShowOnline');
    const s2 = document.getElementById('switchAllowQuestions');
    try {
        await db.collection('users').doc(auth.currentUser.uid).update({
            showOnlineStatus: s1 ? s1.checked : true,
            allowAnonQuestions: s2 ? s2.checked : true,
        });
        toast('success', '✅ تم حفظ إعدادات الخصوصية');
    } catch(e) { console.error(e); }
}'''

if old3 in content:
    content = content.replace(old3, new3, 1)
    changes += 1
    print('✅ 3) تم تعديل saveStatusSettings')
else:
    print('❌ 3) لم يتم العثور على saveStatusSettings الأصلية')

# ===== 4) منع إرسال السؤال لو الاستقبال مقفول =====
old4 = '''async function sendQuestion() {
    if (!auth.currentUser) return (location.href = 'signin.html');
    if (isOwner) return;
    if (isBlocked || iBlockedByThem) return;

    const now = Date.now();'''

new4 = '''async function sendQuestion() {
    if (!auth.currentUser) return (location.href = 'signin.html');
    if (isOwner) return;
    if (isBlocked || iBlockedByThem) return;
    if (currentReceiverData && currentReceiverData.allowAnonQuestions === false) {
        return toast('warning', t('questions_closed'));
    }

    const now = Date.now();'''

if old4 in content:
    content = content.replace(old4, new4, 1)
    changes += 1
    print('✅ 4) تم تعديل sendQuestion (منع الإرسال)')
else:
    print('❌ 4) لم يتم العثور على sendQuestion الأصلية')

# ===== 5) تخزين بيانات صاحب البروفايل في متغير عام عند تحميله =====
old5 = '''let initialQuestionsLoaded = false;'''

new5 = '''let initialQuestionsLoaded = false;
let currentReceiverData    = null;'''

if old5 in content:
    content = content.replace(old5, new5, 1)
    changes += 1
    print('✅ 5) تم إضافة المتغير currentReceiverData')
else:
    print('❌ 5) لم يتم العثور على إعلان المتغيرات الأصلي')

old6 = '''function applyProfileData(data, uid, own) {
    if (!data) return;'''

new6 = '''function applyProfileData(data, uid, own) {
    if (!data) return;
    currentReceiverData = data;'''

if old6 in content:
    content = content.replace(old6, new6, 1)
    changes += 1
    print('✅ 6) تم تعديل applyProfileData لتخزين البيانات')
else:
    print('❌ 6) لم يتم العثور على applyProfileData الأصلية')

# ===== 7) إخفاء صندوق السؤال لو الاستقبال مقفول (تحسين تجربة المستخدم) =====
old7 = '''    if (data.coverUrl) {'''

new7 = '''    if (!own && data.allowAnonQuestions === false) {
        document.getElementById('visitorAskBox').style.display = 'none';
    } else if (!own && !isBlocked && !iBlockedByThem) {
        document.getElementById('visitorAskBox').style.display = 'block';
    }

    if (data.coverUrl) {'''

if old7 in content:
    content = content.replace(old7, new7, 1)
    changes += 1
    print('✅ 7) تم إضافة منطق إخفاء صندوق السؤال')
else:
    print('❌ 7) لم يتم العثور على نقطة إدراج coverUrl')

# ===== 8) إضافة ترجمة questions_closed لكل اللغات =====
old8_ar = '''rate_limit:\"انتظر قليلاً قبل الإرسال مجدداً\",'''
new8_ar = '''rate_limit:\"انتظر قليلاً قبل الإرسال مجدداً\",
        questions_closed:\"هذا المستخدم أغلق استقبال الأسئلة المجهولة حالياً 🚫\",'''

old8_en = '''rate_limit:\"Please wait before sending again\",'''
new8_en = '''rate_limit:\"Please wait before sending again\",
        questions_closed:\"This user has closed anonymous questions 🚫\",'''

old8_fr = '''rate_limit:\"Veuillez attendre avant d'envoyer à nouveau\",'''
new8_fr = '''rate_limit:\"Veuillez attendre avant d'envoyer à nouveau\",
        questions_closed:\"Cet utilisateur a fermé les questions anonymes 🚫\",'''

t8 = 0
if old8_ar in content:
    content = content.replace(old8_ar, new8_ar, 1); t8 += 1
if old8_en in content:
    content = content.replace(old8_en, new8_en, 1); t8 += 1
if old8_fr in content:
    content = content.replace(old8_fr, new8_fr, 1); t8 += 1

if t8 == 3:
    changes += 1
    print('✅ 8) تم إضافة ترجمة questions_closed لـ AR/EN/FR')
else:
    print(f'⚠️ 8) تم إضافة الترجمة في {t8} من 3 لغات فقط - راجع يدوياً')

print(f'\\n📊 إجمالي التعديلات الناجحة: {changes} من 8')
if changes < 8:
    print('⚠️ راجع الملف يدوياً للأجزاء التي فشلت، أو استرجع النسخة الاحتياطية: cp profile.html.bak profile.html')
"