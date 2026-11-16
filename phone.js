(()=>{
'use strict';
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const phone=q('#phoneFrame'),lock=q('#phoneLock'),unlock=q('#phoneUnlock');
if(!phone||!lock||!unlock)return;
let page=0;
function clock(){
  const now=new Date();
  const txt=new Intl.DateTimeFormat('id-ID',{hour:'2-digit',minute:'2-digit',hour12:false}).format(now).replace('.',':');
  const c=q('#phoneClock'),l=q('#phoneLockTime');
  if(c)c.textContent=txt;
  if(l)l.textContent=txt;
}
clock();
setInterval(clock,60000);
function unlocked(){
  lock.classList.add('hidden-unlocked');
  lock.setAttribute('aria-hidden','true');
  if('inert' in lock)lock.inert=true;
}
function lockAgain(){
  // Return to a clean birthday lock screen without resetting visited apps.
  lock.removeAttribute('aria-hidden');
  if('inert' in lock)lock.inert=false;
  lock.classList.remove('hidden-unlocked');
  lock.scrollTop=0;
  const home=q('#phoneHome');if(home)home.scrollTop=0;
  // Keep keyboard focus inside the lock screen once it is visible.
  unlock.focus({preventScroll:true});
}
unlock.addEventListener('click',unlocked);
q('#phoneLockAgain')?.addEventListener('click',lockAgain);
// The lock screen intentionally starts locked on every fresh page load,
// including reloads; only exploration progress persists in localStorage.
function showPage(next){
  page=Math.max(0,Math.min(1,next));
  qa('.phone-page').forEach(el=>{
    const is=Number(el.dataset.page)===page;
    el.hidden=!is;
    el.classList.toggle('phone-page-active',is);
  });
  qa('.phone-page-dot').forEach(el=>{
    const on=Number(el.dataset.phonePage)===page;
    el.classList.toggle('active',on);
    el.setAttribute('aria-current',on?'page':'false');
  });
  q('#phonePageLabel').textContent=page===0?'Your little apps':'More little surprises';
  const home=q('#phoneHome');if(home)home.scrollTop=0;
}
qa('[data-phone-page]').forEach(b=>b.addEventListener('click',()=>showPage(Number(b.dataset.phonePage))));
q('#phonePrev')?.addEventListener('click',()=>showPage(page-1));
q('#phoneNext')?.addEventListener('click',()=>showPage(page+1));
q('#phoneHomeButton')?.addEventListener('click',()=>{
  const mini=q('.os-modal.visible');
  if(mini)mini.querySelector('[data-os-action="close"]')?.click();
  const older=q('#modalRoot');
  if(older&&older.classList.contains('open'))q('#closeBtn')?.click();
  showPage(0);
});
let start=null;
const home=q('#phoneHome');
home?.addEventListener('touchstart',e=>{
  if(e.touches.length!==1){start=null;return}
  start={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
home?.addEventListener('touchend',e=>{
  if(!start||e.changedTouches.length!==1)return;
  const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;
  if(Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.5)showPage(page+(dx<0?1:-1));
},{passive:true});
const header=q('.topbar');if(header)header.setAttribute('aria-hidden','true');
q('#phoneReplayIntro')?.addEventListener('click',()=>q('#replayBtn')?.click());
function refreshLockedApp(){
  const t=q('[data-mini="secret"] .phone-app-icon');
  const p=q('#osProgress')?.textContent||'';
  const n=Number((p.match(/^\d+/)||['0'])[0]);
  if(t){t.textContent=n>=7?'🗝️':'🔒';t.classList.toggle('phone-secret-icon-unlocked',n>=7)}
  const link=q('[data-mini="secret"] .phone-app-name');if(link)link.textContent=n>=7?'Secret Open!':'Secret Room';
}
const progress=q('#osProgress');
if(progress&&typeof MutationObserver!=='undefined')new MutationObserver(refreshLockedApp).observe(progress,{childList:true,characterData:true,subtree:true});
refreshLockedApp();
showPage(0);
})();