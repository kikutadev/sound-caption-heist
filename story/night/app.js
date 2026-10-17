import {scenes,world} from "./scenes.js";
const $=id=>document.getElementById(id),esc=t=>String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const state={i:0,max:0,chosen:{},ended:false,attempts:{},speech:{},relay:[]};
function speaker(label){const colors={ミオ:"#b7846f",トト:"#819db4",リタ:"#7e9f82",鐘屋:"#b19a68",通行人:"#947f74"};return colors[label]||"#81949b"}
function figure(x,y,color,scale=1){return '<g transform="translate('+x+' '+y+') scale('+scale+')"><ellipse cx="0" cy="62" rx="34" ry="11" fill="#162a35" opacity=".23"/><path d="M-22 -4Q0 -20 22 -4L24 47L-24 47Z" fill="'+color+'"/><path d="M-13 42L-15 61M13 42L15 61" stroke="#44566a" stroke-width="10"/><circle cy="-20" r="18" fill="#e9c29d"/><path d="M-22 -22Q-9 -53 12 -43Q27 -35 19 -23Q-2 -36 -22 -22" fill="#39495b"/></g>'}
function wing(x,y,scale=1){return '<g transform="translate('+x+' '+y+') scale('+scale+')" fill="#16273a" stroke="#394c5a" stroke-width="4"><path d="M0 30Q-120 -100 -344 9Q-198 3 -116 86Q-88 97 -44 62Q-15 61 0 78Q15 61 44 62Q88 97 116 86Q198 3 344 9Q120 -100 0 30Z"/><path d="M-28 37Q0 10 28 37L0 106Z" fill="#243c4b"/><circle cx="-15" cy="45" r="5" fill="#ead39b"/><circle cx="15" cy="45" r="5" fill="#ead39b"/></g>'}
function art(scene){
 const s=scene.id,night=scene.period==="night",day=scene.period==="day",palette=night?["#1a2c45","#405773","#f5c78b"]:day?["#a9cdd3","#d5bda3","#a18c7f"]:["#726f8e","#caab9c","#efc18e"];
 const [sky,stone,light]=palette;
 let bg='<rect width="1000" height="480" fill="'+sky+'"/><path d="M0 318L100 220L236 278V370H0ZM245 368V235L381 188L501 252V370ZM503 367V227L650 198L790 261V370ZM795 367V237L933 199L1000 246V370Z" fill="'+(night?"#3b5164":"#8fa8ab")+'"/><path d="M0 372L1000 372" stroke="#ddc09d" stroke-width="13"/><g fill="'+light+'"><rect x="93" y="288" width="58" height="62" rx="5"/><rect x="348" y="273" width="64" height="62" rx="5"/><rect x="681" y="283" width="60" height="61" rx="5"/><rect x="882" y="293" width="47" height="48" rx="5"/></g>';
 if(night)bg+='<g fill="#ebd6ae"><circle cx="80" cy="42" r="2"/><circle cx="210" cy="69" r="2"/><circle cx="577" cy="49" r="2"/><circle cx="829" cy="67" r="2"/></g>';
 if(day)bg+='<circle cx="875" cy="68" r="46" fill="#fff0c8"/>';
 let fore='<path d="M0 372L1000 372V480H0Z" fill="'+(day?"#bea68c":"#536c79")+'"/><path d="M0 440L1000 413" stroke="#e5c8a1" stroke-width="9" opacity=".5"/>';
 if(["silhouette","secret","plan","flight"].includes(s)) {
  fore='<path d="M0 354Q225 323 420 372T1000 352V480H0Z" fill="#37546c"/><path d="M0 400Q250 352 483 406T1000 390" fill="none" stroke="#7395a2" stroke-width="9" opacity=".5"/><path d="M0 348H1000" stroke="#d1b799" stroke-width="24"/><path d="M63 338V232H276V336" fill="none" stroke="#957f74" stroke-width="29"/><path d="M303 336V220H512V336" fill="none" stroke="#c6a487" stroke-width="19"/>';
 }
 if(s==="lost")fore+='<path d="M0 320L225 320L225 100L0 100Z" fill="#6b7782"/><path d="M40 319V162Q140 84 202 162V319" fill="#30435b" stroke="#c4a68b" stroke-width="20"/><path d="M80 160L156 160" stroke="#f2d1a4" stroke-width="10"/>'+figure(652,356,"#ba7968",1.15)+figure(827,353,"#839e9a",.9)+'<path d="M545 154L769 154L751 195L557 195Z" fill="#d6b093" stroke="#745f54" stroke-width="9"/>';
 if(s==="street")fore+='<path d="M70 275H295V375H70Z" fill="#b79b8c"/><path d="M60 273L180 220L308 273Z" fill="#d7b18e"/><path d="M462 260H720V369H462Z" fill="#876d68"/><path d="M453 258L585 202L735 258Z" fill="#d3a786"/>'+figure(747,362,"#84a5a2",.78)+figure(381,373,"#bd827a",.93)+'<g fill="#fce5b0" opacity=".6"><text x="120" y="310" font-size="37">コツ</text><text x="515" y="320" font-size="31">ガタン</text></g>';
 if(s==="silhouette")fore+=wing(512,149,1.03)+figure(230,332,"#b27b69",.78)+figure(350,341,"#849f9b",.7)+'<path d="M0 334H420" stroke="#b19a83" stroke-width="15"/>';
 if(s==="secret")fore+='<path d="M0 318Q265 128 529 318" fill="none" stroke="#c7ac8c" stroke-width="33"/><path d="M0 312Q265 158 529 312" fill="none" stroke="#516476" stroke-width="22"/>'+figure(274,330,"#88a38a",.98)+figure(494,330,"#b87a6a",.8)+'<rect x="187" y="330" width="250" height="45" rx="9" fill="#735c55"/>';
 if(s==="plan")fore+='<path d="M0 327H1000" stroke="#af9579" stroke-width="24"/><path d="M345 330V201H509V330" fill="#455b6a" stroke="#d3b396" stroke-width="15"/>'+figure(283,338,"#b17d69",.84)+figure(599,330,"#819b98",.93)+wing(state.relay.length===2?950:state.relay.length===1?869:720,137,state.relay.length===2?.38:state.relay.length===1?.51:.7);
 if(s==="flight")fore+=wing(state.chosen.flight==="farbank"?925:700,145,state.chosen.flight==="farbank"?.54:.93)+figure(236,332,"#bc796f",.9)+figure(359,332,"#7d9f87",.88)+'<path d="M0 320H450" stroke="#a58e7c" stroke-width="22"/>';
 if(s==="dawn")fore+='<path d="M100 299H329V379H100Z" fill="#aa9179"/><path d="M83 294L217 236L341 294Z" fill="#d2aa85"/>'+figure(582,345,"#b8816a",1)+figure(732,357,"#789ea1",.8)+figure(884,344,"#8aa083",.92);
 return '<svg viewBox="0 0 1000 480" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(scene.title)+'">'+bg+fore+'</svg>';
}
const targets=[{x:16,y:40},{x:70,y:40}],source={x:46,y:68};
function stage(scene){
 const current=state.chosen[scene.id],win=scene.options.find(x=>x.id===current);
 $("visual").innerHTML='<div class="scene-image">'+art(scene)+'</div><span class="source-label" style="left:43%;top:81%">音が鳴った場所</span><span class="sound-token" id="sound-token" style="left:'+source.x+'%;top:'+source.y+'%">'+esc(scene.sound)+'</span>'+scene.options.slice(0,2).map((o,i)=>'<button class="visual-target" data-drop="'+o.id+'" style="left:'+targets[i].x+'%;top:'+targets[i].y+'%">'+esc(o.label)+'</button>').join("");
 const token=$("sound-token"),v=$("visual");let active=null;
 token.addEventListener("pointerdown",e=>{active=e.pointerId;token.setPointerCapture(e.pointerId);e.preventDefault()});
 token.addEventListener("pointermove",e=>{if(e.pointerId!==active)return;const b=v.getBoundingClientRect();token.style.left=Math.max(5,Math.min(85,(e.clientX-b.left)/b.width*100))+"%";token.style.top=Math.max(5,Math.min(80,(e.clientY-b.top)/b.height*100))+"%"});
 token.addEventListener("pointerup",e=>{if(active!==e.pointerId)return;active=null;const rect=token.getBoundingClientRect();let placed=null,lowest=Infinity;for(const t of v.querySelectorAll("[data-drop]")){const b=t.getBoundingClientRect(),dist=Math.hypot((b.left+b.width/2)-(rect.left+rect.width/2),(b.top+b.height/2)-(rect.top+rect.height/2));if(dist<lowest){lowest=dist;placed=t.dataset.drop}}if(lowest<Math.max(110,v.clientWidth*.19))choose(placed);else{$("feedback").textContent="そこへ置いてみた。まだ誰も反応しない。人が見る位置を試そう。"}});
 v.querySelectorAll("[data-drop]").forEach(b=>b.addEventListener("click",()=>choose(b.dataset.drop)));
 if(win&&(scene.id!=="plan"||state.relay.length>=2)){token.style.left=(targets[Math.max(0,scene.options.findIndex(x=>x.id===current))].x+7)+"%";token.style.top="31%";}
}
function choose(id){const s=scenes[state.i];if(s.id==="plan"&&state.relay.length<2)state.relay.push(id);state.chosen[s.id]=id;state.attempts[s.id]=(state.attempts[s.id]||0)+1;render()}
function canAdvance(){const s=scenes[state.i];return !!state.chosen[s.id] && (s.id!=="plan"||state.relay.length>=2) && (s.id!=="flight"||s.options.find(x=>x.id===state.chosen.flight)?.win===true);}
function render(){
 const s=scenes[state.i];$("act").textContent=s.act+" / "+s.place;$("title").textContent=s.title;$("lead").textContent=s.narrative;$("time").textContent=s.period==="day"?"昼":s.period==="dusk"?"夕方":"夜";$("location").textContent=s.place;
 const talkNo=Math.min(state.speech[s.id]||0,s.lines.length-1);
 const [talker,speech]=s.lines[talkNo];
 $("dialogues").innerHTML='<div class="dialogue dialogue-current" aria-live="polite"><strong style="color:'+speaker(talker)+'">'+esc(talker)+'</strong><span>'+esc(speech)+'</span></div><div class="dialogue-tools"><small>会話 '+(talkNo+1)+' / '+s.lines.length+'</small><button id="next-dialogue" type="button">'+(talkNo===s.lines.length-1?'会話を最初から見る':'次のセリフ →')+'</button></div>';
 $("next-dialogue").addEventListener("click",()=>{state.speech[s.id]=(talkNo+1)%s.lines.length;render()});
 $("question").textContent=s.prompt+(s.id==="plan"?"（"+Math.min(2,state.relay.length+1)+"つ目の音字）":"");$("indicator").textContent=String(state.i+1).padStart(2,"0")+" / "+String(scenes.length).padStart(2,"0");
 $("chapters").innerHTML=scenes.map((x,i)=>'<button data-scene="'+i+'" '+(state.i===i?'aria-current="step"':'')+' '+(i>state.max?'disabled':'')+'>'+x.act+" "+esc(x.title)+'</button>').join("");
 $("chapters").querySelectorAll("[data-scene]").forEach(b=>b.addEventListener("click",()=>{state.i=+b.dataset.scene;state.ended=false;render()}));
 $("interact-ui").innerHTML='<div class="choices">'+s.options.map(o=>'<button data-choice="'+o.id+'" class="'+(state.chosen[s.id]===o.id?"chosen":"")+'">'+esc(o.label)+'</button>').join("")+'</div>';
 $("interact-ui").querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>choose(b.dataset.choice)));
 stage(s);const answer=s.options.find(x=>x.id===state.chosen[s.id]);$("feedback").textContent= s.id==="plan"&&state.relay.length===1?"鳥が文字へ向きを変えた。鐘屋が二つ目の『カン』を鳴らした。もう一文字を下流へ運ぼう。":answer?.result||"文字を動かしてみよう。試すだけなら何度でも変えられます。";
 $("forward").disabled=!canAdvance();$("back").disabled=state.i===0;$("forward").textContent=state.i===scenes.length-1?"おしまいを見る →":"次の場面へ →";
 $("end").hidden=!state.ended;
}
$("back").addEventListener("click",()=>{if(state.i>0){state.i--;state.ended=false;render()}});
$("forward").addEventListener("click",()=>{if(!canAdvance())return;if(state.i<scenes.length-1){state.i++;state.max=Math.max(state.i,state.max);state.ended=false;render()}else{state.ended=true;$("end").hidden=false;$("epilogue").textContent=(state.chosen.plan==="shore"?"川岸の灯りをたどって":"水門の屋根をたどって")+"鳥は町を離れた。"+scenes.at(-1).options[0].result;$("end").scrollIntoView({block:"start",behavior:"smooth"})}});
$("again").addEventListener("click",()=>{state.i=0;state.max=0;state.chosen={};state.attempts={};state.speech={};state.relay=[];state.ended=false;render();window.scrollTo({top:0,behavior:"smooth"})});
window.__paperState=()=>({scene:state.i+1,total:scenes.length,canAdvance:canAdvance(),choices:{...state.chosen},ended:state.ended,attempts:{...state.attempts},relay:[...state.relay]});
render();