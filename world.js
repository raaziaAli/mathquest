// ── WORLD MAP ENGINE ──
const WorldMap = (() => {
  let bgC, isC, bx, ix, W, H, time = 0, hovered = null, raf = null;
  const CLOUDS = [
    {ox:0.04,oy:0.06,w:140,spd:0.18,t:0},{ox:0.40,oy:0.04,w:110,spd:0.14,t:500},
    {ox:0.72,oy:0.08,w:130,spd:0.20,t:200},{ox:0.55,oy:0.02,w:90,spd:0.12,t:800},
    {ox:0.20,oy:0.13,w:100,spd:0.16,t:300}
  ];
  const BIRDS = Array.from({length:10},(_,i)=>({ox:Math.random(),oy:0.04+Math.random()*0.15,spd:0.22+Math.random()*0.18,t:i*90,amp:2+Math.random()*3,freq:0.06+Math.random()*0.04}));

  function gp(isl) { return {x:isl.x*W, y:isl.y*H, rx:isl.rx*W, ry:isl.ry*H}; }

  function init(bgId, isId) {
    bgC = document.getElementById(bgId);
    isC = document.getElementById(isId);
    if (!bgC || !isC) return;
    resize();
    isC.addEventListener('mousemove', onMv);
    isC.addEventListener('click', onClick);
    isC.addEventListener('mouseleave', () => { hovered = null; hideTT(); isC.style.cursor = 'default'; });
    if (raf) cancelAnimationFrame(raf);
    loop();
  }

  function resize() {
    const world = bgC.parentElement;
    W = world.offsetWidth; H = world.offsetHeight;
    bgC.width = isC.width = W;
    bgC.height = isC.height = H;
    bx = bgC.getContext('2d');
    ix = isC.getContext('2d');
  }

  function loop() { time++; drawBg(); drawIslands(); raf = requestAnimationFrame(loop); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

  function drawBg() {
    const c = bx;
    const sg = c.createLinearGradient(0,0,0,H*0.62);
    sg.addColorStop(0,'#060D1F'); sg.addColorStop(0.5,'#0C1A3A'); sg.addColorStop(1,'#0E4A7A');
    c.fillStyle = sg; c.fillRect(0,0,W,H);
    for (let i=0;i<80;i++) { const sx=(i*137.508)%W,sy=(i*89.3)%H*0.55,b=Math.sin(time*0.015+i)*0.35+0.6; c.fillStyle=`rgba(255,255,255,${b*0.75})`; c.beginPath(); c.arc(sx,sy,0.9,0,Math.PI*2); c.fill(); }
    const mx=W*0.85,my=H*0.11; c.fillStyle='#FEF9C3'; c.beginPath(); c.arc(mx,my,20,0,Math.PI*2); c.fill();
    for (let r=28;r<=65;r+=18) { c.strokeStyle=`rgba(254,249,195,${0.08})`; c.lineWidth=r*0.22; c.beginPath(); c.arc(mx,my,r,0,Math.PI*2); c.stroke(); }
    CLOUDS.forEach(cl => {
      const cx=((cl.ox*W+cl.t*cl.spd)%(W+cl.w+100))-cl.w*0.3, cy=cl.oy*H;
      c.fillStyle='rgba(255,255,255,0.82)';
      [[0,0,cl.w*0.18],[cl.w*0.28,0,cl.w*0.22],[cl.w*0.6,0,cl.w*0.16],[cl.w*0.14,cl.w*-0.06,cl.w*0.20]].forEach(([ox,oy,r]) => { c.beginPath(); c.arc(cx+ox,cy+oy,r,0,Math.PI*2); c.fill(); });
      cl.t++;
    });
    BIRDS.forEach(b => { const bxb=((b.ox*W+b.t*b.spd)%(W+60))-30,byb=b.oy*H+Math.sin(b.t*b.freq)*b.amp; c.strokeStyle='rgba(255,255,255,0.65)'; c.lineWidth=1.2; c.beginPath(); c.moveTo(bxb-5,byb); c.quadraticCurveTo(bxb,byb-3.5,bxb+5,byb); c.stroke(); b.t++; });
    const wy0=H*0.56, wg=c.createLinearGradient(0,wy0,0,H);
    wg.addColorStop(0,'#0E6EA6'); wg.addColorStop(0.4,'#064E6E'); wg.addColorStop(1,'#021527');
    c.fillStyle=wg; c.fillRect(0,wy0,W,H-wy0);
    for (let i=0;i<7;i++) { const wy=wy0+i*((H-wy0)/7),phase=Math.sin(time*0.007+i*0.9)*5; c.strokeStyle=`rgba(255,255,255,${0.04+i*0.012})`; c.lineWidth=1.5; c.beginPath(); for(let wx=0;wx<=W;wx+=10){const py=wy+Math.sin(wx*0.022+time*0.009+i)*5+phase; wx===0?c.moveTo(wx,py):c.lineTo(wx,py);} c.stroke(); }
  }

  function drawIslands() {
    const c = ix; c.clearRect(0,0,W,H);
    PATHS.forEach(([a,b]) => {
      const p1=gp(ISLANDS[a]),p2=gp(ISLANDS[b]);
      c.setLineDash([8,12]); c.strokeStyle='rgba(255,255,255,0.15)'; c.lineWidth=1.5;
      c.beginPath(); c.moveTo(p1.x,p1.y); c.lineTo(p2.x,p2.y); c.stroke(); c.setLineDash([]);
    });
    const bt=(time*0.003)%1, p1=gp(ISLANDS[0]), p2=gp(ISLANDS[1]);
    const bxb=p1.x+bt*(p2.x-p1.x), byb=p1.y+bt*(p2.y-p1.y)+Math.sin(time*0.05)*3;
    c.font='14px serif'; c.textAlign='center'; c.fillText('⛵',bxb,byb);
    ISLANDS.forEach((isl,idx) => {
      const {x,y,rx,ry}=gp(isl), isH=isl===hovered, pulse=1+Math.sin(time*0.025+idx*0.9)*0.04;
      c.save(); c.fillStyle='rgba(0,0,0,0.28)'; c.beginPath(); c.ellipse(x,y+ry*1.1,rx,ry*0.3,0,0,Math.PI*2); c.fill(); c.restore();
      if (isH) { c.save(); c.strokeStyle=isl.col; c.lineWidth=2; c.globalAlpha=0.5+Math.sin(time*0.05)*0.28; c.beginPath(); c.ellipse(x,y,rx*pulse*1.25,ry*pulse*1.25,0,0,Math.PI*2); c.stroke(); c.restore(); }
      c.save();
      const ig=c.createRadialGradient(x-rx*0.25,y-ry*0.25,ry*0.1,x,y,rx*pulse);
      ig.addColorStop(0,'#fff'); ig.addColorStop(0.2,isl.col); ig.addColorStop(0.75,isl.dark); ig.addColorStop(1,'rgba(0,0,0,0.15)');
      c.fillStyle=ig; const pts=10; c.beginPath();
      for(let i=0;i<pts*2;i++){const ang=(i/pts)*Math.PI-Math.PI/2,rr=i%2===0?1:(0.72+Math.sin(i*2.1+time*0.02+idx)*0.06),px=x+Math.cos(ang)*rx*rr*pulse,py=y+Math.sin(ang)*ry*rr*pulse; i===0?c.moveTo(px,py):c.lineTo(px,py);}
      c.closePath(); c.fill(); c.restore();
      if (isl.id==='expressions') { for(let f=0;f<5;f++){const fx=x+(Math.sin(time*0.08+f*1.2))*rx*0.25,fy=y-ry*0.85-Math.abs(Math.sin(time*0.06+f))*ry*0.4,fr=3+Math.sin(time*0.1+f)*2; c.fillStyle=['#F97316','#EF4444','#FCD34D'][f%3]; c.globalAlpha=0.8; c.beginPath(); c.arc(fx,fy,fr,0,Math.PI*2); c.fill(); c.globalAlpha=1;} }
      const pbw=rx*1.6,pbx=x-pbw/2,pby=y+ry*1.0; c.fillStyle='rgba(0,0,0,0.38)'; c.beginPath(); c.roundRect(pbx,pby,pbw,7,4); c.fill(); c.fillStyle=isl.col; c.beginPath(); c.roundRect(pbx,pby,pbw*(isl.xp/100),7,4); c.fill();
      if (!isl.live) { c.fillStyle='rgba(0,0,0,0.48)'; c.beginPath(); c.ellipse(x,y,rx*pulse,ry*pulse,0,0,Math.PI*2); c.fill(); }
      c.font=`${isH?19:16}px serif`; c.textAlign='center'; c.fillStyle='rgba(0,0,0,0.4)'; c.fillText(isl.icon,x+1.5,y+ry*0.08+2); c.fillStyle='#fff'; c.fillText(isl.icon,x,y+ry*0.08);
      c.font=`900 ${isH?13:12}px Nunito`; c.textAlign='center'; c.fillStyle='rgba(0,0,0,0.45)'; c.fillText(isl.name,x+1.2,y+ry*1.25+1); c.fillStyle='#fff'; c.fillText(isl.name,x,y+ry*1.25);
      if (!isl.live) { c.font='900 11px Nunito'; c.fillStyle='rgba(255,255,255,0.55)'; c.fillText('Coming Soon',x,y+ry*0.5); }
      if (isl.lvs.some(l=>l==='curr')&&isl.live) { c.fillStyle=Math.sin(time*0.06)>0?'#FFF176':'#F59E0B'; c.beginPath(); c.arc(x+rx*0.82,y-ry*0.85,5.5,0,Math.PI*2); c.fill(); }
    });
    const pp=document.getElementById('mq-player'); if(pp){pp.style.left=(W*0.475-14)+'px'; pp.style.top=(H*0.465-28)+'px';}
  }

  function onMv(e) {
    const r=isC.getBoundingClientRect(), mx=(e.clientX-r.left)*(W/r.width), my=(e.clientY-r.top)*(H/r.height);
    let found=null;
    for(const isl of ISLANDS){const{x,y,rx,ry}=gp(isl),dx=(mx-x)/rx,dy=(my-y)/ry; if(dx*dx+dy*dy<1.3){found=isl;break;}}
    if(found!==hovered){hovered=found; if(found)showTT(found,e.clientX,e.clientY); else hideTT();}
    else if(found) moveTT(e.clientX,e.clientY);
    isC.style.cursor=hovered?'pointer':'default';
  }

  function onClick() {
    if (!hovered) return;
    if (hovered.live) { App.showRealm(hovered.id); }
    else { App.openModal('coming-soon', hovered); }
  }

  function showTT(isl,cx,cy) {
    const tt=document.getElementById('mq-tt');
    document.getElementById('tt-realm').textContent=isl.realm;
    document.getElementById('tt-realm').style.color=isl.col;
    document.getElementById('tt-name').textContent=isl.icon+' '+isl.name;
    document.getElementById('tt-desc').textContent=isl.desc;
    const lv=document.getElementById('tt-lvs'); lv.innerHTML='';
    ['Gr.6','Gr.7','Gr.8'].forEach((lb,i)=>{const s=isl.lvs[i],b=document.createElement('span'); b.className='tt-lv '+(s==='done'?'lv-done':s==='curr'?'lv-curr':'lv-lock'); b.textContent=(s==='done'?'✓ ':s==='curr'?'⚡ ':'🔒 ')+lb; lv.appendChild(b);});
    document.getElementById('tt-bar-fill').style.width=isl.xp+'%';
    document.getElementById('tt-bar-fill').style.background=isl.col;
    document.getElementById('tt-xp-lbl').textContent=isl.xplbl;
    const btn=document.getElementById('tt-enter-btn');
    btn.style.background=isl.live?isl.dark:'rgba(255,255,255,0.1)';
    btn.textContent=isl.live?'Enter Realm →':'🔒 Coming Soon';
    btn.onclick=()=>onClick();
    moveTT(cx,cy); tt.classList.add('show');
  }
  function moveTT(cx,cy) {
    const tt=document.getElementById('mq-tt'), wr=document.getElementById('mq-world').getBoundingClientRect();
    let lx=cx-wr.left,ty=cy-wr.top-20;
    if(lx<117)lx=117; if(lx>wr.width-117)lx=wr.width-117; if(ty<8)ty=cy-wr.top+35;
    tt.style.left=lx+'px'; tt.style.top=ty+'px';
  }
  function hideTT() { document.getElementById('mq-tt').classList.remove('show'); }

  return { init, stop, resize };
})();

// ── LANDING CANVAS ──
function initLandingCanvas() {
  const c = document.getElementById('land-canvas'); if(!c) return;
  const p = c.parentElement; c.width=p.offsetWidth; c.height=p.offsetHeight;
  const ctx=c.getContext('2d'); let t=0;
  function draw() {
    t++; ctx.clearRect(0,0,c.width,c.height);
    const g=ctx.createLinearGradient(0,0,0,c.height);
    g.addColorStop(0,'#060D1F'); g.addColorStop(0.5,'#0C1A3A'); g.addColorStop(1,'#1E3A6E');
    ctx.fillStyle=g; ctx.fillRect(0,0,c.width,c.height);
    for(let i=0;i<120;i++){const sx=(i*137.5)%c.width,sy=(i*97.3)%c.height*0.85,b=Math.sin(t*0.012+i)*0.4+0.6; ctx.fillStyle=`rgba(255,255,255,${b*0.8})`; ctx.beginPath(); ctx.arc(sx,sy,0.9,0,Math.PI*2); ctx.fill();}
    const mx=c.width*0.82,my=c.height*0.13; ctx.fillStyle='#FEF9C3'; ctx.beginPath(); ctx.arc(mx,my,26,0,Math.PI*2); ctx.fill();
    for(let r=34;r<=75;r+=18){ctx.strokeStyle='rgba(254,249,195,0.07)'; ctx.lineWidth=r*0.2; ctx.beginPath(); ctx.arc(mx,my,r,0,Math.PI*2); ctx.stroke();}
    [[0.15,0.55,58,'#0EA5E9'],[0.72,0.45,48,'#A855F7'],[0.45,0.75,43,'#22C55E'],[0.85,0.70,38,'#EF4444'],[0.28,0.82,36,'#F59E0B'],[0.60,0.60,34,'#EC4899']].forEach(([xi,yi,r,col],idx)=>{
      const pulse=1+Math.sin(t*0.02+idx*1.1)*0.05, ig=ctx.createRadialGradient(xi*c.width-r*0.2,yi*c.height-r*0.2,r*0.1,xi*c.width,yi*c.height,r*1.5*pulse);
      ig.addColorStop(0,'#fff'); ig.addColorStop(0.3,col); ig.addColorStop(0.8,col+'55'); ig.addColorStop(1,'transparent');
      ctx.fillStyle=ig; ctx.beginPath(); ctx.ellipse(xi*c.width,yi*c.height,r*1.4*pulse,r*0.7*pulse,0,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── REALM HERO CANVAS ──
function initRealmCanvas(canvasId, color) {
  const c = document.getElementById(canvasId); if(!c) return;
  const p = c.parentElement; c.width=p.offsetWidth; c.height=p.offsetHeight;
  const ctx=c.getContext('2d'); let t=0;
  function draw() {
    t++; ctx.clearRect(0,0,c.width,c.height);
    const g=ctx.createLinearGradient(0,0,c.width,c.height);
    g.addColorStop(0,color+'33'); g.addColorStop(1,'rgba(0,0,0,0.5)');
    ctx.fillStyle=g; ctx.fillRect(0,0,c.width,c.height);
    for(let i=0;i<40;i++){const sx=(i*137.5)%c.width,sy=(i*89.3)%c.height,b=Math.sin(t*0.015+i)*0.3+0.5; ctx.fillStyle=`rgba(255,255,255,${b*0.6})`; ctx.beginPath(); ctx.arc(sx,sy,0.8,0,Math.PI*2); ctx.fill();}
    for(let i=0;i<5;i++){const px=c.width*(0.1+i*0.2),py=c.height*(0.5+Math.sin(t*0.02+i)*0.2),pr=20+Math.sin(t*0.03+i*0.7)*8; ctx.fillStyle=color+(Math.floor(30+Math.sin(t*0.02+i)*20).toString(16).padStart(2,'0')); ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.fill();}
    requestAnimationFrame(draw);
  }
  draw();
}
