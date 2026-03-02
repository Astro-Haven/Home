/* ─── ACTIVE NAV ─── */
(function(){
  const map = {
    'index.html':'nav-home','':'nav-home',
    'about.html':'nav-about',
    'members.html':'nav-members',
    'projects.html':'nav-projects',
    'events.html':'nav-events',
    'gallery.html':'nav-gallery',
    'news.html':'nav-news',
    'resources.html':'nav-resources',
    'contact.html':'nav-contact',
    'press.html':'nav-press',
    'article-iau.html':'nav-news',
    'article-exoplanet.html':'nav-news',
    'article-starparty.html':'nav-news',
    'article-schools.html':'nav-news',
    'article-varstar.html':'nav-news',
    'article-platform.html':'nav-news'
  };
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const id = map[page];
  if(id){ const el=document.getElementById(id); if(el) el.classList.add('active'); }
})();

/* ─── CURSOR ─── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;

document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
(function animC(){
  rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
  cursorRing.style.left=rx+'px'; cursorRing.style.top=ry+'px';
  requestAnimationFrame(animC);
})();
document.querySelectorAll('a,button,.member-sec,.gallery-item,.masonry-item,.news-sec-card,.sec-card,.press-card,.testimonial-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
  el.addEventListener('mouseleave',()=>{ cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
});

/* ─── LOADER ─── */
function hideLoader(){ const l=document.getElementById('loader'); if(l) l.classList.add('hidden'); }
if(document.readyState==='complete'){ setTimeout(hideLoader,900); }
else { window.addEventListener('load',()=>setTimeout(hideLoader,2700)); }
setTimeout(hideLoader,4500);

/* ─── BACKGROUND STAR CANVAS ─── */
const bgCanvas = document.getElementById('starCanvas');
if(bgCanvas){
  const bgCtx = bgCanvas.getContext('2d');
  let bgStars = [];
  function resizeBg(){ bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight; }
  resizeBg(); window.addEventListener('resize',resizeBg);
  function makeBgStars(){
    bgStars=[];
    for(let i=0;i<300;i++) bgStars.push({
      x:Math.random()*bgCanvas.width, y:Math.random()*bgCanvas.height,
      r:Math.random()*1.5+.2, o:Math.random()*.75+.1,
      s:Math.random()*.45+.05, t:Math.random()*Math.PI*2,
      tw:Math.random()>.55
    });
  }
  makeBgStars(); window.addEventListener('resize',makeBgStars);
  let msX=window.innerWidth/2, msY=window.innerHeight/2;
  document.addEventListener('mousemove',e=>{ msX=e.clientX; msY=e.clientY; });
  (function drawBg(){
    bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
    bgStars.forEach(s=>{
      s.t+=s.s*.018;
      const px=s.x+(msX-bgCanvas.width/2)*.007;
      const py=s.y+(msY-bgCanvas.height/2)*.007;
      const ao=s.tw?s.o*(.45+.55*Math.sin(s.t)):s.o;
      bgCtx.beginPath(); bgCtx.arc(px,py,s.r,0,Math.PI*2);
      bgCtx.fillStyle=`rgba(200,212,232,${ao})`; bgCtx.fill();
    });
    requestAnimationFrame(drawBg);
  })();
}

/* ─── SCROLL EVENTS ─── */
window.addEventListener('scroll', onScroll, {passive:true});
function onScroll(){
  const p = document.scrollingElement;
  const pct = (p.scrollTop/(p.scrollHeight-p.clientHeight))*100;
  const sp = document.getElementById('scrollProgress');
  if(sp) sp.style.width=pct+'%';
  const nb = document.getElementById('navbar');
  if(nb) nb.classList.toggle('scrolled', p.scrollTop>60);

  document.querySelectorAll('.reveal').forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight*.9) el.classList.add('visible');
  });
  document.querySelectorAll('.progress-fill').forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight && !el.dataset.animated){
      el.dataset.animated='1';
      el.style.width=(el.dataset.width||0)+'%';
    }
  });
  document.querySelectorAll('.stat-number').forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight && !el.dataset.counted){
      el.dataset.counted='1';
      const target=parseInt(el.dataset.target);
      let v=0; const dur=2000,step=16,inc=target/(dur/step);
      const t=setInterval(()=>{
        v+=inc;
        if(v>=target){ v=target; clearInterval(t); }
        el.textContent=Math.floor(v).toLocaleString()+(target===200?'+':'');
      },step);
    }
  });
}
setTimeout(()=>window.dispatchEvent(new Event('scroll')),400);

/* ─── MOBILE NAV ─── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if(hamburger && mobileNav){
  hamburger.addEventListener('click',()=>{
    mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

/* ─── NOTIFICATION TOAST ─── */
let notifTimer=null;
function notify(title,msg){
  const n=document.getElementById('notif');
  if(!n) return;
  document.getElementById('notifTitle').textContent=title;
  document.getElementById('notifMsg').textContent=msg;
  n.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer=setTimeout(()=>n.classList.remove('show'),3800);
}

/* ─── NEWSLETTER ─── */
function subscribeNewsletter(){
  const input=document.getElementById('newsletterEmail');
  if(!input) return;
  const email=input.value.trim();
  if(!email||!email.includes('@')){ notify('Invalid Email','Please enter a valid email address.'); return; }
  notify('Subscribed!','Thank you — you\'ve been added to the AstroHaven newsletter.');
  input.value='';
}

/* ─── QUOTES (home page) ─── */
const quotes=[
  {text:"The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",author:"Carl Sagan"},
  {text:"Somewhere, something incredible is waiting to be known.",author:"Sharon Begley"},
  {text:"The universe is under no obligation to make sense to you.",author:"Neil deGrasse Tyson"},
  {text:"Two things fill the mind with ever-increasing wonder: the starry sky above me, and the moral law within me.",author:"Immanuel Kant"},
  {text:"For small creatures such as we, the vastness is bearable only through love.",author:"Carl Sagan"},
];
let cq=0;
function setQuote(i){
  cq=i;
  const t=document.getElementById('quoteText'),a=document.getElementById('quoteAuthor');
  if(!t||!a) return;
  t.style.opacity='0'; a.style.opacity='0';
  setTimeout(()=>{ t.textContent=quotes[i].text; a.textContent='— '+quotes[i].author; t.style.opacity='1'; a.style.opacity='1'; },320);
  document.querySelectorAll('.quote-dot').forEach((d,j)=>d.classList.toggle('active',j===i));
}
if(document.getElementById('quoteText')){
  setInterval(()=>setQuote((cq+1)%quotes.length),5500);
}

/* ─── FAQ ─── */
function toggleFaq(btn){
  const item=btn.closest('.faq-item');
  const wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!wasOpen) item.classList.add('open');
}

/* ─── FILTER BUTTONS ─── */
function setFilter(btn){
  const parent=btn.closest('div');
  if(parent) parent.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

/* ─── COUNTDOWN (events page) ─── */
function updateCountdown(){
  const target=new Date('2026-03-14T20:00:00Z');
  const diff=target-new Date();
  if(diff<=0){ ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='00';}); return; }
  const vals=[Math.floor(diff/86400000),(Math.floor(diff/3600000))%24,(Math.floor(diff/60000))%60,(Math.floor(diff/1000))%60];
  ['cd-days','cd-hours','cd-mins','cd-secs'].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.textContent=String(vals[i]).padStart(2,'0');});
}
if(document.getElementById('cd-days')){
  updateCountdown(); setInterval(updateCountdown,1000);
}

/* ─────────────────────────────────────────────
   HERO CANVAS (home page only)
───────────────────────────────────────────── */
(function initHeroCanvas(){
  const hc = document.getElementById('heroCanvas');
  if(!hc) return;
  const ctx = hc.getContext('2d');
  let W, H, stars=[], shooters=[], planets=[], nebulae=[], animId;
  function rand(a,b){ return a+Math.random()*(b-a); }

  function resize(){
    const hero = document.querySelector('.hero');
    W = hc.width  = hero ? hero.offsetWidth  : window.innerWidth;
    H = hc.height = hero ? hero.offsetHeight : window.innerHeight;
    buildScene();
  }
  function buildScene(){
    stars=[];
    for(let i=0;i<520;i++){
      const tier=Math.random();
      const r=tier<0.62?rand(0.12,0.65):tier<0.88?rand(0.65,1.5):rand(1.5,2.8);
      const palette=['255,255,255','215,228,255','255,245,210','190,215,255','230,240,255'];
      stars.push({x:rand(0,W),y:rand(0,H),r,baseA:rand(0.2,0.82),phase:rand(0,Math.PI*2),spd:rand(0.004,0.028),twinkle:Math.random()>0.38,col:palette[Math.floor(Math.random()*palette.length)]});
    }
    nebulae=[
      {x:W*0.10,y:H*0.20,rx:W*0.20,ry:H*0.15,col:'rgba(50,80,200,0.042)'},
      {x:W*0.84,y:H*0.32,rx:W*0.17,ry:H*0.20,col:'rgba(90,45,185,0.038)'},
      {x:W*0.50,y:H*0.82,rx:W*0.24,ry:H*0.14,col:'rgba(25,75,175,0.034)'},
      {x:W*0.22,y:H*0.68,rx:W*0.14,ry:H*0.11,col:'rgba(65,115,225,0.030)'},
      {x:W*0.78,y:H*0.10,rx:W*0.15,ry:H*0.10,col:'rgba(75,35,165,0.028)'},
    ];
    planets=[
      {x:W*0.07,y:H*0.17,r:24,grad:['#c8d4ec','#8898c0','#5868a0'],rings:true,rRx:52,rRy:10,rAngle:-0.30,rCol:'rgba(200,218,245,0.55)',rCol2:'rgba(155,180,225,0.22)',glow:'rgba(140,168,230,0.18)',drift:{ox:0,oy:0,t:0,sx:0.38,sy:0.26}},
      {x:W*0.92,y:H*0.80,r:20,grad:['#5880d0','#2850b0','#163888'],rings:true,rRx:42,rRy:8,rAngle:0.20,rCol:'rgba(115,158,245,0.50)',rCol2:'rgba(75,118,205,0.20)',glow:'rgba(75,118,225,0.20)',drift:{ox:0,oy:0,t:1.5,sx:0.28,sy:0.34}},
      {x:W*0.88,y:H*0.12,r:11,grad:['#ccc0a0','#aaa080','#888060'],rings:false,glow:'rgba(200,185,145,0.15)',drift:{ox:0,oy:0,t:3.1,sx:0.20,sy:0.18}},
      {x:W*0.05,y:H*0.84,r:9,grad:['#a080d0','#8060b0','#603890'],rings:false,glow:'rgba(148,100,205,0.18)',drift:{ox:0,oy:0,t:0.8,sx:0.22,sy:0.16}},
    ];
    shooters=[];
    for(let i=0;i<4;i++) shooters.push(spawnShooter(true));
  }
  function spawnShooter(rand_delay){
    return {active:false,delay:rand_delay?rand(500,7000):rand(2000,9000),x:0,y:0,vx:0,vy:0,trailLen:rand(90,230),spd:rand(9,20),a:0,life:0,maxLife:rand(38,72)};
  }
  function activateShooter(s){
    const fromTop=Math.random()>0.45;
    s.x=fromTop?rand(W*0.1,W*0.9):rand(W*0.55,W);
    s.y=fromTop?-5:rand(0,H*0.35);
    const ang=rand(0.42,0.88);
    s.vx=Math.cos(ang)*s.spd; s.vy=Math.sin(ang)*s.spd;
    s.a=0; s.life=0; s.active=true;
  }
  function drawPlanet(p,t){
    ctx.save();
    const ox=Math.sin(t*0.35+p.drift.t)*4.5*p.drift.sx;
    const oy=Math.cos(t*0.28+p.drift.t)*3.5*p.drift.sy;
    const cx=p.x+ox,cy=p.y+oy;
    const hg=ctx.createRadialGradient(cx,cy,p.r*0.4,cx,cy,p.r*3.0);
    hg.addColorStop(0,p.glow); hg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(cx,cy,p.r*3.0,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill();
    if(p.rings){
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(p.rAngle);
      ctx.beginPath(); ctx.ellipse(0,0,p.rRx,p.rRy,0,Math.PI,Math.PI*2); ctx.strokeStyle=p.rCol; ctx.lineWidth=4.5; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0,0,p.rRx+6,p.rRy+2,0,Math.PI,Math.PI*2); ctx.strokeStyle=p.rCol2; ctx.lineWidth=2.5; ctx.stroke();
      ctx.restore();
    }
    const bg=ctx.createRadialGradient(cx-p.r*0.32,cy-p.r*0.32,p.r*0.05,cx,cy,p.r);
    bg.addColorStop(0,p.grad[0]); bg.addColorStop(0.55,p.grad[1]); bg.addColorStop(1,p.grad[2]);
    ctx.beginPath(); ctx.arc(cx,cy,p.r,0,Math.PI*2); ctx.fillStyle=bg; ctx.fill();
    if(p.r>13){
      ctx.save(); ctx.globalAlpha=0.07; ctx.globalCompositeOperation='multiply';
      [-0.28,0,0.28].forEach(f=>{ ctx.beginPath(); ctx.ellipse(cx,cy+f*p.r,p.r,p.r*0.13,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,40,1)'; ctx.fill(); });
      ctx.restore();
    }
    if(p.rings){
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(p.rAngle);
      ctx.beginPath(); ctx.ellipse(0,0,p.rRx,p.rRy,0,0,Math.PI); ctx.strokeStyle=p.rCol; ctx.lineWidth=4.5; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0,0,p.rRx+6,p.rRy+2,0,0,Math.PI); ctx.strokeStyle=p.rCol2; ctx.lineWidth=2.5; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
  function sparkle(x,y,sz,alpha){
    ctx.save(); ctx.globalAlpha=alpha*0.55; ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.moveTo(x-sz,y); ctx.lineTo(x+sz,y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x,y-sz); ctx.lineTo(x,y+sz); ctx.stroke();
    const d=sz*0.38; ctx.globalAlpha=alpha*0.25;
    ctx.beginPath(); ctx.moveTo(x-d,y-d); ctx.lineTo(x+d,y+d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+d,y-d); ctx.lineTo(x-d,y+d); ctx.stroke();
    ctx.restore();
  }
  let lastT=0,elapsed=0;
  function loop(now){
    animId=requestAnimationFrame(loop);
    const dt=Math.min((now-lastT)/16.667,3); lastT=now; elapsed+=dt*0.016;
    ctx.clearRect(0,0,W,H);
    nebulae.forEach(n=>{
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,Math.max(n.rx,n.ry));
      g.addColorStop(0,n.col); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); const scY=n.ry/n.rx; ctx.scale(1,scY);
      ctx.beginPath(); ctx.arc(n.x,n.y/scY,n.rx,0,Math.PI*2); ctx.fillStyle=g; ctx.fill(); ctx.restore();
    });
    stars.forEach(s=>{
      s.phase+=s.spd*dt;
      const a=s.twinkle?s.baseA*(0.35+0.65*Math.abs(Math.sin(s.phase))):s.baseA;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${s.col},${a.toFixed(2)})`; ctx.fill();
      if(s.r>1.7&&a>0.58) sparkle(s.x,s.y,s.r*2.4,a);
    });
    planets.forEach(p=>drawPlanet(p,elapsed));
    shooters.forEach(s=>{
      if(!s.active){ s.delay-=dt*16.667; if(s.delay<=0) activateShooter(s); return; }
      s.life+=dt;
      const prog=s.life/s.maxLife;
      s.a=prog<0.12?prog/0.12:prog>0.65?(1-prog)/0.35:1.0;
      s.x+=s.vx*dt; s.y+=s.vy*dt;
      const tx=s.x-s.vx*(s.trailLen/s.spd),ty=s.y-s.vy*(s.trailLen/s.spd);
      const tg=ctx.createLinearGradient(tx,ty,s.x,s.y);
      tg.addColorStop(0,'rgba(255,255,255,0)');
      tg.addColorStop(0.55,`rgba(195,218,255,${(s.a*0.32).toFixed(2)})`);
      tg.addColorStop(1,`rgba(255,255,255,${(s.a*0.92).toFixed(2)})`);
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(s.x,s.y); ctx.strokeStyle=tg; ctx.lineWidth=1.3; ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x,s.y,2,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${s.a.toFixed(2)})`; ctx.fill();
      if(s.life>=s.maxLife||s.x>W+250||s.y>H+250){ s.active=false; s.delay=rand(3000,10000); }
    });
  }
  requestAnimationFrame(t=>{lastT=t; loop(t);});
  let resizeTimer;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{ cancelAnimationFrame(animId); resize(); requestAnimationFrame(t=>{lastT=t; loop(t);}); },150);
  });
  resize();
})();
