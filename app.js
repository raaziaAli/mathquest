// ── APP STATE ──
const State = {
  role: null,          // 'student' | 'teacher'
  studentName: 'Zara',
  avatar: '🧙',
  xp: 1240,
  level: 12,
  streak: 5,
  currentRealm: null,
  currentLevel: 1,
  currentQuest: null,
  currentQ: 0,
  answered: false,
  tdTab: 'overview',
  studentFilter: 'all',
  studentSearch: '',
};

// ── SCREEN MANAGER ──
const App = {
  show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },

  showLanding() {
    this.show('landing');
    WorldMap.stop();
    initLandingCanvas();
  },

  showStudent() {
    State.role = 'student';
    this.show('student-world');
    setTimeout(() => WorldMap.init('bgC','isC'), 80);
    this.updateHUD();
  },

  showTeacher() {
    State.role = 'teacher';
    this.show('teacher-screen');
    TeacherDash.render('overview');
    TeacherDash.renderHeatmap();
  },

  showRealm(id) {
    State.currentRealm = id;
    State.currentLevel = 1;
    WorldMap.stop();
    this.show('realm-screen');
    Realm.render(id);
  },

  openModal(type, data) {
    Modal.open(type, data);
  },

  updateHUD() {
    const els = document.querySelectorAll('.hud-xp');
    els.forEach(el => el.textContent = `⚡ ${State.xp.toLocaleString()} XP`);
    const streaks = document.querySelectorAll('.hud-streak');
    streaks.forEach(el => el.textContent = `🔥 ${State.streak}-day streak`);
  }
};

// ── MODAL SYSTEM ──
const Modal = {
  open(type, data) {
    const overlay = document.getElementById('modal-overlay');
    const box = document.getElementById('modal-box');
    box.innerHTML = this.render(type, data);
    overlay.classList.remove('hidden');
  },
  close() {
    document.getElementById('modal-overlay').classList.add('hidden');
  },
  render(type, data) {
    if (type === 'coming-soon') return this.comingSoon(data);
    if (type === 'boss') return this.bossQuestion();
    if (type === 'assign-boss') return this.assignBoss();
    if (type === 'create-duel') return this.createDuel();
    if (type === 'student-detail') return this.studentDetail(data);
    if (type === 'quest') return this.questModal(data);
    return '';
  },

  comingSoon(isl) {
    return `<button class="modal-close" onclick="Modal.close()">✕</button>
    <div style="text-align:center;padding:10px 0;">
      <div style="font-size:56px;margin-bottom:12px;">${isl.icon}</div>
      <div class="modal-label" style="color:${isl.col};">${isl.realm}</div>
      <div class="modal-title">${isl.name}</div>
      <div class="modal-sub">${isl.desc}</div>
      <div style="background:rgba(255,241,118,0.08);border:1.5px dashed rgba(255,241,118,0.35);border-radius:14px;padding:16px 20px;margin-bottom:18px;">
        <div style="font-family:'Fredoka One',cursive;font-size:18px;color:#FFF176;margin-bottom:6px;">🚀 Coming Soon!</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.65;">Mrs. Ali is building this realm now. Complete Ratio Reef first — it unlocks as you progress through the adventure!</div>
      </div>
      <button class="btn btn-purple btn-full" onclick="Modal.close()">Got it! Back to the map</button>
    </div>`;
  },

  bossQuestion() {
    const q = RATIO_REEF.boss;
    const questions = [
      { q:'If 4 bags of rice cost $9.20, how much do 7 bags cost?', opts:['$14.40','$15.75','$16.10','$18.00'], ans:2, explain:'Unit rate: $9.20 ÷ 4 = $2.30 each. 7 × $2.30 = $16.10.' },
      { q:'A map scale is 1 inch = 40 miles. Two cities are 3.5 inches apart on the map. How far apart in real life?', opts:['43.5 miles','120 miles','140 miles','160 miles'], ans:2, explain:'3.5 × 40 = 140 miles.' },
    ];
    const picked = questions[Math.floor(Math.random()*questions.length)];
    return `<button class="modal-close" onclick="Modal.close()">✕</button>
    <div class="modal-label" style="color:#F87171;">🐉 BOSS BATTLE — RATIO REEF</div>
    <div class="modal-title">Attack the Ratio Dragon!</div>
    <div class="modal-sub">Every correct answer deals damage. Wrong answers give the boss a shield!</div>
    <div class="q-box">
      <div class="q-text">${picked.q}</div>
      <div class="q-answers">
        ${picked.opts.map((o,i)=>`<button class="q-ans" onclick="Modal.answerBoss(this,${i===picked.ans},'${picked.explain.replace(/'/g,"\\'")}')">  ${o}</button>`).join('')}
      </div>
    </div>
    <div class="xp-pop" id="modal-xp-pop">+75 XP Earned! 🎉</div>`;
  },

  answerBoss(btn, correct, explain) {
    document.querySelectorAll('.q-ans').forEach(b => b.disabled = true);
    if (correct) {
      btn.classList.add('correct');
      document.getElementById('modal-xp-pop').classList.add('show');
      State.xp += 75; App.updateHUD();
    } else {
      btn.classList.add('wrong');
      document.querySelectorAll('.q-ans').forEach(b => { if (b.textContent.trim() === btn.closest('.q-answers').querySelectorAll('.q-ans')[RATIO_REEF.boss.fighters].textContent.trim()) b.classList.add('correct'); });
    }
    const expDiv = document.createElement('div');
    expDiv.style.cssText = 'margin-top:12px;background:rgba(255,255,255,0.07);border-radius:10px;padding:12px;font-size:13px;color:rgba(255,255,255,0.8);line-height:1.6;';
    expDiv.textContent = '💡 ' + explain;
    document.querySelector('.q-box').appendChild(expDiv);
  },

  assignBoss() {
    const bosses = [['🐉','Ratio Dragon','Ratio Reef','#0EA5E9'],['👾','Equation Beast','Eqn Volcano','#EF4444'],['🗿','Geometry Golem','Geo Grove','#22C55E'],['👻','Stats Specter','Data Desert','#F59E0B']];
    return `<button class="modal-close" onclick="Modal.close()">✕</button>
    <div class="modal-title">⚔️ Assign Boss Battle</div>
    <div class="modal-sub">Choose a domain boss for your class to battle together. All students participate simultaneously!</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
      ${bosses.map(([ico,name,realm,col])=>`<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="Modal.close()">
        <span style="font-size:28px;">${ico}</span>
        <div style="flex:1;"><div style="font-weight:900;font-size:14px;">${name}</div><div style="font-size:12px;color:rgba(255,255,255,0.5);">${realm}</div></div>
        <span style="font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;background:${col}22;color:${col};">Assign →</span>
      </div>`).join('')}
    </div>
    <button class="btn btn-purple btn-full" onclick="Modal.close()">Confirm Assignment</button>`;
  },

  createDuel() {
    return `<button class="modal-close" onclick="Modal.close()">✕</button>
    <div class="modal-title">⚔️ Create a Point Duel</div>
    <div class="modal-sub">Pair two students for a live head-to-head math battle.</div>
    <div style="font-size:12px;font-weight:800;color:rgba(255,255,255,0.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px;">Select Domain</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
      ${[['Ratio Reef','#0EA5E9'],['Eqn Volcano','#EF4444'],['Geo Grove','#22C55E'],['Data Desert','#F59E0B'],['Number Peaks','#A855F7']].map(([n,c])=>`<div style="padding:6px 12px;border-radius:8px;border:1.5px solid ${c};color:${c};font-size:12px;font-weight:800;cursor:pointer;">${n}</div>`).join('')}
    </div>
    <div style="font-size:12px;font-weight:800;color:rgba(255,255,255,0.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px;">Pair Students</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
      ${STUDENTS.slice(0,6).map(s=>`<div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:8px 10px;display:flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;font-weight:800;">${s.avatar} ${s.name.split(' ')[0]}</div>`).join('')}
    </div>
    <button class="btn btn-gold btn-full" onclick="Modal.close()">🏁 Start Duel!</button>`;
  },

  studentDetail(s) {
    const stLabel={adv:'Advanced 💜',track:'On Track ✅',help:'Needs Help ⚠️'}[s.status];
    const stColor={adv:'#C4B5FD',track:'#86EFAC',help:'#FCA5A5'}[s.status];
    return `<button class="modal-close" onclick="Modal.close()">✕</button>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="font-size:44px;">${s.avatar}</div>
      <div><div style="font-family:'Fredoka One',cursive;font-size:22px;">${s.name}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);">${s.grade} · ${s.current}</div>
        <div style="color:${stColor};font-size:12px;font-weight:900;margin-top:3px;">${stLabel}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;">
      <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:10px;text-align:center;"><div style="font-family:'Fredoka One',cursive;font-size:22px;color:#FFF176;">⚡ ${s.xp.toLocaleString()}</div><div style="font-size:11px;color:rgba(255,255,255,0.5);font-weight:800;">Total XP</div></div>
      <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:10px;text-align:center;"><div style="font-family:'Fredoka One',cursive;font-size:22px;color:#F97316;">🔥 ${s.streak}</div><div style="font-size:11px;color:rgba(255,255,255,0.5);font-weight:800;">Day Streak</div></div>
      <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:10px;text-align:center;"><div style="font-family:'Fredoka One',cursive;font-size:18px;color:#34D399;">${s.last}</div><div style="font-size:11px;color:rgba(255,255,255,0.5);font-weight:800;">Last Active</div></div>
    </div>
    <div style="font-family:'Fredoka One',cursive;font-size:15px;color:#FFF176;margin-bottom:10px;">🗺️ Domain Progress</div>
    ${Object.entries(s.domains).map(([k,v])=>`<div class="td-s-domain-row" style="margin-bottom:8px;"><div class="td-s-domain-name" style="width:90px;">${DOMAIN_LABELS[k]}</div><div class="td-s-bar-wrap" style="flex:1;background:rgba(255,255,255,0.1);border-radius:6px;height:10px;overflow:hidden;"><div style="height:100%;border-radius:6px;background:${DOMAIN_COLORS[k]};width:${v}%;"></div></div><div style="font-size:12px;font-weight:800;color:rgba(255,255,255,0.55);min-width:32px;text-align:right;">${v}%</div></div>`).join('')}
    <div style="margin-top:14px;background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;">
      <div style="font-size:11px;font-weight:900;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Mrs. Ali's Recommendation</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.65;">${s.status==='help'?'Schedule a 1-on-1 check-in. Consider reassigning to Grade 6 level in Ratio Reef with additional scaffolding. Monitor daily for signs of frustration.':s.status==='adv'?'Ready for Enrichment Isle! Assign real-world missions and consider a peer tutoring role during small group interventions.':'Progressing well. Encourage challenge mode and boss battles. Monitor Equation Volcano — slight lag detected.'}</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px;">
      <button onclick="Modal.close()" class="btn btn-purple" style="flex:1;">⚔️ Assign Task</button>
      <button onclick="Modal.close()" class="btn btn-ghost" style="flex:1;">💬 Send Message</button>
    </div>`;
  },

  questModal(quest) {
    State.currentQuest = quest;
    State.currentQ = 0;
    State.answered = false;
    return this.renderQuestQuestion(quest, 0);
  },

  renderQuestQuestion(quest, idx) {
    const q = quest.questions[idx];
    const total = quest.questions.length;
    return `<button class="modal-close" onclick="Modal.close()">✕</button>
    <div class="modal-label" style="color:#0EA5E9;">📐 RATIO REEF — ${quest.title.toUpperCase()}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div class="modal-title" style="margin:0;">${quest.title}</div>
      <div style="font-family:'Fredoka One',cursive;font-size:14px;color:rgba(255,255,255,0.5);">Q ${idx+1} / ${total}</div>
    </div>
    <div style="background:rgba(255,255,255,0.06);border-radius:10px;height:6px;overflow:hidden;margin-bottom:18px;">
      <div style="height:100%;background:#0EA5E9;border-radius:10px;width:${((idx)/total)*100}%;transition:width .5s;"></div>
    </div>
    <div class="q-box">
      <div class="q-text">${q.q}</div>
      <div class="q-answers">
        ${q.opts.map((o,i)=>`<button class="q-ans" onclick="Modal.answerQuest(this,${i===q.ans},${i},'${q.explain.replace(/'/g,"\\'")}')">${o}</button>`).join('')}
      </div>
    </div>
    <div class="xp-pop" id="modal-xp-pop"></div>`;
  },

  answerQuest(btn, correct, idx, explain) {
    if (State.answered) return;
    State.answered = true;
    document.querySelectorAll('.q-ans').forEach(b => b.disabled = true);
    const quest = State.currentQuest;
    const correctIdx = quest.questions[State.currentQ].ans;
    document.querySelectorAll('.q-ans')[correctIdx].classList.add('correct');
    if (!correct) btn.classList.add('wrong');
    if (correct) { State.xp += Math.round(quest.xp / quest.questions.length); App.updateHUD(); }
    const pop = document.getElementById('modal-xp-pop');
    pop.textContent = correct ? `+${Math.round(quest.xp/quest.questions.length)} XP! 🎉` : 'Not quite! Study the hint below.';
    pop.classList.add('show');
    pop.style.color = correct ? '#FFF176' : '#FCA5A5';
    const expDiv = document.createElement('div');
    expDiv.style.cssText = 'margin-top:12px;background:rgba(255,255,255,0.06);border-radius:10px;padding:12px;font-size:13px;color:rgba(255,255,255,0.8);line-height:1.65;';
    expDiv.innerHTML = '💡 <strong>Explanation:</strong> ' + explain;
    document.querySelector('.q-box').appendChild(expDiv);
    const nextIdx = State.currentQ + 1;
    const hasNext = nextIdx < quest.questions.length;
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn ' + (hasNext ? 'btn-purple' : 'btn-green') + ' btn-full';
    nextBtn.style.marginTop = '14px';
    nextBtn.textContent = hasNext ? 'Next Question →' : '🏆 Quest Complete!';
    nextBtn.onclick = () => {
      if (hasNext) { State.currentQ = nextIdx; State.answered = false; document.getElementById('modal-box').innerHTML = Modal.renderQuestQuestion(quest, nextIdx); }
      else { Modal.close(); Realm.render('ratios'); }
    };
    document.getElementById('modal-box').appendChild(nextBtn);
  }
};

// ── REALM ENGINE ──
const Realm = {
  render(id) {
    const data = id === 'ratios' ? RATIO_REEF : null;
    if (!data) return;
    const screen = document.getElementById('realm-screen');
    screen.innerHTML = this.buildHTML(data);
    this.switchLevel(State.currentLevel, data);
    setTimeout(() => initRealmCanvas('realm-hero-canvas', data.color), 80);
  },

  buildHTML(data) {
    return `
    <nav class="mq-nav">
      <div><div class="mq-brand-sub">Mrs. Ali's Classroom</div><div class="mq-brand-main">Math<span>Quest</span></div></div>
      <div class="mq-nav-right">
        <span class="mq-pill fire hud-streak">🔥 ${State.streak}-day streak</span>
        <span class="mq-pill gold hud-xp">⚡ ${State.xp.toLocaleString()} XP</span>
        <button class="mq-pill" onclick="App.showStudent()">← World Map</button>
      </div>
    </nav>
    <div class="realm-hero">
      <canvas class="realm-hero-canvas" id="realm-hero-canvas"></canvas>
      <div class="realm-hero-inner">
        <div class="realm-eyebrow" style="color:${data.color};">${data.realm}</div>
        <div class="realm-title">${data.boss.icon} ${data.name}</div>
        <div class="realm-sub">Master ratios, rates, proportional relationships & percent problems aligned to Common Core 6.RP & 7.RP</div>
        <div class="realm-xp-row">
          <span class="realm-xp-lbl">⚡ 620 / 1,000 XP</span>
          <div class="xp-bar-wrap" style="width:180px;"><div class="xp-bar-fill" style="width:62%;"></div></div>
          <span class="realm-xp-lbl">Lvl 2</span>
        </div>
      </div>
    </div>
    <div class="realm-content">
      <div class="level-tabs" id="level-tabs">
        ${data.levels.map((lv,i)=>`<button class="level-tab ${lv.status} ${State.currentLevel===i?'active':''}" onclick="Realm.switchLevel(${i},null)" ${lv.status==='lock'?'disabled':''}>
          ${lv.status==='done'?'✅':lv.status==='curr'?'⚡':'🔒'} ${lv.label}
        </button>`).join('')}
      </div>
      <div id="realm-level-content"></div>
    </div>`;
  },

  switchLevel(idx, data) {
    State.currentLevel = idx;
    const d = data || RATIO_REEF;
    const lv = d.levels[idx];
    document.querySelectorAll('.level-tab').forEach((t,i) => { t.classList.toggle('active', i===idx); });
    const content = document.getElementById('realm-level-content');
    if (!content) return;
    content.innerHTML = `
    <div style="margin-bottom:16px;">
      <span class="chip chip-gold" style="font-size:12px;">${lv.standard}</span>
    </div>
    ${idx===1?this.buildBossCard(d):''}
    <div class="td-section-title">⚔️ Quests — ${lv.label}</div>
    <div class="quest-grid">
      ${lv.quests.map((q,qi) => this.buildQuestCard(q, qi, lv.status==='lock')).join('')}
    </div>
    ${this.buildComingSoonRealms()}`;
  },

  buildBossCard(d) {
    return `<div class="realm-boss-card" onclick="Modal.open('boss')">
      <div class="realm-boss-icon">${d.boss.icon}</div>
      <div class="realm-boss-info">
        <div class="realm-boss-lbl">Chapter Boss</div>
        <div class="realm-boss-name">${d.boss.name}</div>
        <div class="realm-boss-desc">${d.boss.desc}</div>
        <div class="realm-boss-hp-wrap"><div class="realm-boss-hp" style="width:${d.boss.hp}%;"></div></div>
        <div class="realm-boss-meta"><span>Boss HP: ${d.boss.hp}%</span><span>${d.boss.fighters} students fighting</span><span>Defeat to unlock Grade 8!</span></div>
      </div>
      <button class="btn btn-red" style="flex-shrink:0;">⚔️ Challenge!</button>
    </div>`;
  },

  buildQuestCard(q, idx, levelLocked) {
    const locked = levelLocked || q.status === 'lock';
    const stars = q.stars > 0 ? '⭐'.repeat(q.stars) + '☆'.repeat(3-q.stars) : '☆☆☆';
    return `<div class="quest-card ${locked?'locked':''} ${q.status==='done'?'completed':''}" onclick="${locked?'':`Realm.startQuest('${q.id}')`}">
      <div class="quest-number">Quest ${idx+1} ${q.status==='done'?'<span class="chip chip-track">Completed ✅</span>':q.status==='curr'?'<span class="chip chip-gold">In Progress ⚡</span>':locked?'<span class="chip chip-locked">🔒 Locked</span>':''}</div>
      <div class="quest-title">${q.title}</div>
      <div class="quest-sub">${q.sub}</div>
      <div class="quest-footer">
        <div class="quest-xp">⚡ +${q.xp} XP</div>
        <div class="quest-stars">${stars}</div>
        ${locked?'':'<button class="btn btn-purple" style="padding:7px 14px;font-size:12px;" onclick="event.stopPropagation();Realm.startQuest(\''+q.id+'\')">'+( q.status==='done'?'Replay':'Start →')+'</button>'}
      </div>
    </div>`;
  },

  buildComingSoonRealms() {
    const realms = [
      {icon:'🔢',name:'Number Peaks'},{icon:'🧮',name:'Equation Volcano'},
      {icon:'📏',name:'Geometry Grove'},{icon:'📊',name:'Data Desert'},{icon:'🌍',name:'Enrichment Isle'}
    ];
    return `<div class="td-section-title" style="margin-top:8px;">🔒 More Realms — Coming Soon</div>
    <div class="coming-soon-grid">
      ${realms.map(r=>`<div class="cs-card"><div class="cs-icon">${r.icon}</div><div class="cs-name">${r.name}</div><div class="cs-tag">Coming Soon 🚀</div></div>`).join('')}
    </div>
    <div class="coming-soon-banner" style="display:block;text-align:center;margin-bottom:16px;">
      🎉 Ratio Reef is just the beginning! Mrs. Ali is unlocking more realms every week. Stay tuned!
    </div>`;
  },

  startQuest(questId) {
    for (const lv of RATIO_REEF.levels) {
      const q = lv.quests.find(q => q.id === questId);
      if (q) { Modal.open('quest', q); return; }
    }
  }
};

// ── TEACHER DASHBOARD ──
const TeacherDash = {
  render(tab) {
    State.tdTab = tab;
    document.querySelectorAll('.td-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.td-tab-pane').forEach(p => p.classList.remove('active'));
    const tabEl = document.querySelector(`[data-tab="${tab}"]`);
    if (tabEl) tabEl.classList.add('active');
    const pane = document.getElementById(`td-pane-${tab}`);
    if (pane) pane.classList.add('active');
    if (tab === 'students') this.renderStudents();
    if (tab === 'leaderboard') this.renderLeaderboard();
    if (tab === 'insights') this.renderInsights();
  },

  renderStudents() {
    const grid = document.getElementById('student-grid'); if (!grid) return;
    const filtered = STUDENTS.filter(s => {
      const ms = s.name.toLowerCase().includes(State.studentSearch.toLowerCase());
      const mf = State.studentFilter === 'all' || s.status === State.studentFilter;
      return ms && mf;
    });
    grid.innerHTML = filtered.map(s => {
      const cls = s.status==='help'?'flagged':s.status==='adv'?'advanced':'';
      const stCls = {adv:'chip-adv',track:'chip-track',help:'chip-help'}[s.status];
      const stLbl = {adv:'Advanced',track:'On Track',help:'Needs Help'}[s.status];
      return `<div class="td-s-card ${cls}" onclick="Modal.open('student-detail',${JSON.stringify(s).replace(/"/g,"'")})">
        <div class="td-s-top">
          <div class="td-s-av">${s.avatar}</div>
          <div style="flex:1;"><div class="td-s-name">${s.name}</div><div class="td-s-grade">${s.grade} · ${s.current}</div></div>
          <span class="chip ${stCls}">${stLbl}</span>
        </div>
        <div>${Object.entries(s.domains).map(([k,v])=>`<div class="td-s-domain-row"><div class="td-s-domain-name">${DOMAIN_LABELS[k]}</div><div class="td-s-bar-wrap"><div class="td-s-bar" style="width:${v}%;background:${DOMAIN_COLORS[k]};"></div></div><div class="td-s-pct">${v}%</div></div>`).join('')}</div>
        <div class="td-s-footer"><span class="td-s-xp">⚡ ${s.xp.toLocaleString()}</span><span class="td-s-streak">${s.streak>0?`🔥 ${s.streak}-day`:'😢 Streak lost'}</span><span class="td-s-last">${s.last}</span></div>
        <div class="td-s-actions">
          <button class="td-s-action td-s-action-blue" onclick="event.stopPropagation();">💬 Message</button>
          <button class="td-s-action td-s-action-amber" onclick="event.stopPropagation();Modal.open('assign-boss')">⚔️ Assign</button>
          ${s.status==='help'?`<button class="td-s-action td-s-action-red" onclick="event.stopPropagation();">🆘 Intervene</button>`:''}
        </div>
      </div>`;
    }).join('');
  },

  renderLeaderboard() {
    const list = document.getElementById('lb-list'); if (!list) return;
    const sorted = [...STUDENTS].sort((a,b) => b.xp-a.xp);
    const medals = ['🥇','🥈','🥉'];
    list.innerHTML = sorted.map((s,i) => `<div class="lb-row" onclick="Modal.open('student-detail',${JSON.stringify(s).replace(/"/g,"'")})">
      <div class="lb-rank" style="color:${i<3?['#FFD700','#C0C0C0','#CD7F32'][i]:'rgba(255,255,255,0.4)'}">${i<3?medals[i]:i+1}</div>
      <div class="lb-av">${s.avatar}</div>
      <div class="lb-name" style="color:${s.status==='adv'?'#C4B5FD':s.status==='help'?'#FCA5A5':'#fff'}">${s.name}</div>
      <div class="lb-domain">${s.current}</div>
      <div class="lb-xp">⚡ ${s.xp.toLocaleString()}</div>
    </div>`).join('');
  },

  renderInsights() {
    const grid = document.getElementById('insights-grid'); if (!grid) return;
    grid.innerHTML = `
    <div class="insight-card">
      <div class="insight-title">🔴 Intervention Group</div>
      <span class="diff-tag" style="background:rgba(220,38,38,0.18);color:#FCA5A5;">3 students — Tier 3 support</span>
      <div class="diff-item">Re-teach ratio concepts with manipulatives & tape diagrams</div>
      <div class="diff-item">Assign Ratio Reef Grade 6 review quests with scaffolding</div>
      <div class="diff-item">Reduce question count per session, increase feedback frequency</div>
      <div class="diff-item">Weekly 1-on-1 check-in after each level attempt</div>
      <span class="diff-tag" style="background:rgba(245,158,11,0.15);color:#FCD34D;margin-top:8px;">Students: Marcus T., Priya R., Lena K.</span>
    </div>
    <div class="insight-card">
      <div class="insight-title">🟡 On-Track Group</div>
      <span class="diff-tag" style="background:rgba(34,197,94,0.15);color:#86EFAC;">20 students — Tier 1 core</span>
      <div class="diff-item">Continue current pacing through Grade 7 quests</div>
      <div class="diff-item">Introduce point duels for mid-week engagement boost</div>
      <div class="diff-item">Boss battle collaboration in groups of 3–4</div>
      <div class="diff-item">Geometry Grove is the next domain unlock for most</div>
    </div>
    <div class="insight-card">
      <div class="insight-title">💜 Advanced Group</div>
      <span class="diff-tag" style="background:rgba(168,85,247,0.18);color:#C4B5FD;">5 students — Extension track</span>
      <div class="diff-item">Unlock Enrichment Isle early — all 3 levels completed</div>
      <div class="diff-item">Assign Stock Market Analyst real-world mission</div>
      <div class="diff-item">Peer tutoring role during intervention group sessions</div>
      <div class="diff-item">Space Mission Calculator (requires all domains)</div>
      <span class="diff-tag" style="background:rgba(168,85,247,0.12);color:#C4B5FD;margin-top:8px;">Aiden, Sofia, Omar, Rania, Yasmine</span>
    </div>
    <div class="insight-card">
      <div class="insight-title">📌 Common Core Gaps</div>
      <span class="diff-tag" style="background:rgba(239,68,68,0.15);color:#FCA5A5;">Standards needing re-teach</span>
      <div class="diff-item">7.RP.A.2 — Proportional relationships (64% pass rate)</div>
      <div class="diff-item">7.EE.B.4 — Multi-step equations (51% pass rate)</div>
      <div class="diff-item">7.G.B.4 — Circle area & circumference (58%)</div>
      <div class="diff-item">7.SP.C.7 — Probability models (48% pass rate)</div>
      <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.45);">Aligned to EngageNY Eureka Math & OpenUp Resources</div>
    </div>
    <div class="insight-card">
      <div class="insight-title">🕐 Time-on-Task</div>
      <div class="chart-bar-row"><div class="chart-lbl">Mon–Wed</div><div class="chart-bw"><div class="chart-bf" style="width:78%;background:#A855F7;"></div></div><div class="chart-val">78%</div></div>
      <div class="chart-bar-row"><div class="chart-lbl">Thu–Fri</div><div class="chart-bw"><div class="chart-bf" style="width:52%;background:#A855F7;"></div></div><div class="chart-val">52%</div></div>
      <div class="chart-bar-row"><div class="chart-lbl">Weekend</div><div class="chart-bw"><div class="chart-bf" style="width:24%;background:#A855F7;"></div></div><div class="chart-val">24%</div></div>
      <div style="margin-top:12px;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.65;">Engagement drops sharply Thu–Fri. Consider scheduling boss battles on Thursdays to sustain motivation through the week.</div>
    </div>
    <div class="insight-card">
      <div class="insight-title">🎯 Recommended Actions</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
        <button class="td-hero-btn" style="border-color:rgba(220,38,38,0.4);color:#FCA5A5;width:100%;text-align:left;" onclick="Modal.open('assign-boss')">⚔️ Assign Ratio Reef boss to entire class</button>
        <button class="td-hero-btn" style="border-color:rgba(168,85,247,0.4);color:#C4B5FD;width:100%;text-align:left;">🌍 Enroll advanced group in Enrichment Isle</button>
        <button class="td-hero-btn" style="border-color:rgba(245,158,11,0.4);color:#FCD34D;width:100%;text-align:left;" onclick="Modal.open('create-duel')">⚔️ Create Thursday duel — boost engagement</button>
        <button class="td-hero-btn" style="border-color:rgba(34,197,94,0.4);color:#86EFAC;width:100%;text-align:left;">📊 Export progress report for parent meetings</button>
      </div>
    </div>`;
  },

  renderHeatmap() {
    const grid = document.getElementById('heatmap-grid'); if (!grid) return;
    const vals = [12,18,24,20,8,5,14, 22,28,19,25,11,3,9, 16,21,28,18,14,6,11];
    const max = Math.max(...vals);
    grid.innerHTML = vals.map(v => {
      const i = v/max;
      const bg = i<0.2?'rgba(255,255,255,0.06)':i<0.5?'rgba(14,165,233,0.3)':i<0.8?'rgba(14,165,233,0.65)':'rgba(14,165,233,1)';
      return `<div class="hm-cell" style="background:${bg};border-radius:4px;">${v}</div>`;
    }).join('');
  }
};

// ── INIT ──
window.addEventListener('load', () => {
  App.showLanding();
  document.getElementById('modal-overlay').addEventListener('click', function(e) { if(e.target===this) Modal.close(); });
});
window.addEventListener('resize', () => {
  if (document.getElementById('student-world').classList.contains('active')) WorldMap.resize();
});
