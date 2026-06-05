/**
 * ═══════════════════════════════════════════════════════════════
 *  ANON HT — MAINTENANCE GUARD  v1.0
 *  maintenance-guard.js
 * ───────────────────────────────────────────────────────────────
 *  أضف هذا السكريبت في كل صفحة من صفحات موقعك
 *  مباشرةً بعد تضمين Firebase SDKs وconfig.js
 *
 *  مثال:
 *    <script src="config.js"></script>
 *    <script src="https://www.gstatic.com/.../firebase-app-compat.js"></script>
 *    <script src="https://www.gstatic.com/.../firebase-firestore-compat.js"></script>
 *    <script src="maintenance-guard.js"></script>  ← هنا
 *
 *  كيف يعمل:
 *  1. يفحص Firestore كل 30 ثانية
 *  2. إذا تم تفعيل الصيانة → يوجّه المستخدمين لـ maintenance.html فوراً
 *  3. المستخدمون المستثنون (adminEmails) لا يتأثرون
 *  4. إذا كانت الصيانة مفعّلة من البداية → التوجيه فوري
 * ═══════════════════════════════════════════════════════════════
 */

(function MaintenanceGuard() {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  const MAINTENANCE_PAGE = 'maintenance.html';   // مسار صفحة الصيانة
  const CHECK_INTERVAL_MS = 30_000;              // فحص كل 30 ثانية
  const COLLECTION = 'admin';
  const DOC_ID = 'settings';

  /* ── Skip on the maintenance page itself ────────────────── */
  if (window.location.pathname.includes(MAINTENANCE_PAGE)) return;

  /* ── Wait for Firebase to be ready ─────────────────────── */
  let _db = null;
  let _interval = null;
  let _currentUserEmail = null;
  let _initialCheckDone = false;

  function getDb() {
    if (_db) return _db;
    try {
      if (typeof firebase === 'undefined') return null;
      if (!firebase.apps.length) {
        const cfg = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG.firebase : null;
        if (cfg) firebase.initializeApp(cfg);
      }
      _db = firebase.firestore();
      return _db;
    } catch(e) { return null; }
  }

  /* ── Get current user's email (if logged in) ────────────── */
  function initAuthListener() {
    try {
      if (typeof firebase === 'undefined') return;
      if (!firebase.apps.length) return;
      firebase.auth().onAuthStateChanged(user => {
        _currentUserEmail = user ? (user.email || '').toLowerCase().trim() : null;
      });
    } catch(e) { /* Firebase auth not available */ }
  }

  /* ── Check if current user is exempt ───────────────────── */
  function isExempt(adminEmails) {
    if (!adminEmails || !adminEmails.length) return false;
    if (!_currentUserEmail) return false;
    return adminEmails
      .map(e => String(e).toLowerCase().trim())
      .includes(_currentUserEmail);
  }

  /* ── Redirect to maintenance page ───────────────────────── */
  function redirectToMaintenance() {
    // Smooth overlay before redirect
    showOverlay(() => {
      window.location.replace(MAINTENANCE_PAGE);
    });
  }

  /* ── Show a quick overlay animation before redirect ─────── */
  function showOverlay(cb) {
    // Avoid duplicate overlays
    if (document.getElementById('__maint_overlay')) { cb(); return; }

    const overlay = document.createElement('div');
    overlay.id = '__maint_overlay';
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:999999;
      background:#02040a;
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
      opacity:0; transition:opacity 0.4s ease;
      font-family:'Cairo',sans-serif;
    `;

    // Spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width:40px; height:40px; border-radius:50%;
      border:2px solid rgba(14,165,233,0.15);
      border-top-color:#0ea5e9;
      animation:__maint_spin 0.7s linear infinite;
    `;

    // Message
    const msg = document.createElement('div');
    msg.textContent = 'الموقع في وضع الصيانة...';
    msg.style.cssText = `
      color:#475569; font-size:13px; font-weight:700;
      font-family:'Cairo',sans-serif;
    `;

    // CSS for spinner
    if (!document.getElementById('__maint_style')) {
      const style = document.createElement('style');
      style.id = '__maint_style';
      style.textContent = `@keyframes __maint_spin { to { transform:rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    overlay.appendChild(spinner);
    overlay.appendChild(msg);
    document.body.appendChild(overlay);

    // Trigger fade-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        setTimeout(cb, 600);
      });
    });
  }

  /* ── Core: fetch settings and evaluate ──────────────────── */
  async function checkMaintenance() {
    const db = getDb();
    if (!db) return;

    try {
      const doc = await db.collection(COLLECTION).doc(DOC_ID).get();
      if (!doc.exists) return;

      const data = doc.data();
      const maintenanceOn = !!data.maintenance;

      if (!maintenanceOn) {
        // Maintenance is OFF — stop polling if it was previously on
        if (_initialCheckDone) stopPolling();
        _initialCheckDone = true;
        return;
      }

      _initialCheckDone = true;

      // Check if this user is exempt
      const adminEmails = data.adminEmails || [];
      if (isExempt(adminEmails)) {
        console.info('[MaintenanceGuard] Exempt user — skipping redirect.');
        return;
      }

      // Redirect!
      stopPolling();
      redirectToMaintenance();

    } catch(e) {
      // Network error or permission denied — fail silently
      console.warn('[MaintenanceGuard] check failed:', e.message);
    }
  }

  /* ── Start polling ──────────────────────────────────────── */
  function startPolling() {
    if (_interval) return;
    _interval = setInterval(checkMaintenance, CHECK_INTERVAL_MS);
  }

  function stopPolling() {
    if (_interval) { clearInterval(_interval); _interval = null; }
  }

  /* ── Init: run immediately + start interval ─────────────── */
  function init() {
    initAuthListener();
    // Small delay to let Firebase & Auth initialize
    setTimeout(() => {
      checkMaintenance();
      startPolling();
    }, 500);
  }

  /* ── Run on DOM ready ───────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Also check on tab focus (user switching tabs) ─────── */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkMaintenance();
    }
  });

})();
