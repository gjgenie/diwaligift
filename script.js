(function(){
  'use strict';
  var doc=document.documentElement;
  doc.classList.add('js');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- countdown ---------- */
  var OPEN=Date.UTC(2026,9,31,8,30,0);      /* 31 Oct 2026 14:00 IST */
  var CLOSE=Date.UTC(2026,10,11,18,29,59);  /* 11 Nov 2026 23:59:59 IST */
  var cd=document.getElementById('cd'),ch=document.getElementById('ch'),
      cm=document.getElementById('cm'),cs=document.getElementById('cs'),
      lbl=document.getElementById('countLbl'),box=document.getElementById('count');
  function pad(n){return n<10?'0'+n:''+n}
  function tickClock(){
    var now=Date.now(),target,text;
    if(now<OPEN){target=OPEN;text='Opens in';}
    else if(now<CLOSE){target=CLOSE;text='Closes in';}
    else{box.classList.add('closed');return;}
    var d=target-now;
    cd.textContent=pad(Math.floor(d/864e5));
    ch.textContent=pad(Math.floor(d%864e5/36e5));
    cm.textContent=pad(Math.floor(d%36e5/6e4));
    cs.textContent=pad(Math.floor(d%6e4/1e3));
    lbl.textContent=text;
    setTimeout(tickClock,1000-(now%1000));
  }
  tickClock();

  /* ---------- embers ---------- */
  var embers=document.getElementById('embers');
  if(embers&&!reduced){
    for(var i=0;i<20;i++){
      var e=document.createElement('span');
      e.className='ember';
      e.style.setProperty('--x',(Math.random()*100)+'%');
      e.style.setProperty('--dur',(7+Math.random()*7)+'s');
      e.style.setProperty('--del',(Math.random()*9)+'s');
      embers.appendChild(e);
    }
  }

  /* ---------- toran garlands ---------- */
  var FLOWER='<svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="11" fill="#e06d1f"/><circle cx="15" cy="15" r="7.5" fill="#ff9d3c"/><circle cx="15" cy="15" r="4" fill="#ffd98a"/><g fill="#e06d1f"><circle cx="15" cy="3.4" r="2.6"/><circle cx="23.2" cy="6.8" r="2.6"/><circle cx="26.6" cy="15" r="2.6"/><circle cx="23.2" cy="23.2" r="2.6"/><circle cx="15" cy="26.6" r="2.6"/><circle cx="6.8" cy="23.2" r="2.6"/><circle cx="3.4" cy="15" r="2.6"/><circle cx="6.8" cy="6.8" r="2.6"/></g></svg>';
  var LEAF='<svg width="16" height="26" viewBox="0 0 16 26"><path d="M8 0 C14 8 15 16 8 26 C1 16 2 8 8 0 Z" fill="#2f9e58"/><line x1="8" y1="3" x2="8" y2="23" stroke="#1d6b3a" stroke-width="1.2"/></svg>';
  document.querySelectorAll('.toran').forEach(function(t){
    var html='';
    for(var i=0;i<26;i++){
      var isF=i%2===0;
      html+='<i class="'+(isF?'t-f':'t-l')+'" style="--del:'+((i%7)*0.35)+'s">'+(isF?FLOWER:LEAF)+'</i>';
    }
    t.innerHTML=html;
  });

  /* ---------- scroll reveals ---------- */
  var revealEls=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('is-in');io.unobserve(en.target);}
      });
    },{threshold:.18,rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){io.observe(el)});
  }else{
    doc.classList.add('no-io');
    revealEls.forEach(function(el){el.classList.add('is-in')});
  }

  /* ---------- header shadow ---------- */
  var head=document.getElementById('siteHead');
  function onScroll(){head.classList.toggle('scrolled',window.scrollY>8)}
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  /* ---------- canvas: stars + fireworks ---------- */
  var canvas=document.getElementById('fx');
  if(canvas&&!reduced&&canvas.getContext){
    var ctx=canvas.getContext('2d'),W=0,H=0,DPR=Math.min(window.devicePixelRatio||1,1.75);
    var stars=[],parts=[],frame=0,raf=null,hidden=false;
    function resize(){
      W=canvas.width=Math.floor(innerWidth*DPR);
      H=canvas.height=Math.floor(innerHeight*DPR);
      canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
      stars=[];
      for(var i=0;i<70;i++){
        stars.push({x:Math.random()*W,y:Math.random()*H*.8,r:(Math.random()*1.3+.4)*DPR,
                    ph:Math.random()*6.28,sp:.01+Math.random()*.025});
      }
    }
    function burst(){
      var bx=W*(.08+Math.random()*.84),by=H*(.12+Math.random()*.38);
      var hues=[44,32,338,168,52],hue=hues[Math.floor(Math.random()*hues.length)];
      var n=30+Math.floor(Math.random()*14);
      for(var i=0;i<n;i++){
        var a=Math.random()*6.283,sp=(1.1+Math.random()*2.6)*DPR;
        parts.push({x:bx,y:by,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,
                    life:55+Math.random()*35,max:90,hue:hue+Math.random()*18-9,
                    sz:(1+Math.random()*1.3)*DPR});
      }
    }
    function loop(){
      frame++;
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<stars.length;i++){
        var s=stars[i],al=.25+.6*Math.abs(Math.sin(s.ph+frame*s.sp));
        ctx.globalAlpha=al;ctx.fillStyle='#ffe9b8';
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.283);ctx.fill();
      }
      if(frame%170===0&&parts.length<160)burst();
      for(var j=parts.length-1;j>=0;j--){
        var p=parts[j];
        p.x+=p.vx;p.y+=p.vy;p.vy+=.028*DPR;p.vx*=.985;p.life--;
        if(p.life<=0){parts.splice(j,1);continue;}
        ctx.globalAlpha=Math.max(p.life/p.max,0);
        ctx.fillStyle='hsl('+p.hue+' 95% 68%)';
        ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,6.283);ctx.fill();
      }
      ctx.globalAlpha=1;
      raf=requestAnimationFrame(loop);
    }
    resize();
    window.addEventListener('resize',resize);
    document.addEventListener('visibilitychange',function(){
      hidden=document.hidden;
      if(hidden&&raf){cancelAnimationFrame(raf);raf=null;}
      else if(!hidden&&!raf){raf=requestAnimationFrame(loop);}
    });
    raf=requestAnimationFrame(loop);
  }
})();
