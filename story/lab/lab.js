
const canvas=document.getElementById("lab"),ctx=canvas.getContext("2d"),status=document.getElementById("readout");
const W=900,H=450;
let s,dragId=null,last=performance.now(),fx=[];
function reset(){
 s={cartX:155,cartDirection:1,captionX:438,captionY:250,guardX:716,guardState:"patrol",
 workerX:235,workerState:"working",active:false,attached:false,dragging:false,
 crateFallen:false,gateOpen:false,events:[],clock:0,
 note:"字幕をつかみ、荷車の近くか別の場所へ置いてみよう。"};
 fx=[];show();draw();
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function show(){
 status.replaceChildren();const b=document.createElement("strong");b.textContent=s.gateOpen?"通路が開きました！　":"現在の様子： ";
 const span=document.createElement("span");span.textContent=s.note;status.append(b,span);
}
function pos(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
function down(e){
 const p=pos(e);if(Math.hypot(p.x-s.captionX,p.y-s.captionY)>85)return;
 dragId=e.pointerId;s.dragging=true;s.attached=false;s.note="字幕を移動中。荷車でも、別の場所でもOK。";
 canvas.setPointerCapture(e.pointerId);s.captionX=clamp(p.x,80,820);s.captionY=clamp(p.y,110,365);show();e.preventDefault();
}
function move(e){
 if(dragId!==e.pointerId||!s.dragging)return;
 const p=pos(e);s.captionX=clamp(p.x,80,820);s.captionY=clamp(p.y,110,365);e.preventDefault();
}
function up(e){
 if(dragId!==e.pointerId)return;s.dragging=false;dragId=null;
 const near=Math.hypot(s.captionX-s.cartX,s.captionY-315)<105;
 s.attached=near;s.active=true;
 if(near){s.captionX=s.cartX;s.captionY=278;s.note="貼り付き成功！ 荷車と一緒に文字が走り、見張りは移動中の文字を追います。";s.events.push("attached");}
 else{s.note="字幕を自由配置。見張りは今見えている文字の場所を確認しに行きます。";s.events.push("placed");}
 show();e.preventDefault();
}
canvas.addEventListener("pointerdown",down);canvas.addEventListener("pointermove",move);
canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",up);
document.getElementById("reset").addEventListener("click",reset);
function update(dt){
 s.clock+=dt;
 if(!s.dragging){
  s.cartX+=s.cartDirection*52*dt;
  if(s.cartX>812){s.cartX=812;s.cartDirection=-1;}
  if(s.cartX<118){s.cartX=118;s.cartDirection=1;}
  if(s.attached){s.captionX=s.cartX;s.captionY=278;}
 }
 if(s.active&&!s.dragging){
  const target=s.captionX;
  if(Math.abs(target-s.guardX)>18){
   s.guardX+=Math.sign(target-s.guardX)*Math.min(110*dt,Math.abs(target-s.guardX)-17);
   s.guardState="investigate";
  }else s.guardState="inspect";
  if(!s.crateFallen&&s.guardX<609){
   s.crateFallen=true;s.events.push("crateFallen");
   fx.push({x:535,y:338,t:"ドサッ！",ttl:4.8});
   s.workerState="inspect";s.note="見張りが箱にぶつかった！『ドサッ！』が発生して、作業員も動き始めました。";show();
  }
  if(!s.gateOpen&&s.guardX<526){
   s.gateOpen=true;s.events.push("gateOpen");
   s.note="字幕で見張りが動き、箱が倒れ、新しい音が生まれ、通路が開きました。";show();
  }
 }
 if(s.workerState==="inspect"&&s.workerX<520)s.workerX+=Math.min(dt*84,520-s.workerX);
 fx=fx.filter(a=>(a.ttl-=dt)>0);
}
function rect(x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);}
function txt(t,x,y,size=20,color="#f0ebdb",weight="700",align="left"){
 ctx.fillStyle=color;ctx.font=weight+" "+size+"px sans-serif";ctx.textAlign=align;ctx.fillText(t,x,y);ctx.textAlign="left";
}
function rr(x,y,w,h,rad,fill,stroke){
 ctx.beginPath();ctx.roundRect(x,y,w,h,rad);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=2;ctx.strokeStyle=stroke;ctx.stroke();}
}
function person(x,y,color,label,hat=false){
 ctx.fillStyle="#0a1e2999";ctx.beginPath();ctx.ellipse(x,y+10,27,8,0,0,Math.PI*2);ctx.fill();
 rect(x-16,y-57,32,55,color);rect(x-15,y-4,11,14,"#2e3440");rect(x+4,y-4,11,14,"#2e3440");
 ctx.beginPath();ctx.arc(x,y-77,19,0,Math.PI*2);ctx.fillStyle="#ebbb92";ctx.fill();
 rect(x-20,y-95,40,12,hat?"#394f5f":"#72503f");
 rr(x-37,y+13,74,25,7,"#183641ed","#77919b");txt(label,x,y+31,13,"#f5dcaa","700","center");
}
function draw(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#365d69");g.addColorStop(.72,"#53767a");g.addColorStop(1,"#3c5962");rect(0,0,W,H,g);
 for(let i=0;i<12;i++){const x=i*80-5;rect(x,77+(i*17)%34,65,201,"#3c5961");rect(x+12,110+(i*17)%34,19,42,"#c3b993");rect(x+38,179+(i*17)%34,14,38,"#bac9a4");}
 rect(0,324,W,126,"#50636c");
 for(let y=329;y<450;y+=24)for(let x=0;x<W;x+=55)rect(x+(y%2)*.3,y,50,2,"#a6b7ad44");
 rect(778,238,104,170,"#243f4b");rr(785,252,86,142,9,s.gateOpen?"#6c9c83":"#8b5d52","#f0cc91");
 txt(s.gateOpen?"OPEN":"CLOSED",829,291,17,"#fff4d9","900","center");txt("通路",827,331,18,"#fdf1cb","700","center");
 if(s.crateFallen){ctx.save();ctx.translate(542,378);ctx.rotate(-.4);rect(-35,-25,70,52,"#b78e61");rect(-29,-18,58,38,"#987149");ctx.restore();}
 else{rect(558,347,83,65,"#b08963");ctx.strokeStyle="#dfb27c";ctx.strokeRect(566,355,66,48);txt("荷箱",600,386,17,"#e8d2ae","700","center");}
 rect(s.cartX-54,341,110,39,"#99775c");rect(s.cartX-43,332,87,16,"#c49e70");
 for(const x of [s.cartX-34,s.cartX+34]){ctx.beginPath();ctx.arc(x,387,17,0,Math.PI*2);ctx.fillStyle="#34434d";ctx.fill();ctx.strokeStyle="#e3bb83";ctx.lineWidth=4;ctx.stroke();}
 txt("荷車",s.cartX,359,17,"#fbe3b6","700","center");
 person(s.workerX,345,"#71958a",s.workerState==="inspect"?"作業員 →":"作業員");
 person(s.guardX,338,"#98685c","巡回員",true);
 if(s.active){
  ctx.strokeStyle="#ffdf9999";ctx.setLineDash([7,9]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(s.guardX,225);ctx.lineTo(s.captionX,s.captionY+17);ctx.stroke();ctx.setLineDash([]);
 }
 for(const p of fx){rr(p.x-65,p.y-108,130,42,13,"#f8e2b6","#b99360");txt(p.t,p.x,p.y-78,21,"#274953","900","center");}
 rr(s.captionX-76,s.captionY-27,152,55,14,s.dragging?"#fff0c8":"#f2ddb3",s.attached?"#79d6bf":"#d3b47b");
 txt("ガラガラ",s.captionX,s.captionY+8,23,"#234452","900","center");
 if(s.attached)txt("貼り付き中",s.captionX,s.captionY-40,13,"#c9f6d6","800","center");
 if(!s.active)txt("↑ これをドラッグ",s.captionX,s.captionY-47,17,"#f7e6b8","800","center");
 rr(12,12,392,53,9,"#123440da","#6e9396");
 txt(s.gateOpen?"成功：見張りを動かして通路が開いた":s.active?"見張りの動きが変わった！":"音字を動かすと、街はどう変わる？",28,45,17,"#f2dfb7");
 txt("操作実験（本編未実装）",20,424,12,"#d0e6e8");
}
function frame(t){const dt=Math.min(.05,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(frame);}
reset();requestAnimationFrame(frame);
Object.defineProperty(window,"__captionLabSnapshot",{value:()=>({
 active:s.active,attached:s.attached,dragging:s.dragging,cartX:Math.round(s.cartX),captionX:Math.round(s.captionX),
 guardX:Math.round(s.guardX),guardState:s.guardState,crateFallen:s.crateFallen,workerState:s.workerState,gateOpen:s.gateOpen,events:s.events.slice()
})});
