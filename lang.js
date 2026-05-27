/**
 * lang.js — مدير اللغة المشترك لجميع صفحات Anon
 * استخدم: LangManager.init() في كل صفحة
 */

const LangManager = (() => {

    const STORAGE_KEY = 'anon_lang';
    const SUPPORTED   = ['ar', 'en', 'fr'];
    const DEFAULT     = 'ar';

    const common = {
        ar: {
            // nav
            nav_home:    'الرئيسية',
            nav_qs:      'الأسئلة',
            nav_skina:   'سكينة',
            nav_challenge:    'تحد',
            nav_profile: 'بروفايلي',
            // header / search
            search_placeholder: 'ابحث عن مستخدم...',
            no_notif:    'لا توجد إشعارات حالياً',
            more_notif:  'عرض المزيد من الإشعارات',
            replies_btn: 'الردود',
            // PWA
            install_app: 'ثبّت التطبيق على هاتفك 📲',
            install_sub: 'استخدمه بدون متصفح وبشكل أسرع',
            install_btn: 'تثبيت',
            later_btn:   'لاحقاً',
            ios_title:   '📲 ثبّت التطبيق على iPhone',
            ios_step1:   'اضغط على',
            ios_step2:   'مشاركة',
            ios_step3:   'ثم اختر',
            ios_step4:   '"إضافة إلى الشاشة الرئيسية"',
            ios_ok:      'فهمت ✓',
            installed_ok:'تم تثبيت التطبيق بنجاح 🎉',
            // عام
            delete_confirm: 'هل تود الحذف؟',
            report_reason:  'سبب الإبلاغ؟',
            report_success: 'تم إرسال بلاغك ✨',
            error_generic:  'حدث خطأ، حاول مرة أخرى',
            deleted_ok:     'تم الحذف بنجاح',
            delete_error:   'حدث خطأ أثناء الحذف',
            dev_label:      'المطور',
            // questions.html
            tabAll:          'الكل',
            tabPersonal:     'شخصي',
            tabShout:        'شاوت',
            personalLabel:   '🗣 سؤال شخصي',
            shoutLabel:      '📡 شاوت وارد',
            replyPublish:    'رد ونشر',
            publishAnswer:   'نشر الإجابة',
            replyPlaceholder:'اكتب ردك...',
            shoutReplyBtn:   'رد على الشاوت',
            shoutReplyPlaceholder: 'اكتب ردك على الشاوت...',
            sendShoutReply:  'إرسال الرد',
            anonLabel:       'مجهول',
            sentToAll:       'أرسل للجميع',
            emptyAll:        'لا توجد رسائل جديدة',
            emptyPersonal:   'لا توجد أسئلة شخصية',
            emptyShout:      'لا توجد شاوتات واردة',
            replyEmpty:      'اكتب ردك أولاً',
            newMsg:          'وصلتك رسالة جديدة! ✨',
            connError:       'حدث خطأ، حاول مجدداً',
            reportTitle:     '🚩 إبلاغ',
            reportPlaceholder:'اكتب سبب الإبلاغ...',
            reportSend:      'إرسال البلاغ',
            reportSuccess:   'تم إرسال البلاغ ✅',
            cancelBtn:       'تراجع',
            deleteTitle:     '🗑 حذف؟',
            deleteDesc:      'هل أنت متأكد؟ لا يمكن التراجع.',
            deleteBtn:       'حذف',
            deleted:         'تم الحذف ✓',
            replySuccess:    'تم الرد والنشر ✅',
            okBtn:           'حسناً',
            // ═══ thread.html ═══
            thread_title:             'الردود',
            thread_q_label:           'السؤال',
            thread_a_label:           'الإجابة',
            thread_like:              'إعجاب',
            thread_replies:           'الردود',
            thread_report:            'إبلاغ',
            thread_delete:            'حذف',
            thread_empty:             'لا توجد ردود بعد — كن أول من يرد!',
            thread_reply_placeholder: 'اكتب ردك هنا...',
            thread_anonymous:         'مجهول',
            thread_reported:          'تم الإبلاغ ✓',
            thread_delete_confirm:    'حذف التعليق؟',
            thread_sent:              'تم إرسال ردك ✓',
            thread_bad_word:          'تحتوي على كلمة غير لائقة',
        },
        en: {
            // nav
            nav_home:    'Home',
            nav_qs:      'Inbox',
            nav_skina:   'Quiet',
            nav_challenge:    'Challenge',
            nav_profile: 'Profile',
            // header / search
            search_placeholder: 'Search for a user...',
            no_notif:    'No notifications yet',
            more_notif:  'View more notifications',
            replies_btn: 'Replies',
            // PWA
            install_app: 'Install the app on your phone 📲',
            install_sub: 'Use it without a browser, faster',
            install_btn: 'Install',
            later_btn:   'Later',
            ios_title:   '📲 Install on iPhone',
            ios_step1:   'Tap',
            ios_step2:   'Share',
            ios_step3:   'then choose',
            ios_step4:   '"Add to Home Screen"',
            ios_ok:      'Got it ✓',
            installed_ok:'App installed successfully 🎉',
            // عام
            delete_confirm: 'Are you sure you want to delete?',
            report_reason:  'Reason for report?',
            report_success: 'Report sent ✨',
            error_generic:  'An error occurred, try again',
            deleted_ok:     'Deleted successfully',
            delete_error:   'Error while deleting',
            dev_label:      'Dev',
            // questions.html
            tabAll:          'All',
            tabPersonal:     'Personal',
            tabShout:        'Shout',
            personalLabel:   '🗣 Personal Q',
            shoutLabel:      '📡 Incoming Shout',
            replyPublish:    'Reply & Post',
            publishAnswer:   'Publish Answer',
            replyPlaceholder:'Write your reply...',
            shoutReplyBtn:   'Reply to Shout',
            shoutReplyPlaceholder: 'Write your reply...',
            sendShoutReply:  'Send Reply',
            anonLabel:       'Anonymous',
            sentToAll:       'Sent to everyone',
            emptyAll:        'No new messages',
            emptyPersonal:   'No personal questions',
            emptyShout:      'No incoming shouts',
            replyEmpty:      'Write your reply first',
            newMsg:          'New message! ✨',
            connError:       'An error occurred, try again',
            reportTitle:     '🚩 Report',
            reportPlaceholder:'Describe the reason...',
            reportSend:      'Send Report',
            reportSuccess:   'Report submitted ✅',
            cancelBtn:       'Cancel',
            deleteTitle:     '🗑 Delete?',
            deleteDesc:      'Are you sure? This cannot be undone.',
            deleteBtn:       'Delete',
            deleted:         'Deleted ✓',
            replySuccess:    'Reply posted ✅',
            okBtn:           'OK',
            // ═══ thread.html ═══
            thread_title:             'Replies',
            thread_q_label:           'Question',
            thread_a_label:           'Answer',
            thread_like:              'Like',
            thread_replies:           'Replies',
            thread_report:            'Report',
            thread_delete:            'Delete',
            thread_empty:             'No replies yet — be the first!',
            thread_reply_placeholder: 'Write your reply here...',
            thread_anonymous:         'Anonymous',
            thread_reported:          'Reported ✓',
            thread_delete_confirm:    'Delete comment?',
            thread_sent:              'Reply sent ✓',
            thread_bad_word:          'Contains inappropriate language',
        },
        fr: {
            // nav
            nav_home:    'Accueil',
            nav_qs:      'Messages',
            nav_skina:   'Méditation',
            nav_challenge:    'Défi',
            nav_profile: 'Profil',
            // header / search
            search_placeholder: 'Rechercher un utilisateur...',
            no_notif:    'Aucune notification pour le moment',
            more_notif:  'Voir plus de notifications',
            replies_btn: 'Réponses',
            // PWA
            install_app: "Installez l'app sur votre téléphone 📲",
            install_sub: 'Utilisez-le sans navigateur, plus rapide',
            install_btn: 'Installer',
            later_btn:   'Plus tard',
            ios_title:   '📲 Installer sur iPhone',
            ios_step1:   'Appuyez sur',
            ios_step2:   'Partager',
            ios_step3:   'puis choisissez',
            ios_step4:   '"Ajouter à l\'écran d\'accueil"',
            ios_ok:      'Compris ✓',
            installed_ok:"Application installée avec succès 🎉",
            // عام
            delete_confirm: 'Voulez-vous vraiment supprimer?',
            report_reason:  'Raison du signalement?',
            report_success: 'Signalement envoyé ✨',
            error_generic:  "Une erreur s'est produite, réessayez",
            deleted_ok:     'Supprimé avec succès',
            delete_error:   'Erreur lors de la suppression',
            dev_label:      'Dév',
            // questions.html
            tabAll:          'Tout',
            tabPersonal:     'Perso',
            tabShout:        'Shout',
            personalLabel:   '🗣 Question perso',
            shoutLabel:      '📡 Shout reçu',
            replyPublish:    'Répondre & Publier',
            publishAnswer:   'Publier la réponse',
            replyPlaceholder:'Votre réponse...',
            shoutReplyBtn:   'Répondre au Shout',
            shoutReplyPlaceholder: 'Répondez au shout...',
            sendShoutReply:  'Envoyer',
            anonLabel:       'Anonyme',
            sentToAll:       'Envoyé à tous',
            emptyAll:        'Pas de nouveaux messages',
            emptyPersonal:   'Pas de questions personnelles',
            emptyShout:      'Pas de shouts entrants',
            replyEmpty:      "Écrivez votre réponse d'abord",
            newMsg:          'Nouveau message! ✨',
            connError:       "Une erreur s'est produite",
            reportTitle:     '🚩 Signaler',
            reportPlaceholder:'Décrivez la raison...',
            reportSend:      'Envoyer',
            reportSuccess:   'Signalement envoyé ✅',
            cancelBtn:       'Annuler',
            deleteTitle:     '🗑 Supprimer?',
            deleteDesc:      "Êtes-vous sûr? Impossible d'annuler.",
            deleteBtn:       'Supprimer',
            deleted:         'Supprimé ✓',
            replySuccess:    'Réponse publiée ✅',
            okBtn:           'OK',
            // ═══ thread.html ═══
            thread_title:             'Réponses',
            thread_q_label:           'Question',
            thread_a_label:           'Réponse',
            thread_like:              "J'aime",
            thread_replies:           'Réponses',
            thread_report:            'Signaler',
            thread_delete:            'Supprimer',
            thread_empty:             'Pas encore de réponses — soyez le premier!',
            thread_reply_placeholder: 'Écrivez votre réponse ici...',
            thread_anonymous:         'Anonyme',
            thread_reported:          'Signalé ✓',
            thread_delete_confirm:    'Supprimer le commentaire?',
            thread_sent:              'Réponse envoyée ✓',
            thread_bad_word:          'Contient un langage inapproprié',
        }
    };

    function get() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED.includes(saved) ? saved : DEFAULT;
    }

    function set(lang) {
        if (!SUPPORTED.includes(lang)) lang = DEFAULT;
        localStorage.setItem(STORAGE_KEY, lang);
        apply(lang);
    }

    function apply(lang) {
        if (!lang) lang = get();
        document.documentElement.lang = lang;
        document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

        const tr = common[lang] || common[DEFAULT];

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (tr[key] !== undefined) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = tr[key];
                } else {
                    el.textContent = tr[key];
                }
            }
        });

        document.querySelectorAll('.lang-select-global').forEach(sel => {
            sel.value = lang;
        });

        document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang, tr } }));
    }

    function init() {
        const lang = get();
        apply(lang);

        document.querySelectorAll('.lang-select-global').forEach(sel => {
            sel.value = lang;
            sel.addEventListener('change', (e) => set(e.target.value));
        });
    }

    return {
        init,
        get,
        set,
        apply,
        t: (key) => (common[get()]?.[key] ?? common[DEFAULT]?.[key] ?? key)
    };

})();

document.addEventListener('DOMContentLoaded', () => LangManager.init());