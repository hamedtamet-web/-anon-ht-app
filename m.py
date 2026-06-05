#!/usr/bin/env python3
"""
merge_admin.py — يدمج مميزات v4.0 في v3.0
ضع الملفين في نفس المجلد مع السكريبت ثم شغّله
"""

import re
import sys
from pathlib import Path

# ═══ إعداد المسارات ═══
V3 = Path("admin_v3.html")
V4 = Path("admin_v4.html")
OUT = Path("admin_merged.html")

if not V3.exists() or not V4.exists():
    print("❌ تأكد أن admin_v3.html و admin_v4.html موجودان في نفس المجلد")
    sys.exit(1)

v3 = V3.read_text(encoding="utf-8")
v4 = V4.read_text(encoding="utf-8")
out = v3  # نبدأ من v3 ونضيف عليه


def extract(text, start_marker, end_marker):
    """استخرج نص بين علامتين"""
    s = text.find(start_marker)
    e = text.find(end_marker, s + len(start_marker))
    if s == -1 or e == -1:
        return None
    return text[s: e + len(end_marker)]


def insert_before(base, marker, content):
    """أدرج content قبل marker"""
    i = base.find(marker)
    if i == -1:
        print(f"  ⚠️  لم يُعثر على: {marker[:60]}")
        return base
    return base[:i] + content + "\n" + base[i:]


def insert_after(base, marker, content):
    """أدرج content بعد marker"""
    i = base.find(marker)
    if i == -1:
        print(f"  ⚠️  لم يُعثر على: {marker[:60]}")
        return base
    end = i + len(marker)
    return base[:end] + "\n" + content + base[end:]


def replace_between(base, start_marker, end_marker, new_content):
    """استبدل كل شيء بين علامتين"""
    s = base.find(start_marker)
    e = base.find(end_marker, s + len(start_marker))
    if s == -1 or e == -1:
        print(f"  ⚠️  لم يُعثر على النطاق: {start_marker[:50]}")
        return base
    return base[:s] + new_content + base[e + len(end_marker):]


print("🔄 بدء الدمج...\n")


# ════════════════════════════════════════
# 1. CSS — إضافة styles الجديدة قبل </style>
# ════════════════════════════════════════
print("1️⃣  إضافة CSS الجديد...")

new_css = """
/* ✅ Live Stats Bar */
.live-bar{display:flex;gap:9px;margin-bottom:18px;flex-wrap:wrap;}
.live-chip{display:flex;align-items:center;gap:7px;padding:7px 13px;border-radius:10px;background:var(--surface);border:1px solid var(--border2);font-size:11px;font-weight:700;}
.live-chip .live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:statusPulse 1.5s infinite;}
.live-chip .chip-val{font-family:'JetBrains Mono';color:var(--green);font-size:13px;font-weight:900;}
.live-chip .chip-lbl{color:var(--text2);}
/* Chart Tabs */
.chart-tabs{display:flex;gap:5px;margin-bottom:12px;}
.chart-tab{padding:4px 11px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;background:var(--surface2);border:1px solid var(--border2);color:var(--text2);transition:.2s;}
.chart-tab.active{background:var(--primary-dim);color:var(--primary2);border-color:rgba(99,102,241,.3);}
/* Growth Chart */
.growth-chart-wrap{position:relative;height:140px;display:flex;align-items:flex-end;gap:4px;}
.growth-bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;}
.g-bar{width:100%;border-radius:4px 4px 0 0;transition:.5s;min-height:3px;}
.g-label{font-size:8px;color:var(--text3);font-family:'JetBrains Mono';margin-top:3px;text-align:center;}
.chart-legend{display:flex;gap:11px;margin-top:8px;flex-wrap:wrap;}
.legend-item{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--text2);}
.legend-dot{width:8px;height:8px;border-radius:2px;}
/* Session Warning */
.session-warn{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9998;background:var(--surface);border:1px solid rgba(251,191,36,.3);border-radius:12px;padding:10px 18px;font-size:12px;font-weight:700;color:var(--gold);display:none;align-items:center;gap:8px;box-shadow:var(--shadow);}
.session-warn.show{display:flex;}
/* Ban Timer */
.ban-timer-row{display:flex;align-items:center;gap:7px;padding:9px 15px;background:rgba(244,63,94,.04);border:1px solid rgba(244,63,94,.12);border-radius:8px;margin-top:6px;font-size:11px;}
.ban-timer-row i{color:var(--red);}
/* Word Filter */
.word-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;background:var(--red-dim);border:1px solid rgba(244,63,94,.2);border-radius:20px;font-size:11px;font-weight:700;color:var(--red);margin:3px;}
.word-tag button{background:none;border:none;color:var(--red);cursor:pointer;font-size:10px;padding:0;line-height:1;}
.word-tag button:hover{color:#fff;}
/* User Activity Log */
.ulog-item{display:flex;align-items:flex-start;gap:9px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.02);}
.ulog-item:last-child{border-bottom:none;}
.ulog-icon{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;}
.ulog-text{font-size:11px;flex:1;line-height:1.5;}
.ulog-time{font-size:9px;color:var(--text3);font-family:'JetBrains Mono';}
/* Welcome Questions */
.wq-card{background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:11px 14px;margin-bottom:7px;display:flex;align-items:center;gap:10px;}
.wq-text{flex:1;font-size:12px;}
.wq-num{font-family:'JetBrains Mono';font-size:10px;color:var(--text3);min-width:22px;}
"""

out = out.replace("</style>", new_css + "\n</style>", 1)
print("   ✅ CSS أضيف\n")


# ════════════════════════════════════════
# 2. Session Warning HTML — بعد <body>
# ════════════════════════════════════════
print("2️⃣  إضافة Session Warning HTML...")

session_warn_html = """<!-- SESSION WARNING -->
<div class="session-warn" id="sessionWarn">
  <i class="fa-solid fa-clock"></i>
  <span id="sessionWarnText">الجلسة ستنتهي خلال 5 دقائق</span>
  <button class="btn btn-gold btn-sm" onclick="extendSession()">تمديد</button>
</div>
"""

out = insert_after(out, "<body>", session_warn_html)
print("   ✅ Session Warning HTML أضيف\n")


# ════════════════════════════════════════
# 3. Live Bar + Growth Chart في Dashboard HTML
# ════════════════════════════════════════
print("3️⃣  إضافة Live Bar وGrowth Chart في Dashboard...")

live_bar_html = """      <!-- Live Stats Bar -->
      <div class="live-bar">
        <div class="live-chip"><div class="live-dot"></div><span class="chip-val" id="liveOnline">—</span><span class="chip-lbl">أونلاين الآن</span></div>
        <div class="live-chip"><i class="fa-solid fa-user-plus" style="color:var(--cyan);font-size:11px;"></i><span class="chip-val" style="color:var(--cyan);" id="liveTodayReg">—</span><span class="chip-lbl">تسجيل اليوم</span></div>
        <div class="live-chip"><i class="fa-solid fa-circle-question" style="color:var(--gold);font-size:11px;"></i><span class="chip-val" style="color:var(--gold);" id="liveTodayQ">—</span><span class="chip-lbl">أسئلة اليوم</span></div>
        <div class="live-chip"><i class="fa-solid fa-comments" style="color:var(--primary2);font-size:11px;"></i><span class="chip-val" style="color:var(--primary2);" id="liveTodayA">—</span><span class="chip-lbl">إجابات اليوم</span></div>
      </div>
"""

# نضيف Live Bar قبل stats-grid في dashboard
out = insert_before(out,
    '<div class="stats-grid">',
    live_bar_html)

growth_chart_html = """
      <!-- Growth Chart -->
      <div class="panel" style="margin-bottom:16px;">
        <div class="panel-header">
          <div class="panel-title"><i class="fa-solid fa-chart-area"></i> نمو المنصة</div>
          <div class="chart-tabs">
            <div class="chart-tab active" onclick="setChartPeriod('7',this)">7 أيام</div>
            <div class="chart-tab" onclick="setChartPeriod('30',this)">30 يوم</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="growth-chart-wrap" id="growthChart"></div>
          <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--text3);margin-top:2px;font-family:'JetBrains Mono';" id="growthLabels"></div>
          <div class="chart-legend">
            <div class="legend-item"><div class="legend-dot" style="background:var(--primary);"></div> إجابات</div>
            <div class="legend-item"><div class="legend-dot" style="background:var(--cyan);"></div> أسئلة</div>
          </div>
        </div>
      </div>
"""

# نضيف Growth Chart قبل chart-grid
out = insert_before(out,
    '<div class="chart-grid">',
    growth_chart_html)

print("   ✅ Live Bar وGrowth Chart أضيفا\n")


# ════════════════════════════════════════
# 4. Sections HTML: Word Filter + Welcome Questions
# ════════════════════════════════════════
print("4️⃣  إضافة sections Word Filter و Welcome Questions...")

wordfilter_section = """
    <!-- WORD FILTER -->
    <div class="page-section" id="section-wordfilter">
      <div class="panel" style="margin-bottom:13px;">
        <div class="panel-header"><div class="panel-title"><i class="fa-solid fa-filter"></i> إضافة كلمة محظورة</div></div>
        <div class="panel-body">
          <div style="display:flex;gap:7px;flex-wrap:wrap;">
            <input type="text" class="form-input" id="newWordInput" placeholder="أدخل الكلمة..." style="flex:1;">
            <button class="btn btn-danger" onclick="addBannedWord()"><i class="fa-solid fa-plus"></i> إضافة</button>
          </div>
          <div style="font-size:11px;color:var(--text2);margin-top:8px;">الكلمات المحظورة تُطبَّق على الأسئلة والإجابات والشاوتات تلقائياً.</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title"><i class="fa-solid fa-list"></i> الكلمات المحظورة</div>
          <span class="badge badge-red" id="wordCount">0</span>
        </div>
        <div class="panel-body" id="wordList"><div class="spinner"></div></div>
      </div>
    </div>

    <!-- WELCOME QUESTIONS -->
    <div class="page-section" id="section-welcomeq">
      <div class="panel" style="margin-bottom:13px;">
        <div class="panel-header"><div class="panel-title"><i class="fa-solid fa-plus"></i> إضافة سؤال ترحيب</div></div>
        <div class="panel-body">
          <div style="display:flex;gap:7px;flex-wrap:wrap;">
            <input type="text" class="form-input" id="newWqInput" placeholder="سؤال ترحيب جديد..." style="flex:1;">
            <button class="btn btn-primary" onclick="addWelcomeQ()"><i class="fa-solid fa-plus"></i> إضافة</button>
          </div>
          <div style="font-size:11px;color:var(--text2);margin-top:8px;">تُرسل هذه الأسئلة تلقائياً للمستخدمين الجدد عند التسجيل.</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title"><i class="fa-solid fa-list-check"></i> أسئلة الترحيب</div>
          <span class="badge badge-cyan" id="wqCount">0</span>
        </div>
        <div class="panel-body" id="wqList"><div class="spinner"></div></div>
      </div>
    </div>
"""

# نضيف قبل REPORTS section
out = insert_before(out,
    '<!-- REPORTS -->',
    wordfilter_section)

print("   ✅ Sections أضيفت\n")


# ════════════════════════════════════════
# 5. Nav items للـ Word Filter و Welcome Questions
# ════════════════════════════════════════
print("5️⃣  إضافة nav items...")

new_nav_items = """      <div class="nav-item" onclick="showSection('wordfilter')"><i class="fa-solid fa-filter"></i> فلتر الكلمات</div>
      <div class="nav-item" onclick="showSection('welcomeq')"><i class="fa-solid fa-list-check"></i> أسئلة الترحيب</div>
"""

out = insert_before(out,
    "      <span class=\"nav-section\">الأمان</span>",
    new_nav_items)

# nav badges
out = out.replace(
    '<span class="nav-badge green" id="navArticlesCount">—</span>',
    '<span class="nav-badge green" id="navArticlesCount">—</span>\n      <div class="nav-item" onclick="showSection(\'wordfilter\')"><i class="fa-solid fa-filter"></i> فلتر الكلمات <span class="nav-badge" id="navWordCount" style="display:none;"></span></div>\n      <div class="nav-item" onclick="showSection(\'welcomeq\')"><i class="fa-solid fa-list-check"></i> أسئلة الترحيب <span class="nav-badge gold" id="navWqCount">—</span></div>'
)

print("   ✅ Nav items أضيفت\n")


# ════════════════════════════════════════
# 6. User Activity Modal HTML
# ════════════════════════════════════════
print("6️⃣  إضافة User Activity Modal...")

activity_modal = """
<!-- USER ACTIVITY LOG MODAL -->
<div class="modal-overlay" id="userActivityModal">
  <div class="modal-box" style="max-width:520px;">
    <div class="modal-header"><div class="modal-title">سجل نشاط المستخدم</div><button class="modal-close" onclick="closeModal('userActivityModal')">✕</button></div>
    <div class="modal-body" id="userActivityBody"><div class="spinner"></div></div>
  </div>
</div>
"""

out = insert_before(out, "<!-- VERIFY MODAL -->", activity_modal)

# إضافة زر Activity Log في User Modal footer
out = out.replace(
    '      <button class="btn btn-ghost" onclick="closeModal(\'userModal\')">إلغاء</button>\n      <button class="btn btn-primary" onclick="saveUserEdit()">',
    '      <button class="btn btn-ghost" onclick="closeModal(\'userModal\')">إلغاء</button>\n      <button class="btn btn-cyan btn-sm" onclick="openUserActivityLog()"><i class="fa-solid fa-clock-rotate-left"></i> سجل النشاط</button>\n      <button class="btn btn-primary" onclick="saveUserEdit()">'
)

print("   ✅ Activity Modal أضيف\n")


# ════════════════════════════════════════
# 7. Temp Ban في User Modal
# ════════════════════════════════════════
print("7️⃣  إضافة خيار الحظر المؤقت في User Modal...")

out = out.replace(
    '''      <div class="form-group"><label class="form-label">الحظر</label>
        <select class="form-select" id="editBanned">
          <option value="false">غير محظور</option><option value="true">محظور 🚫</option>
        </select>
      </div>''',
    '''      <div class="form-group"><label class="form-label">الحظر</label>
        <select class="form-select" id="editBanned">
          <option value="false">غير محظور</option>
          <option value="true">محظور دائم 🚫</option>
          <option value="temp">حظر مؤقت ⏳</option>
        </select>
      </div>
      <div class="form-group" id="banDaysGroup" style="display:none;"><label class="form-label">مدة الحظر (أيام)</label><input type="number" class="form-input" id="editBanDays" value="7" min="1" max="365"></div>'''
)

print("   ✅ Temp Ban أضيف\n")


# ════════════════════════════════════════
# 8. Session Timer في sidebar footer
# ════════════════════════════════════════
print("8️⃣  تحديث sidebar footer لإضافة Session Timer...")

out = out.replace(
    '<div class="admin-chip-info"><strong>المدير</strong><span>anon-ht.web.app</span></div>',
    '<div class="admin-chip-info"><strong>المدير</strong><span id="sessionTimerLabel">—</span></div>'
)

print("   ✅ Session Timer label أضيف\n")


# ════════════════════════════════════════
# 9. JavaScript — إضافة const SESSION_TIMEOUT_MS
# ════════════════════════════════════════
print("9️⃣  إضافة SESSION_TIMEOUT_MS constant...")

out = out.replace(
    "const RATE_LIMIT_MS = 500;",
    "const RATE_LIMIT_MS = 1500;\nconst SESSION_TIMEOUT_MS = 30 * 60 * 1000;"
)

print("   ✅ Constant أضيف\n")


# ════════════════════════════════════════
# 10. JS — إضافة functions الجديدة قبل </script> الأخير
# ════════════════════════════════════════
print("🔟  إضافة JavaScript functions الجديدة...")

new_js = """
/* ═══════════════════════════════════════
   ✅ SESSION MANAGEMENT
═══════════════════════════════════════ */
let _sessionStart=0,_sessionInterval=null,_sessionWarnShown=false;

function startSession(){
  _sessionStart=Date.now();_sessionWarnShown=false;
  _sessionInterval=setInterval(tickSession,10000);
}
function tickSession(){
  const elapsed=Date.now()-_sessionStart;
  const remaining=SESSION_TIMEOUT_MS-elapsed;
  const mins=Math.floor(remaining/60000);
  const secs=Math.floor((remaining%60000)/1000);
  const lbl=document.getElementById('sessionTimerLabel');
  if(lbl)lbl.textContent=`الجلسة: ${mins}:${String(secs).padStart(2,'0')}`;
  if(remaining<=5*60*1000&&!_sessionWarnShown){
    _sessionWarnShown=true;
    const warn=document.getElementById('sessionWarn');
    if(warn)warn.classList.add('show');
  }
  if(remaining<=0){clearInterval(_sessionInterval);toast('info','انتهت الجلسة');adminLogout();}
}
function extendSession(){
  _sessionStart=Date.now();_sessionWarnShown=false;
  const warn=document.getElementById('sessionWarn');
  if(warn)warn.classList.remove('show');
  toast('success','تم تمديد الجلسة 30 دقيقة');
}
function stopSession(){
  if(_sessionInterval)clearInterval(_sessionInterval);
  const warn=document.getElementById('sessionWarn');
  if(warn)warn.classList.remove('show');
}

/* ═══════════════════════════════════════
   ✅ LIVE STATS
═══════════════════════════════════════ */
function todayStart(){
  const d=new Date();d.setHours(0,0,0,0);
  return firebase.firestore.Timestamp.fromDate(d);
}
async function loadLiveStats(){
  try{
    const today=todayStart();
    const[regSnap,qSnap,aSnap]=await Promise.all([
      db.collection('users').where('createdAt','>=',today).get(),
      db.collection('questions').where('createdAt','>=',today).get(),
      db.collection('answers').where('answeredAt','>=',today).get()
    ]);
    document.getElementById('liveTodayReg').textContent=regSnap.size;
    document.getElementById('liveTodayQ').textContent=qSnap.size;
    document.getElementById('liveTodayA').textContent=aSnap.size;
    const fiveMinAgo=firebase.firestore.Timestamp.fromDate(new Date(Date.now()-5*60*1000));
    const onlineSnap=await db.collection('users').where('lastSeen','>=',fiveMinAgo).get();
    document.getElementById('liveOnline').textContent=onlineSnap.size;
  }catch(e){
    document.getElementById('liveOnline').textContent='—';
  }
}

/* ═══════════════════════════════════════
   ✅ GROWTH CHART
═══════════════════════════════════════ */
let _chartPeriod='7';
function setChartPeriod(period,el){
  _chartPeriod=period;
  document.querySelectorAll('.chart-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  if(currentSection==='dashboard')loadDashboard();
}
async function drawGrowthChart(answersSnap,questionsSnap,period){
  const days=parseInt(period)||7;
  const chart=document.getElementById('growthChart');
  const labelsEl=document.getElementById('growthLabels');
  if(!chart)return;
  chart.innerHTML='';labelsEl.innerHTML='';
  const answersByDay={},questionsByDay={},dayKeys=[];
  for(let i=days-1;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const dk=d.toDateString();
    dayKeys.push({dk,label:d.toLocaleDateString('ar-EG',{month:'short',day:'numeric'})});
    answersByDay[dk]=0;questionsByDay[dk]=0;
  }
  answersSnap.forEach(doc=>{
    const ts=doc.data().answeredAt;
    if(ts){const dk=ts.toDate().toDateString();if(answersByDay[dk]!==undefined)answersByDay[dk]++;}
  });
  questionsSnap.forEach(doc=>{
    const ts=doc.data().createdAt;
    if(ts){const dk=ts.toDate().toDateString();if(questionsByDay[dk]!==undefined)questionsByDay[dk]++;}
  });
  const maxV=Math.max(...Object.values(answersByDay),...Object.values(questionsByDay),1);
  dayKeys.forEach(({dk,label})=>{
    const av=answersByDay[dk]||0,qv=questionsByDay[dk]||0;
    const ah=Math.max(4,(av/maxV)*120),qh=Math.max(4,(qv/maxV)*120);
    const group=document.createElement('div');group.className='growth-bar-group';
    group.innerHTML=`<div style="display:flex;align-items:flex-end;gap:2px;height:130px;padding-top:5px;">
      <div title="إجابات: ${av}" style="width:48%;height:${ah}px;border-radius:4px 4px 0 0;background:var(--primary);opacity:.8;transition:.5s;cursor:pointer;min-height:3px;"></div>
      <div title="أسئلة: ${qv}" style="width:48%;height:${qh}px;border-radius:4px 4px 0 0;background:var(--cyan);opacity:.7;transition:.5s;cursor:pointer;min-height:3px;"></div>
    </div>`;
    chart.appendChild(group);
    const l=document.createElement('span');l.textContent=label;
    l.style.cssText='font-size:8px;color:var(--text3);font-family:JetBrains Mono;text-align:center;flex:1;';
    labelsEl.appendChild(l);
  });
}

/* ═══════════════════════════════════════
   ✅ WORD FILTER
═══════════════════════════════════════ */
async function loadWordFilter(){
  const c=document.getElementById('wordList');
  c.innerHTML='<div class="spinner"></div>';
  try{
    const doc=await db.collection('admin').doc('wordFilter').get();
    const words=(doc.exists?doc.data().words:[])||[];
    document.getElementById('wordCount').textContent=words.length;
    if(!words.length){c.innerHTML='<div class="empty-state"><i class="fa-solid fa-filter"></i><p>لا توجد كلمات محظورة</p></div>';return;}
    c.innerHTML=`<div style="padding:14px;display:flex;flex-wrap:wrap;gap:4px;">
      ${words.map((w,i)=>`<span class="word-tag">${esc(w)}<button onclick="removeBannedWord(${i})" title="حذف">✕</button></span>`).join('')}
    </div>`;
  }catch(e){c.innerHTML='<div class="empty-state"><p>خطأ</p></div>';}
}
async function addBannedWord(){
  const w=String(document.getElementById('newWordInput').value||'').trim().toLowerCase().slice(0,50);
  if(!w)return toast('error','أدخل كلمة');
  if(w.length<2)return toast('error','الكلمة قصيرة جداً');
  try{
    const doc=await db.collection('admin').doc('wordFilter').get();
    const words=(doc.exists?doc.data().words:[])||[];
    if(words.includes(w))return toast('info','الكلمة موجودة مسبقاً');
    if(words.length>=500)return toast('error','تم الوصول للحد الأقصى (500)');
    words.push(w);
    await db.collection('admin').doc('wordFilter').set({words,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
    document.getElementById('newWordInput').value='';
    toast('success',`تم إضافة "${w}"`);
    addLog('إضافة كلمة محظورة','Admin',w);
    loadWordFilter();
  }catch(e){toast('error','خطأ في الإضافة');}
}
async function removeBannedWord(index){
  try{
    const doc=await db.collection('admin').doc('wordFilter').get();
    const words=(doc.exists?doc.data().words:[])||[];
    const removed=words[index];
    words.splice(index,1);
    await db.collection('admin').doc('wordFilter').set({words,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
    toast('info',`تم حذف "${removed}"`);
    addLog('حذف كلمة محظورة','Admin',removed);
    loadWordFilter();
  }catch(e){toast('error','خطأ في الحذف');}
}

/* ═══════════════════════════════════════
   ✅ WELCOME QUESTIONS
═══════════════════════════════════════ */
async function loadWelcomeQuestions(){
  const c=document.getElementById('wqList');
  c.innerHTML='<div class="spinner"></div>';
  try{
    const doc=await db.collection('admin').doc('welcomeQuestions').get();
    const questions=(doc.exists?doc.data().questions:[])||[];
    document.getElementById('wqCount').textContent=questions.length;
    if(!questions.length){c.innerHTML='<div class="empty-state"><i class="fa-solid fa-list-check"></i><p>لا توجد أسئلة ترحيب</p></div>';return;}
    c.innerHTML=questions.map((q,i)=>`
      <div class="wq-card">
        <span class="wq-num">${i+1}</span>
        <span class="wq-text">${esc(q)}</span>
        <button class="btn btn-danger btn-sm btn-icon" onclick="removeWelcomeQ(${i})"><i class="fa-solid fa-trash-can"></i></button>
      </div>`).join('');
  }catch(e){c.innerHTML='<div class="empty-state"><p>خطأ</p></div>';}
}
async function addWelcomeQ(){
  const q=String(document.getElementById('newWqInput').value||'').trim().slice(0,300);
  if(!q)return toast('error','أدخل السؤال');
  if(q.length<5)return toast('error','السؤال قصير جداً');
  try{
    const doc=await db.collection('admin').doc('welcomeQuestions').get();
    const questions=(doc.exists?doc.data().questions:[])||[];
    if(questions.length>=50)return toast('error','الحد الأقصى 50 سؤال');
    questions.push(q);
    await db.collection('admin').doc('welcomeQuestions').set({questions,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
    document.getElementById('newWqInput').value='';
    toast('success','تم الإضافة');
    addLog('إضافة سؤال ترحيب','Admin',q.slice(0,40));
    loadWelcomeQuestions();
  }catch(e){toast('error','خطأ في الإضافة');}
}
async function removeWelcomeQ(index){
  try{
    const doc=await db.collection('admin').doc('welcomeQuestions').get();
    const questions=(doc.exists?doc.data().questions:[])||[];
    const removed=questions[index];
    questions.splice(index,1);
    await db.collection('admin').doc('welcomeQuestions').set({questions,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
    toast('info','تم الحذف');
    addLog('حذف سؤال ترحيب','Admin',String(removed||'').slice(0,40));
    loadWelcomeQuestions();
  }catch(e){toast('error','خطأ في الحذف');}
}

/* ═══════════════════════════════════════
   ✅ USER ACTIVITY LOG
═══════════════════════════════════════ */
let _currentEditUserId=null;
async function openUserActivityLog(){
  const uid=_currentEditUserId;
  if(!uid)return;
  const body=document.getElementById('userActivityBody');
  body.innerHTML='<div class="spinner"></div>';
  openModal('userActivityModal');
  try{
    const[answers,questions,reports]=await Promise.all([
      db.collection('answers').where('userId','==',uid).orderBy('answeredAt','desc').limit(10).get(),
      db.collection('questions').where('senderId','==',uid).orderBy('createdAt','desc').limit(10).get(),
      db.collection('reports').where('reporter','==',uid).orderBy('time','desc').limit(5).get()
    ]);
    let html='<div style="font-size:12px;font-weight:800;color:var(--primary2);margin-bottom:10px;">آخر الإجابات</div>';
    if(answers.empty)html+='<div style="color:var(--text3);font-size:11px;margin-bottom:10px;">لا توجد</div>';
    answers.forEach(doc=>{
      const d=doc.data();
      html+=`<div class="ulog-item"><div class="ulog-icon" style="background:var(--primary-dim);"><i class="fa-solid fa-comments" style="color:var(--primary2);"></i></div><div class="ulog-text">${esc(String(d.reply||'').slice(0,60))}<br><span class="ulog-time">${fmtDate(d.answeredAt)}</span></div></div>`;
    });
    html+='<div style="font-size:12px;font-weight:800;color:var(--cyan);margin:12px 0 8px;">آخر الأسئلة المرسلة</div>';
    if(questions.empty)html+='<div style="color:var(--text3);font-size:11px;margin-bottom:10px;">لا توجد</div>';
    questions.forEach(doc=>{
      const d=doc.data();
      html+=`<div class="ulog-item"><div class="ulog-icon" style="background:rgba(34,211,238,.1);"><i class="fa-solid fa-circle-question" style="color:var(--cyan);"></i></div><div class="ulog-text">${esc(String(d.question||d.text||'').slice(0,60))}<br><span class="ulog-time">${fmtDate(d.createdAt)}</span></div></div>`;
    });
    html+='<div style="font-size:12px;font-weight:800;color:var(--red);margin:12px 0 8px;">البلاغات المرسلة</div>';
    if(reports.empty)html+='<div style="color:var(--text3);font-size:11px;">لا توجد</div>';
    reports.forEach(doc=>{
      const d=doc.data();
      html+=`<div class="ulog-item"><div class="ulog-icon" style="background:var(--red-dim);"><i class="fa-solid fa-flag" style="color:var(--red);"></i></div><div class="ulog-text">${esc(String(d.reason||'').slice(0,60))}<br><span class="ulog-time">${fmtDate(d.time)}</span></div></div>`;
    });
    body.innerHTML=html;
  }catch(e){body.innerHTML='<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>خطأ</p></div>';}
}

/* ═══════════════════════════════════════
   ✅ PROMPT MODAL (بديل prompt())
═══════════════════════════════════════ */
function promptModal(label,defaultVal){
  return new Promise(resolve=>{
    document.getElementById('confirmTitle').textContent=label;
    document.getElementById('confirmText').innerHTML=
      `<input type="number" class="form-input" id="promptInput" value="${esc(defaultVal)}" min="1" style="margin-top:8px;">`;
    openModal('confirmModal');
    document.getElementById('confirmOkBtn').onclick=()=>{
      closeModal('confirmModal');
      resolve(document.getElementById('promptInput')?.value||'');
    };
  });
}
"""

# نضيف JS الجديد قبل آخر </script>
last_script_end = out.rfind("</script>")
out = out[:last_script_end] + new_js + "\n" + out[last_script_end:]
print("   ✅ JS functions أضيفت\n")


# ════════════════════════════════════════
# 11. تحديث initAdmin لاستدعاء startSession و loadLiveStats
# ════════════════════════════════════════
print("1️⃣1️⃣  تحديث initAdmin...")

out = out.replace(
    "  loadDashboard();loadNavBadges();\n  setInterval(()=>checkVerifyExpiry(),300000);",
    "  loadDashboard();loadNavBadges();\n  setInterval(()=>checkVerifyExpiry(),300000);\n  setInterval(()=>{if(currentSection==='dashboard')loadLiveStats();},60000);"
)

out = out.replace(
    "  document.getElementById('loginScreen').style.display='none';\n  document.getElementById('adminApp').style.display='block';\n  initAdmin();",
    "  document.getElementById('loginScreen').style.display='none';\n  document.getElementById('adminApp').style.display='block';\n  startSession();\n  initAdmin();"
)

# تحديث adminLogout ليوقف الـ session
out = out.replace(
    "function adminLogout(){\n  document.getElementById('adminApp').style.display='none';",
    "function adminLogout(){\n  if(typeof stopSession==='function')stopSession();\n  document.getElementById('adminApp').style.display='none';"
)

print("   ✅ initAdmin و adminLogout محدّثان\n")


# ════════════════════════════════════════
# 12. تحديث loadDashboard لاستدعاء الـ chart الجديد
# ════════════════════════════════════════
print("1️⃣2️⃣  تحديث loadDashboard...")

out = out.replace(
    "    drawActivityChart(answers);loadActivityFeed(answers);",
    "    drawActivityChart(answers);loadActivityFeed(answers);\n    drawGrowthChart(answers,questions,_chartPeriod||'7');\n    loadLiveStats();"
)

print("   ✅ loadDashboard محدّث\n")


# ════════════════════════════════════════
# 13. تحديث showSection لإضافة الـ sections الجديدة
# ════════════════════════════════════════
print("1️⃣3️⃣  تحديث showSection...")

out = out.replace(
    "  const loaders={users:loadUsers,answers:loadAnswers,shouts:loadShouts,questions:loadQuestions,articles:loadArticles,reports:loadReports,ipblock:loadIPList,verification:loadVerification,vip:loadVipRequests,broadcast:loadBroadcastHistory,coins:loadCoins,settings:loadSettings,logs:renderLogs};",
    "  const loaders={users:loadUsers,answers:loadAnswers,shouts:loadShouts,questions:loadQuestions,articles:loadArticles,reports:loadReports,ipblock:loadIPList,verification:loadVerification,vip:loadVipRequests,broadcast:loadBroadcastHistory,coins:loadCoins,settings:loadSettings,logs:renderLogs,wordfilter:loadWordFilter,welcomeq:loadWelcomeQuestions};"
)

out = out.replace(
    "  const titles={dashboard:'لوحة البيانات',users:'المستخدمون',answers:'الإجابات',shouts:'الشاوتات',questions:'الأسئلة',articles:'مقالات الأدمن',reports:'البلاغات',ipblock:'حظر IP',verification:'التوثيق',vip:'طلبات VIP',broadcast:'البث الجماعي',coins:'العملات',settings:'الإعدادات',security:'الأمان',firebase:'Firebase & Cloudinary',appearance:'المظهر',admins:'المشرفون',logs:'سجل النشاط'};",
    "  const titles={dashboard:'لوحة البيانات',users:'المستخدمون',answers:'الإجابات',shouts:'الشاوتات',questions:'الأسئلة',articles:'مقالات الأدمن',wordfilter:'فلتر الكلمات',welcomeq:'أسئلة الترحيب',reports:'البلاغات',ipblock:'حظر IP',verification:'التوثيق',vip:'طلبات VIP',broadcast:'البث الجماعي',coins:'العملات',settings:'الإعدادات',security:'الأمان',firebase:'Firebase & Cloudinary',appearance:'المظهر',admins:'المشرفون',logs:'سجل النشاط'};"
)

print("   ✅ showSection محدّث\n")


# ════════════════════════════════════════
# 14. تحديث openUserEdit لحفظ _currentEditUserId
# ════════════════════════════════════════
print("1️⃣4️⃣  تحديث openUserEdit...")

out = out.replace(
    "async function openUserEdit(uid){\n  const u=allUsers.find(x=>x.id===uid);if(!u)return;",
    "async function openUserEdit(uid){\n  _currentEditUserId=uid;\n  const u=allUsers.find(x=>x.id===uid);if(!u)return;"
)

# إضافة listener لـ temp ban
ban_listener = """
// Listener لإظهار/إخفاء حقل أيام الحظر
(function(){
  const el=document.getElementById('editBanned');
  if(el)el.addEventListener('change',function(){
    const grp=document.getElementById('banDaysGroup');
    if(grp)grp.style.display=this.value==='temp'?'block':'none';
  });
})();
"""
last_script_end = out.rfind("</script>")
out = out[:last_script_end] + ban_listener + "\n" + out[last_script_end:]

print("   ✅ openUserEdit وban listener محدّثان\n")


# ════════════════════════════════════════
# 15. تحديث saveUserEdit للتعامل مع temp ban
# ════════════════════════════════════════
print("1️⃣5️⃣  تحديث saveUserEdit للـ temp ban...")

out = out.replace(
    "  const isBanned=document.getElementById('editBanned').value==='true';\n  const banReason=sanitize(document.getElementById('editBanReason').value,200);\n  const role=document.getElementById('editRole').value;\n  const themeColor=document.getElementById('editThemeColor').value;\n  if(!uid||!name)return toast('error','الاسم مطلوب');\n  const update={name,bio,anonCoins:coins,level,xp,country,isVerified:vType==='verified',isPremium:vType==='premium',isBanned,banReason,role,themeColor};",
    """  const banVal=document.getElementById('editBanned').value;
  const banDays=parseInt(document.getElementById('editBanDays')?.value)||7;
  const banReason=sanitize(document.getElementById('editBanReason').value,200);
  const role=document.getElementById('editRole').value;
  const themeColor=document.getElementById('editThemeColor').value;
  if(!uid||!name)return toast('error','الاسم مطلوب');
  let isBanned=false,banUntil=null;
  if(banVal==='true'){isBanned=true;}
  else if(banVal==='temp'){isBanned=true;const d=new Date();d.setDate(d.getDate()+banDays);banUntil=firebase.firestore.Timestamp.fromDate(d);}
  const update={name,bio,anonCoins:coins,level,xp,country,isVerified:vType==='verified',isPremium:vType==='premium',isBanned,banReason,banUntil,role,themeColor};"""
)

print("   ✅ saveUserEdit محدّث\n")


# ════════════════════════════════════════
# 16. تحديث extendVerification لاستخدام promptModal
# ════════════════════════════════════════
print("1️⃣6️⃣  تحديث extendVerification...")

out = out.replace(
    "async function extendVerification(uid,name){\n  const days=prompt(",
    "async function extendVerification(uid,name){\n  const days=await promptModal("
)

print("   ✅ extendVerification محدّث\n")


# ════════════════════════════════════════
# 17. تحديث checkVerifyExpiry لفحص الحظر المؤقت
# ════════════════════════════════════════
print("1️⃣7️⃣  تحديث checkVerifyExpiry لفحص الحظر المؤقت...")

out = out.replace(
    "    if(seen.size>0){\n      await batch.commit();\n      toast('info',`تم إلغاء توثيق ${seen.size} حساب`);",
    """    // فحص الحظر المؤقت المنتهي
    const bannedSnap=await db.collection('users').where('isBanned','==',true).get();
    bannedSnap.forEach(doc=>{
      const d=doc.data();
      if(d.banUntil&&d.banUntil.toDate()<new Date()){
        batch.update(doc.ref,{isBanned:false,banUntil:null,banReason:''});
      }
    });
    if(seen.size>0){\n      await batch.commit();\n      toast('info',`تم إلغاء توثيق ${seen.size} حساب`);"""
)

print("   ✅ checkVerifyExpiry محدّث\n")


# ════════════════════════════════════════
# 18. تحديث RATE_LIMIT_MS
# ════════════════════════════════════════
print("1️⃣8️⃣  تحديث RATE_LIMIT_MS...")
out = out.replace("const RATE_LIMIT_MS = 500;", "const RATE_LIMIT_MS = 1500;")
print("   ✅ RATE_LIMIT_MS محدّث\n")


# ════════════════════════════════════════
# حفظ الملف النهائي
# ════════════════════════════════════════
OUT.write_text(out, encoding="utf-8")
print(f"{'='*50}")
print(f"✅  تم الدمج بنجاح!")
print(f"📄  الملف المدمج: {OUT}")
print(f"📦  الحجم: {OUT.stat().st_size / 1024:.1f} KB")
print(f"{'='*50}")