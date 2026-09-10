(function(){
var style = document.createElement('style');
style.textContent = '.butterfly{position:fixed;pointer-events:none;z-index:1;width:25px;height:25px;transform-style:preserve-3d;}.butterfly .wing{position:absolute;width:16px;height:24px;top:0;border-radius:50% 50% 40% 60%;background:linear-gradient(135deg,#f80566,#ff99bb);opacity:0.8;}.butterfly .left-wing{right:12px;transform-origin:right center;animation:flap-left 0.2s infinite ease-in-out alternate;}.butterfly .right-wing{left:12px;transform-origin:left center;animation:flap-right 0.2s infinite ease-in-out alternate;}@keyframes flap-left{from{transform:rotateY(0deg);}to{transform:rotateY(65deg);}}@keyframes flap-right{from{transform:rotateY(0deg);}to{transform:rotateY(-65deg);}}';
document.head.appendChild(style);
function createButterfly(){
    if(document.querySelectorAll('.butterfly').length>6)return;
    const bf=document.createElement('div');
    bf.className='butterfly';
    bf.innerHTML='<div class="wing left-wing"></div><div class="wing right-wing"></div>';
    document.body.appendChild(bf);
    let x=Math.random()*window.innerWidth,y=Math.random()*window.innerHeight;
    let vX=(Math.random()-0.5)*0.8,vY=(Math.random()-0.5)*0.8,animFrame;
    function move(){
        vX+=(Math.random()-0.5)*0.15;vY+=(Math.random()-0.5)*0.15;
        const spd=Math.sqrt(vX**2+vY**2);
        if(spd>1.2){vX=vX/spd*1.2;vY=vY/spd*1.2;}
        x+=vX;y+=vY;
        if(x<=10||x>=window.innerWidth-40)vX*=-1;
        if(y<=10||y>=window.innerHeight-40)vY*=-1;
        bf.style.left=x+'px';bf.style.top=y+'px';
        bf.style.transform=`rotateZ(${Math.atan2(vY,vX)+Math.PI/2}rad) rotateX(20deg)`;
        if(document.body.contains(bf))animFrame=requestAnimationFrame(move);
    }
    move();
    setTimeout(()=>{
        cancelAnimationFrame(animFrame);
        bf.style.opacity='0';bf.style.transition='opacity 4s';
        setTimeout(()=>{if(bf.parentNode)bf.remove();},4000);
    },18000);
}
setInterval(createButterfly,6000);
})();
