// ============================================================
//  shoutout-tab.js  —  Shoutout Tab with Answers (Firestore)
//  استدعيه في صفحة البروفايل بـ:
//    <script src="shoutout-tab.js"></script>
//    ثم استدعِ:  ShoutoutTab.init('shoutouts-container', userId)
// ============================================================

const ShoutoutTab = (() => {
  // ─── Firestore helpers ───────────────────────────────────────
  async function getShoutouts(userId) {
    const snap = await firebase.firestore()
      .collection('shoutouts')
      .where('toUserId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function getAnswers(shoutoutId) {
    const snap = await firebase.firestore()
      .collection('answers')
      .where('shoutoutId', '==', shoutoutId)
      .orderBy('createdAt', 'asc')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // ─── Render helpers ──────────────────────────────────────────
  function timeAgo(ts) {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60)    return `${diff}s`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  function avatar(name = '?') {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#6C63FF','#FF6584','#43B89C','#F7B731','#FC5C7D','#48DBFB'];
    const color  = colors[name.charCodeAt(0) % colors.length];
    return `<div class="st-avatar" style="background:${color}">${initials}</div>`;
  }

  // ─── Render a single answer row ──────────────────────────────
  function renderAnswer(ans) {
    return `
      <div class="st-answer" data-id="${ans.id}">
        ${avatar(ans.senderName || 'Anonymous')}
        <div class="st-answer-body">
          <span class="st-answer-name">${ans.senderName || 'Anonymous'}</span>
          <p class="st-answer-text">${ans.text || ''}</p>
          <span class="st-answer-time">${timeAgo(ans.createdAt)}</span>
        </div>
      </div>`;
  }

  // ─── Render a shoutout card ───────────────────────────────────
  function renderCard(shoutout, answers) {
    const count = answers.length;
    const repliesLabel = count === 0 ? 'No replies yet'
                       : count === 1 ? '1 reply'
                       : `${count} replies`;

    const answersHTML = count === 0
      ? `<p class="st-empty-replies">Be the first to reply ✨</p>`
      : answers.map(renderAnswer).join('');

    return `
      <div class="st-card" data-id="${shoutout.id}">
        <!-- Header -->
        <div class="st-card-header">
          ${avatar(shoutout.senderName || 'Someone')}
          <div class="st-card-meta">
            <span class="st-sender">${shoutout.senderName || 'Someone'}</span>
            <span class="st-time">${timeAgo(shoutout.createdAt)}</span>
          </div>
          <span class="st-badge">${repliesLabel}</span>
        </div>

        <!-- Shoutout text -->
        <p class="st-text">${shoutout.text || ''}</p>

        <!-- Toggle button -->
        <button class="st-toggle-btn" data-target="replies-${shoutout.id}">
          <span class="st-toggle-label">Show Replies</span>
          <svg class="st-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <!-- Replies section -->
        <div class="st-replies" id="replies-${shoutout.id}">
          <div class="st-replies-inner">
            ${answersHTML}
          </div>
        </div>
      </div>`;
  }

  // ─── Inject CSS ──────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('shoutout-tab-styles')) return;
    const style = document.createElement('style');
    style.id = 'shoutout-tab-styles';
    style.textContent = `
      /* ── Variables ── */
      :root {
        --st-bg:        #0d0d14;
        --st-card:      #16162a;
        --st-border:    rgba(255,255,255,.07);
        --st-accent:    #7c6fff;
        --st-accent2:   #fc5c7d;
        --st-text:      #e8e8f4;
        --st-muted:     #7878a0;
        --st-reply-bg:  #1c1c32;
        --st-radius:    18px;
        --st-font:      'Syne', 'Segoe UI', sans-serif;
      }

      /* ── Container ── */
      .st-container {
        font-family: var(--st-font);
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
        padding: 0 4px;
      }
      .st-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px 4px 14px;
      }
      .st-header h2 {
        font-size: 22px;
        font-weight: 800;
        color: var(--st-text);
        margin: 0;
        letter-spacing: -.3px;
      }
      .st-header-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--st-accent);
        box-shadow: 0 0 10px var(--st-accent);
        animation: st-pulse 2s infinite;
      }
      @keyframes st-pulse {
        0%,100% { opacity:1; transform:scale(1); }
        50%      { opacity:.5; transform:scale(1.3); }
      }

      /* ── Loading / Empty ── */
      .st-loading, .st-empty {
        text-align: center;
        color: var(--st-muted);
        padding: 52px 0;
        font-size: 15px;
        letter-spacing: .4px;
      }
      .st-loading::after {
        content: '';
        display: block;
        width: 32px; height: 32px;
        margin: 16px auto 0;
        border: 3px solid var(--st-border);
        border-top-color: var(--st-accent);
        border-radius: 50%;
        animation: st-spin .7s linear infinite;
      }
      @keyframes st-spin { to { transform: rotate(360deg); } }

      /* ── Card ── */
      .st-card {
        background: var(--st-card);
        border: 1px solid var(--st-border);
        border-radius: var(--st-radius);
        padding: 20px;
        margin-bottom: 16px;
        position: relative;
        overflow: hidden;
        transition: border-color .2s, transform .2s;
      }
      .st-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(124,111,255,.06) 0%, transparent 60%);
        pointer-events: none;
      }
      .st-card:hover {
        border-color: rgba(124,111,255,.3);
        transform: translateY(-1px);
      }

      /* ── Card header ── */
      .st-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
      }
      .st-avatar {
        width: 40px; height: 40px;
        border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: 14px; color: #fff;
        flex-shrink: 0;
        letter-spacing: -.5px;
      }
      .st-card-meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }
      .st-sender {
        color: var(--st-text);
        font-weight: 700;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .st-time {
        color: var(--st-muted);
        font-size: 12px;
      }
      .st-badge {
        background: rgba(124,111,255,.15);
        color: var(--st-accent);
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 30px;
        border: 1px solid rgba(124,111,255,.25);
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* ── Shoutout text ── */
      .st-text {
        color: var(--st-text);
        font-size: 15px;
        line-height: 1.65;
        margin: 0 0 16px;
        padding: 0;
      }

      /* ── Toggle button ── */
      .st-toggle-btn {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--st-accent);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .3px;
        transition: opacity .15s;
      }
      .st-toggle-btn:hover { opacity: .7; }
      .st-chevron {
        width: 16px; height: 16px;
        transition: transform .3s cubic-bezier(.4,0,.2,1);
      }
      .st-toggle-btn.open .st-chevron {
        transform: rotate(180deg);
      }
      .st-toggle-btn.open .st-toggle-label::before {
        content: 'Hide';
      }
      .st-toggle-btn:not(.open) .st-toggle-label::before {
        content: 'Show';
      }
      .st-toggle-label::after { content: ' Replies'; }

      /* ── Replies section ── */
      .st-replies {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows .35s cubic-bezier(.4,0,.2,1);
        margin-top: 0;
      }
      .st-replies.open {
        grid-template-rows: 1fr;
        margin-top: 16px;
      }
      .st-replies-inner {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 2px;
      }
      .st-empty-replies {
        color: var(--st-muted);
        font-size: 13px;
        text-align: center;
        padding: 16px 0 4px;
        margin: 0;
      }

      /* ── Answer row ── */
      .st-answer {
        display: flex;
        gap: 10px;
        background: var(--st-reply-bg);
        border-radius: 12px;
        padding: 12px 14px;
        border: 1px solid var(--st-border);
        transition: border-color .2s;
      }
      .st-answer:hover { border-color: rgba(124,111,255,.2); }
      .st-answer .st-avatar {
        width: 32px; height: 32px;
        border-radius: 9px;
        font-size: 11px;
      }
      .st-answer-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
        min-width: 0;
      }
      .st-answer-name {
        color: var(--st-text);
        font-size: 13px;
        font-weight: 700;
      }
      .st-answer-text {
        color: #c0c0dc;
        font-size: 13.5px;
        line-height: 1.55;
        margin: 0;
        word-break: break-word;
      }
      .st-answer-time {
        color: var(--st-muted);
        font-size: 11px;
        margin-top: 2px;
      }

      /* ── Responsive ── */
      @media (max-width: 480px) {
        .st-card { padding: 15px 14px; border-radius: 14px; }
        .st-badge { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  // ─── Toggle reply panel ───────────────────────────────────────
  function bindToggle(container) {
    container.querySelectorAll('.st-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const panel    = document.getElementById(targetId);
        if (!panel) return;
        const isOpen = panel.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
      });
    });
  }

  // ─── Public: init ─────────────────────────────────────────────
  async function init(containerId, userId) {
    injectStyles();

    const root = document.getElementById(containerId);
    if (!root) return console.error(`[ShoutoutTab] No element #${containerId}`);

    root.innerHTML = `
      <div class="st-container">
        <div class="st-header">
          <div class="st-header-dot"></div>
          <h2>Shoutouts</h2>
        </div>
        <div class="st-loading">Loading shoutouts…</div>
      </div>`;

    try {
      const shoutouts = await getShoutouts(userId);

      if (!shoutouts.length) {
        root.querySelector('.st-loading').outerHTML = '';
        root.querySelector('.st-container').insertAdjacentHTML('beforeend',
          `<div class="st-empty">No shoutouts yet 🌟</div>`);
        return;
      }

      // Fetch all answers in parallel
      const allAnswers = await Promise.all(
        shoutouts.map(s => getAnswers(s.id))
      );

      const cardsHTML = shoutouts
        .map((s, i) => renderCard(s, allAnswers[i]))
        .join('');

      root.querySelector('.st-container').innerHTML = `
        <div class="st-header">
          <div class="st-header-dot"></div>
          <h2>Shoutouts</h2>
        </div>
        ${cardsHTML}`;

      bindToggle(root);

    } catch (err) {
      console.error('[ShoutoutTab] Error:', err);
      root.querySelector('.st-container').innerHTML += `
        <div class="st-empty">⚠️ Failed to load shoutouts.</div>`;
    }
  }

  return { init };
})();
