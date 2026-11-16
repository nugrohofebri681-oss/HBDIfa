(function ifaOS(){
  'use strict';
  const one=(s,p=document)=>p.querySelector(s);
  const all=(s,p=document)=>[...p.querySelectorAll(s)];
  const host=one('#ifaOS');
  if(!host)return;
  const modal=document.createElement('div');
  modal.className='os-modal';
  modal.setAttribute('role','presentation');
  modal.innerHTML='<section class="os-dialog" role="dialog" aria-modal="true" aria-labelledby="osModalTitle"><div class="os-dialog-head"><b id="osModalTitle">IFA.OS</b><button type="button" data-os-action="close" aria-label="Tutup">×</button></div><div class="os-dialog-body" id="osModalBody"></div></section>';
  document.body.append(modal);
  const box=one('#osModalBody'),title=one('#osModalTitle');
  const store={get(k,f=''){try{return localStorage.getItem(k)||f}catch{return f}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
  const names={mood:'Mood Check',comfort:'Comfort Mode',laugh:'Laugh Machine',random:'Random Thing',wishlab:'Wish Lab',game:'Game Center',achieve:'Achievements',secret:'Secret Room'};
  const msgs={
    tenang:'Kalau hari ini lagi tenang, semoga rasa damainya bertahan lebih lama yaa, Faa. Nikmati hal kecil yang bikin kamu nyaman. 🌷',
    capek:'Mmm.. capek yaa? Istirahat sebentar boleh kok. Kamu ga harus menyelesaikan semua urusan sekaligus. Pelan-pelan aja yaa.',
    berat:'Kalau hari ini rasanya berat, semoga ada hal kecil yang bikin sedikit lega. Ga harus memaksa diri buat ceria terus kok.',
    biasa:'Hari yang biasa juga boleh jadi hari yang baik. Semoga ada kejutan kecil yang bikin kamu senyum, hehe..',
    senang:'Wahh, lagi senang yaa! Hehe.. semoga hari ini semakin banyak alasan buat tersenyum. Jangan lupa dinikmati!'
  };
  const jokes=[
    'Pengumuman dari sistem: kalau pikiranmu sudah membuka 27 tab sekaligus, boleh kok ditutup satu-satu. Yang penting tab makanan jangan ditutup, wkwk.',
    'Status hari ini: 10% produktif, 40% mikir mau ngapain, 50% pengen rebahan. Tenang, ini hasil penelitian yang sama sekali tidak ilmiah.',
    'OS menemukan satu masalah: kamu belum menerima sertifikat “berhasil menjalani hari ini”. Selamat, sertifikatnya imajiner tapi sah menurut sistem ini!',
    'Kalau ada lomba mengingat hal random saat mau tidur, kayaknya otak manusia bakal dapat medali emas tiap tahun.',
    'Baterai hati lemah? Colok ke charger bernama istirahat, air putih, dan camilan. Charger aslinya belum dijual.',
    'Tombol “skip hari Senin” masih dalam pengembangan. Tim teknis bilang fiturnya ditolak kalender.',
    'Sistem mendeteksi: kamu berhak dapat satu hari di mana semua urusan selesai sendiri. Sayangnya fitur ini masih bug, wkwk.',
    'Ini cuma aplikasi kecil. Tapi kalau kamu senyum satu kali, berarti bug “terlalu serius” berhasil diperbaiki.'
  ];
  const randomNotes=[
    'Semoga kamu menemukan satu hal kecil yang bikin hari ini lebih menyenangkan.',
    'Mmm.. jangan lupa minum air putih yaa. Kadang hal paling sederhana justru suka kelupaan.',
    'Kalau rencana hari ini berubah, ga berarti harinya gagal kok.',
    'Satu pertanyaan random: kalau hari ini dijadikan judul film, kira-kira judulnya apa ya? Hehe..',
    'Semoga kamu punya waktu buat diri sendiri di sela-sela hal yang harus dikerjakan.',
    'Pengingat kecil: merayakan pencapaian sederhana itu juga boleh.',
    'Semoga kenangan yang baik tetap bisa disimpan sebagai hal yang baik, tanpa harus mengulang apa pun.',
    'Buat hari ini: semoga ada hal baik datang tanpa harus dicari terlalu jauh.'
  ];
  const wishes={
    tenang:'Semoga kamu diberi hati yang lebih tenang, hari-hari yang cukup lapang, dan ruang untuk beristirahat.',
    tumbuh:'Semoga langkah-langkah kecilmu bertemu kesempatan baik, dan semua yang kamu usahakan perlahan menemukan jalannya.',
    bahagia:'Semoga kamu lebih sering tertawa, dikelilingi orang-orang baik, dan menemukan kebahagiaan dengan caramu sendiri.'
  };
  let current=null,lastFocus=null,mood=store.get('ifaos_mood',''),calmStep=0,laughIndex=0,randomIndex=0,wishChoice='',gameCards=[],revealed=[],matched=[],busy=false,gameWon=store.get('ifaos_game_won')==='yes';
  let osSeen=[];try{osSeen=JSON.parse(store.get('ifaos_os_seen','[]'));if(!Array.isArray(osSeen))osSeen=[]}catch{osSeen=[]}
  function coreSeen(){try{const a=JSON.parse(store.get('ifaos_seen_modules','[]'));return Array.isArray(a)?a:[]}catch{return []}}
  function count(){return new Set([...coreSeen(),...osSeen]).size}
  function total(){return 14}
  function sync(){
    const n=count();
    const el=one('#osProgress');if(el)el.textContent=n+' / '+total()+' explored';
    const mm=one('#osMood');if(mm)mm.textContent=mood?({tenang:'tenang',capek:'capek',berat:'sedikit berat',biasa:'biasa aja',senang:'senang'}[mood]||mood):'belum dicek';
    const secret=one('#osSecretHint');if(secret)secret.textContent=n>=7?'🗝️ Secret Room unlocked!':'🔒 Secret Room · '+n+'/7 apps explored';
    const clock=one('#osClock');if(clock)clock.textContent=new Intl.DateTimeFormat('id-ID',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  }
  function header(k,t,sub){return '<div class="os-eyebrow">'+k+'</div><h2>'+t+'</h2><p>'+sub+'</p>'}
  function panel(s){return '<div class="os-result">'+s+'</div>'}
  function btn(label,action,val=''){return '<button type="button" class="os-action" data-os-action="'+action+'" data-val="'+val+'">'+label+'</button>'}
  function render(){
    if(!current)return;
    title.textContent=names[current]||'IFA.OS';
    let h='';
    if(current==='mood'){
      const options=[['tenang','🌿','Lagi tenang'],['capek','☁️','Lagi capek'],['berat','🌧️','Sedikit berat'],['biasa','🌙','Biasa aja'],['senang','✨','Lagi senang']];
      h=header('01 / Your little check-in','Gimana harimu, Faa?','Pilih aja yang paling mendekati. Ini cuma untukmu, dan tersimpan di browser yang kamu pakai.')+
        '<div class="os-chip-grid">'+options.map(x=>'<button type="button" data-os-action="mood" data-val="'+x[0]+'">'+x[1]+' '+x[2]+'</button>').join('')+'</div>'+
        (mood?panel('<strong>♡ A little note</strong><p>'+msgs[mood]+'</p>'):'');
    }else if(current==='comfort'){
      h=header('02 / Take it slow','A little comfort','Ga harus buru-buru. Pilih apa yang paling kamu butuhkan sekarang.');
      h+='<div class="os-chip-grid"><button data-os-action="comfort" data-val="words">🫂 Butuh kata-kata baik</button><button data-os-action="comfort" data-val="rest">☁️ Pengen istirahat</button><button data-os-action="comfort" data-val="breathe">🌿 Tarik napas dulu</button><button data-os-action="comfort" data-val="letter">💌 Baca surat</button></div>';
      const mode=store.get('ifaos_comfort_mode','words');
      if(mode==='breathe'){
        h+=panel('<strong>Slow breathing · '+calmStep+'/3</strong><div class="os-breath" aria-hidden="true">breathe</div><p>Ikuti lingkarannya secara perlahan. Kalau sudah melakukan satu putaran, tekan tombol di bawah.</p>'+btn(calmStep>=3?'Mulai lagi':'Satu napas selesai ✓','breath'));
      }else if(mode==='rest')h+=panel('<strong>Boleh istirahat dulu.</strong><p>Coba jauhkan sebentar hal yang bikin penuh kepala. Minum sedikit air, duduk nyaman, dan istirahat yaa..</p>');
      else h+=panel('<strong>Mmm.. buat kamu, Faa.</strong><p>Semoga kamu bisa menghadapi hari yang berat tanpa harus memaksakan diri. Pelan-pelan juga tetap berarti bergerak, kok.</p>');
    }else if(current==='laugh'){
      h=header('03 / The silly corner','Laugh Machine','Versi ringan dan agak random, buat cari senyum kecil, wkwk.');
      h+=panel('<strong>Random message #'+String(laughIndex+1).padStart(2,'0')+'</strong><p>'+jokes[laughIndex]+'</p>')+btn('Yang lain dong ↻','laugh');
    }else if(current==='random'){
      h=header('04 / Unexpected little things','Random Thing','Ga semuanya harus direncanakan. Kadang catatan kecil juga boleh muncul tiba-tiba.');
      h+=panel('<strong>✦ A small reminder</strong><p>'+randomNotes[randomIndex]+'</p>')+btn('Ambil catatan lain ✦','random');
    }else if(current==='wishlab'){
      h=header('05 / Three little wishes','Wish Lab','Pilih satu harapan yang paling kamu butuhkan. Ga ada jawaban benar atau salah.');
      h+='<div class="os-chip-grid"><button data-os-action="wish" data-val="tenang">🕊️ Ketenangan</button><button data-os-action="wish" data-val="tumbuh">🌱 Pertumbuhan</button><button data-os-action="wish" data-val="bahagia">☀️ Kebahagiaan</button></div>';
      if(wishChoice)h+=panel('<strong>For the days ahead.</strong><p>'+wishes[wishChoice]+'</p>');
    }else if(current==='game'){
      h=header('06 / A tiny break','Memory Match','Temukan tiga pasang simbol yang sama. Mini-game kecil tanpa batas waktu.');
      const show=i=>revealed.includes(i)||matched.includes(i);
      h+='<div class="os-game-grid">'+gameCards.map((item,i)=>'<button type="button" class="os-game-card '+(matched.includes(i)?'matched':'')+'" data-os-action="tile" data-val="'+i+'" aria-label="Kartu '+(i+1)+(show(i)?' '+item:' tertutup')+'" '+(matched.includes(i)?'disabled':'')+'>'+(show(i)?item:'✧')+'</button>').join('')+'</div>';
      h+=matched.length===6?panel('<strong>Yeayyy, berhasil! 🎉</strong><p>Semoga setelah ini harimu juga punya banyak kejutan baik yaa, Faa..</p>')+btn('Main lagi ↻','resetGame'):btn('Acak kartu lagi ↻','resetGame');
    }else if(current==='achieve'){
      const core=coreSeen();
      const badges=[
        ['✉️','A Letter Opened',core.includes('letter')],
        ['🎞️','Movie Memory',core.includes('cinema')],
        ['☁️','A Little Pause',osSeen.includes('comfort')],
        ['📦','Keepsake Explorer',core.includes('keepsake')],
        ['🎮','Mini Gamer',gameWon],
        ['✦','Curious Soul',count()>=6]
      ];
      h=header('07 / Small milestones','Achievements','Ini bukan lomba yaa. Cuma jejak kecil dari ruang-ruang yang sudah kamu kunjungi.');
      h+='<div class="os-badge-list">'+badges.map(x=>'<div class="os-badge '+(x[2]?'':'locked')+'"><span class="os-emblem">'+x[0]+'</span><div><b>'+x[1]+'</b><small>'+(x[2]?'Unlocked ✦':'Belum terbuka')+'</small></div></div>').join('')+'</div>';
    }else if(current==='secret'){
      h=count()<7?header('08 / The hidden corner','Secret Room · masih terkunci','Ruang ini ada di halaman aplikasi kedua, jadi kamu ga perlu mencari lokasinya, hehe.')+panel('<strong>🔒 '+count()+' dari 7 aplikasi</strong><p>Jelajahi tujuh aplikasi berbeda dari empat belas yang tersedia, lalu semua kejutan terkunci terbuka otomatis. Ga harus menyelesaikan game atau membaca semua surat.</p>')+btn('Kembali ke home','close'):header('08 / A hidden place','A tiny secret','Yeayyy, kamu sudah membuka ruang kecil yang sengaja kusimpan buat yang penasaran, hehe.')+panel('<strong>Ini bukan teka-teki besar.</strong><p>Terima kasih udah mau menjelajahi hal-hal kecil di sini, Faa. Semoga hadiah sederhana ini bisa jadi salah satu alasan kecil buat tersenyum di ulang tahunmu. 🤍</p>')+btn('Lihat surat utamanya ↗','letter');
    }
    box.innerHTML=h;
  }
  function randomDifferent(n,old){if(n<2)return 0;let j=old;while(j===old)j=Math.floor(Math.random()*n);return j}
  function resetGame(){
    gameCards=['✉️','🎟️','🌷','✉️','🎟️','🌷'];
    for(let i=gameCards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[gameCards[i],gameCards[j]]=[gameCards[j],gameCards[i]]}
    revealed=[];matched=[];busy=false;
  }
  function open(id){
    if(!names[id])return;
    
    if(!modal.classList.contains('visible'))lastFocus=document.activeElement;
    current=id;
    if(!(id==='secret'&&count()<7)&&!osSeen.includes(id)){osSeen.push(id);store.set('ifaos_os_seen',JSON.stringify(osSeen))}
    if(id==='game'&&gameCards.length===0)resetGame();
    render();
    modal.classList.add('visible');
    document.body.style.overflow='hidden';
    const close=one('[data-os-action="close"]',modal);if(close)close.focus({preventScroll:true});
    sync();
  }
  function close(){
    if(!current)return;
    modal.classList.remove('visible');current=null;
    document.body.style.overflow='';
    if(lastFocus&&lastFocus.isConnected&&lastFocus.focus)lastFocus.focus({preventScroll:true});
    sync();
  }
  modal.addEventListener('click',e=>{
    if(e.target===modal){close();return}
    const b=e.target.closest('[data-os-action]');if(!b||busy)return;
    const a=b.dataset.osAction,v=b.dataset.val;
    if(a==='close'){close();return}
    if(a==='mood'){mood=v;store.set('ifaos_mood',v)}
    if(a==='comfort'){if(v==='letter'){close();const l=one('[data-open="letter"]');if(l)l.click();return}store.set('ifaos_comfort_mode',v);calmStep=0}
    if(a==='breath'){calmStep=calmStep>=3?0:calmStep+1}
    if(a==='laugh'){laughIndex=randomDifferent(jokes.length,laughIndex)}
    if(a==='random'){randomIndex=randomDifferent(randomNotes.length,randomIndex)}
    if(a==='wish'){wishChoice=v}
    if(a==='resetGame')resetGame();
    if(a==='letter'){close();const l=one('[data-open="letter"]');if(l)l.click();return}
    if(a==='tile'){
      const i=Number(v);if(matched.includes(i)||revealed.includes(i)||!Number.isInteger(i)||i<0||i>5)return;
      revealed.push(i);
      if(revealed.length===2){
        const [x,y]=revealed;
        if(gameCards[x]===gameCards[y]){
          matched.push(x,y);revealed=[];
          if(matched.length===6){gameWon=true;store.set('ifaos_game_won','yes')}
        }else{
          busy=true;render();
          setTimeout(()=>{revealed=[];busy=false;if(current==='game')render();sync()},750);
          return;
        }
      }
    }
    render();sync();
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-mini]');
    if(b){open(b.dataset.mini);return}
    if(e.target.closest('[data-open]'))setTimeout(sync,70);
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&modal.classList.contains('visible')){e.stopImmediatePropagation();close()}
  },true);
  window.addEventListener('storage',sync);
  setInterval(sync,60000);
  if(!gameCards.length)resetGame();
  sync();
})();