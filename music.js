/* IFA.OS — "Paper Lanterns": original gentle instrumental synthesized with Web Audio.
   No externally hosted music, no third-party track, works offline.
   Browser audio starts only after the visitor interacts with the page. */
(()=>{
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const unlock=$('#phoneUnlock');
  if(!unlock)return;
  const storeKey='ifaos_music_enabled';
  let enabled=true;
  try{enabled=localStorage.getItem(storeKey)!=='0'}catch{}
  let audio=null, master=null, dry=null, echo=null;
  let ticker=null, playing=false, hasInteracted=false, nextTime=0, step=0;
  const bpm=74, beat=60/bpm;
  // Eight original bars; chords, bass note, arpeggio tones, little melody.
  const bars=[
    {ch:[60,64,67,71],bass:48,arp:[72,76,79,83],lead:[79,76]},
    {ch:[59,62,67,71],bass:47,arp:[71,74,79,83],lead:[79,74]},
    {ch:[57,60,64,67],bass:45,arp:[69,72,76,79],lead:[76,72]},
    {ch:[53,57,60,64],bass:41,arp:[69,72,76,79],lead:[76,72]},
    {ch:[62,65,69,72],bass:50,arp:[74,77,81,84],lead:[81,77]},
    {ch:[55,60,62,67],bass:43,arp:[67,72,74,79],lead:[79,74]},
    {ch:[59,62,67,71],bass:40,arp:[71,74,79,83],lead:[79,74]},
    {ch:[53,57,60,64],bass:41,arp:[69,72,76,79],lead:[76,72]}
  ];
  function savePref(){try{localStorage.setItem(storeKey,enabled?'1':'0')}catch{}}
  function attachModalControls(){
    const host=$('.os-dialog-head');
    if(host&&!host.querySelector('[data-music-toggle]')){
      const b=document.createElement('button');
      b.type='button';b.className='music-dialog-button';b.setAttribute('data-music-toggle','');
      b.setAttribute('aria-label','Nyalakan atau matikan musik latar');
      host.insertBefore(b,host.querySelector('button'));
    }
    const controls=$('#modalRoot .window-top .controls');
    if(controls&&!controls.querySelector('[data-music-toggle]')){
      const b=document.createElement('button');
      b.type='button';b.className='music-dialog-button';b.setAttribute('data-music-toggle','');
      b.setAttribute('aria-label','Nyalakan atau matikan musik latar');
      controls.insertBefore(b,controls.lastElementChild);
    }
  }
  attachModalControls();
  function update(){
    $$('.phone-music-toggle, .music-dialog-button').forEach(b=>{
      const compact=b.classList.contains('music-dialog-button');
      const label=!enabled?'Musik mati':playing?'Musik menyala':'Musik siap';
      b.textContent=compact?(enabled?'♫':'♪'):(enabled?'♫ ':'♪ ')+label;
      b.setAttribute('aria-pressed',String(enabled));
      b.setAttribute('aria-label',enabled?'Matikan musik latar':'Nyalakan musik latar');
      b.title=enabled?'Matikan musik':'Nyalakan musik';
    });
  }
  function hz(midi){return 440*Math.pow(2,(midi-69)/12)}
  function tone(midi,when,duration,volume,kind){
    if(!audio||!dry)return;
    const a=audio;
    const osc=a.createOscillator(),gain=a.createGain();
    osc.type=kind==='pad'?'sine':'triangle';
    osc.frequency.setValueAtTime(hz(midi),when);
    if(kind==='pad'){
      gain.gain.setValueAtTime(.0001,when);
      gain.gain.linearRampToValueAtTime(volume,when+.42);
      gain.gain.linearRampToValueAtTime(volume*.68,when+Math.max(.48,duration-.6));
      gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
    }else{
      gain.gain.setValueAtTime(.0001,when);
      gain.gain.linearRampToValueAtTime(volume,when+.018);
      gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
    }
    osc.connect(gain);gain.connect(dry);
    if(echo&&kind!=='pad')gain.connect(echo);
    osc.start(when);osc.stop(when+duration+.08);
    osc.onended=()=>{try{osc.disconnect();gain.disconnect()}catch{}};
  }
  function schedule(){
    if(!audio||!playing||audio.state!=='running')return;
    const horizon=audio.currentTime+1.1;
    while(nextTime<horizon){
      const bar=bars[Math.floor(step/8)%bars.length],pos=step%8;
      if(pos===0){
        bar.ch.forEach((note,i)=>tone(note,nextTime,4*beat-.08,.016+(i===0?.004:0),'pad'));
        tone(bar.bass,nextTime,2.7*beat,.020,'pad');
      }
      const arpOrder=[0,2,1,3,2,1,3,1];
      tone(bar.arp[arpOrder[pos]],nextTime,.72*beat,pos%2?.013:.022,'pluck');
      if(pos===0||pos===4)tone(bar.lead[pos===0?0:1],nextTime,1.4*beat,.023,'lead');
      step++;
      nextTime+=beat/2;
    }
  }
  function stop(){
    if(ticker!==null){clearInterval(ticker);ticker=null}
    playing=false;
    const old=audio,oldMaster=master;
    audio=null;master=null;dry=null;echo=null;
    if(old){
      try{
        const t=old.currentTime;
        oldMaster?.gain.cancelScheduledValues(t);
        oldMaster?.gain.setTargetAtTime(.0001,t,.11);
      }catch{}
      setTimeout(()=>{if(old.state!=='closed')old.close().catch(()=>{})},460);
    }
    update();
  }
  function start(){
    if(!enabled||playing||document.hidden)return;
    const Ctor=window.AudioContext||window.webkitAudioContext;
    if(!Ctor){
      enabled=false;savePref();update();
      return;
    }
    try{
      const a=new Ctor();audio=a;
      const out=a.createGain();master=out;out.gain.value=.0001;out.connect(a.destination);
      const low=a.createBiquadFilter();dry=low;low.type='lowpass';low.frequency.value=2300;low.Q.value=.25;low.connect(out);
      const delay=a.createDelay(.8);echo=delay;delay.delayTime.value=.34;
      const feedback=a.createGain();feedback.gain.value=.17;delay.connect(feedback);feedback.connect(delay);
      const wet=a.createGain();wet.gain.value=.13;delay.connect(wet);wet.connect(out);
      nextTime=a.currentTime+.07;step=0;playing=true;
      out.gain.setTargetAtTime(.48,a.currentTime,.65);
      const ready=a.resume();
      if(ready&&typeof ready.then==='function')ready.then(()=>{
        if(audio===a&&playing){schedule();ticker=setInterval(schedule,220)}
      }).catch(()=>{if(audio===a)stop()});
      else {schedule();ticker=setInterval(schedule,220)}
      update();
    }catch{stop()}
  }
  function toggle(){
    hasInteracted=true;enabled=!enabled;savePref();
    if(enabled)start();else stop();
    update();
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-music-toggle]');
    if(b){e.preventDefault();toggle()}
  });
  unlock.addEventListener('click',()=>{
    hasInteracted=true;
    if(enabled)start();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stop();
    else if(hasInteracted&&enabled)start();
  });
  window.addEventListener('pagehide',stop);
  update();
})();