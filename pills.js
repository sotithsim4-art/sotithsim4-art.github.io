(function(){
  var body=document.body;
  function on(){body.classList.add('pills-on');startRain();}
  if(document.getElementById('matrix-intro')&&!document.getElementById('matrix-intro').classList.contains('leaving')){window.addEventListener('matrix:ready',on,{once:true});}else{on();}
  var started=false;
  function startRain(){
    if(started||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;started=true;
    var chars='01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ'.split('');
    [['pill-rain-l','255,70,90'],['pill-rain-r','70,150,255']].forEach(function(cfg){
      var c=document.getElementById(cfg[0]);if(!c)return;var x=c.getContext('2d');var cols,drops,fs=15;
      function size(){c.width=c.clientWidth;c.height=c.clientHeight;cols=Math.max(1,Math.floor(c.width/fs));drops=[];for(var i=0;i<cols;i++)drops[i]=Math.random()*-40;}
      size();window.addEventListener('resize',size);
      setInterval(function(){
        if(document.hidden||!c.clientWidth)return;
        x.fillStyle='rgba(6,9,15,0.14)';x.fillRect(0,0,c.width,c.height);
        x.font=fs+'px monospace';
        for(var i=0;i<cols;i++){
          x.fillStyle='rgba('+cfg[1]+',0.85)';
          x.fillText(chars[Math.floor(Math.random()*chars.length)],i*fs,drops[i]*fs);
          if(drops[i]*fs>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;
        }
      },70);
    });
  }
})();
