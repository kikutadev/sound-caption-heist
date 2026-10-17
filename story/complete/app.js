import{world,scenes}from"./scenes.js";
const $=id=>document.getElementById(id);const esc=x=>String(x).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const state={index:0,max:0,choices:{},market:null,discovery:false,investigation:{rail:false,pot:false,answer:null},rhythm:null,bond:null,ending:false};
const sandboxIndex=scenes.findIndex(s=>s.kind==="sandbox");
const artWords={shop:"ガシャン！",home:"カン カン カン",alley:"コトン",bell:"カーン",market:"カーン",workshop:"カーン",bridge:"コトン",gate:"カン",finale:"トトン",epilogue:"ガシャン？"};
const palette={shop:["#6e8494","#ac7963"],home:["#273c58","#dca36c"],alley:["#283f50","#7b9d9d"],bell:["#788f91","#cba16f"],market:["#64878e","#cf995b"],workshop:["#475d61","#a98460"],bridge:["#4c6b7c","#b8a082"],gate:["#293e55","#b79f7d"],finale:["#344b67","#c99d77"],epilogue:["#819598","#b8895e"]};
function artSvg(s){
 const key=s.art, finale=key==="finale", night=key==="home"||finale;
 const scenePalette=night?["#19344e","#51647e","#e9ba85"]:key==="workshop"?["#8eb3b7","#d4b99a","#efc893"]:["#9cc9d1","#d4bea0","#f4d49c"];
 const [sky,stone,light]=scenePalette;
 const defs='<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="'+sky+'"/><stop offset="1" stop-color="'+stone+'"/></linearGradient><linearGradient id="river" x2="0" y2="1"><stop stop-color="#496c86"/><stop offset="1" stop-color="#243e57"/></linearGradient><radialGradient id="halo"><stop stop-color="#ffe9b9" stop-opacity=".65"/><stop offset="1" stop-color="#ffe9b9" stop-opacity="0"/></radialGradient></defs>';
 const lights=night?'<g fill="#f8d49d" opacity=".95"><circle cx="81" cy="48" r="2"/><circle cx="205" cy="72" r="2"/><circle cx="326" cy="46" r="1.5"/><circle cx="692" cy="62" r="2"/><circle cx="871" cy="43" r="1.8"/></g>':'<circle cx="770" cy="66" r="37" fill="#fff2c7" opacity=".8"/><circle cx="770" cy="66" r="82" fill="url(#halo)"/>';
 const person=(x,y,shirt,scale=1)=>'<g transform="translate('+x+' '+y+') scale('+scale+')"><ellipse cy="43" rx="29" ry="10" fill="#20384a" opacity=".18"/><path d="M-23 33Q-26 -10 0 -12Q28 -10 23 33" fill="'+shirt+'"/><rect x="-14" y="27" width="12" height="18" rx="4" fill="#3c4d59"/><rect x="4" y="27" width="12" height="18" rx="4" fill="#3c4d59"/><circle cy="-22" r="19" fill="#f3cfaa"/><path d="M-21 -24Q-13 -52 4 -45Q24 -46 21 -24Q3 -38 -21 -24" fill="#394757"/></g>';
 const sound=(word,x,y,sz=52)=>'<g class="glowword"><ellipse cx="'+x+'" cy="'+y+'" rx="'+(word.length*sz*.58)+'" ry="39" fill="url(#halo)" opacity=".75"/><text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+sz+'" font-weight="900" font-family="sans-serif" stroke="#4c5969" stroke-width="4" paint-order="stroke" fill="#fff0c4">'+esc(word)+'</text></g>';
 const village='<path d="M0 260V161L125 114L265 165V260" fill="#5d808d"/><path d="M282 260V144L430 82L579 146V260" fill="#8aa4a2"/><path d="M612 260V161L767 103L960 172V260" fill="#678896"/><path d="M0 273H960" stroke="#d3ba99" stroke-width="11"/><g fill="#f9d49e"><rect x="80" y="183" width="69" height="63" rx="5"/><rect x="396" y="159" width="68" height="74" rx="6"/><rect x="765" y="184" width="70" height="62" rx="4"/></g>';
 let view='';
 if(key==="shop"){
  view='<rect x="0" y="0" width="960" height="440" fill="#f1ddbd"/><path d="M0 0H960V100H0Z" fill="#bd8d67"/><g fill="#775f4e"><rect x="48" y="107" width="248" height="228" rx="9"/><rect x="672" y="110" width="240" height="235" rx="9"/></g><g fill="#f0bd71"><ellipse cx="111" cy="194" rx="45" ry="18"/><ellipse cx="233" cy="194" rx="43" ry="18"/><ellipse cx="735" cy="193" rx="42" ry="20"/><ellipse cx="841" cy="193" rx="41" ry="18"/></g><rect x="0" y="361" width="960" height="79" fill="#bc8d69"/><rect x="298" y="285" width="357" height="84" rx="9" fill="#ad7955"/><g fill="none" stroke="#fff1d5" stroke-width="9"><ellipse cx="404" cy="306" rx="38" ry="9"/><ellipse cx="489" cy="311" rx="38" ry="10"/></g>'+person(210,284,"#b86f60",.95)+person(760,284,"#75978d",.94)+sound("ガシャン",510,176,53);
 }else if(key==="home"){
  view='<rect x="0" y="0" width="960" height="440" fill="#253c55"/><path d="M0 84L960 24V440H0Z" fill="#324e66"/><path d="M86 88H364V326H86Z" fill="#526576" stroke="#d8b88c" stroke-width="17"/><path d="M105 110H344V300H105Z" fill="#203d60"/><path d="M222 115V307M103 209H347" stroke="#c9a782" stroke-width="14"/><circle cx="288" cy="174" r="49" fill="#e6d6b3" opacity=".23"/><rect x="426" y="324" width="470" height="43" rx="8" fill="#a97859"/><ellipse cx="674" cy="309" rx="110" ry="33" fill="#d2a077" stroke="#efd3a4" stroke-width="12"/><path d="M608 290Q653 272 726 292" fill="none" stroke="#f5deac" stroke-width="8"/><g stroke="#f5d9b8" stroke-width="6"><path d="M620 289L621 305"/><path d="M661 286L662 305"/><path d="M702 287L702 306"/></g>'+person(457,274,"#bd846e",.8)+sound("カン",262,148,58);
 }else if(key==="market"){
  view=village+'<path d="M0 273H960V440H0Z" fill="#d7b998"/><path d="M0 350L960 290V440H0Z" fill="#b9a18c"/><path d="M655 283V86H824V283" fill="#6f8996" stroke="#f0ca91" stroke-width="16"/><path d="M650 95L741 38L832 95Z" fill="#bc826a"/><ellipse cx="737" cy="145" rx="32" ry="34" fill="#ffdf9f"/><path d="M737 145V125M737 145L751 150" stroke="#506477" stroke-width="6"/><path d="M52 265L143 207L235 265" fill="#df9b76"/><rect x="54" y="270" width="180" height="73" fill="#c68d67"/><path d="M316 263L408 213L505 263" fill="#dfb884"/><rect x="320" y="265" width="190" height="70" fill="#aa8173"/>'+person(289,325,"#b46d63",.72)+person(577,319,"#7fa69a",.7)+sound("カーン",540,141,61);
 }else if(key==="workshop"){
  view='<rect width="960" height="440" fill="#dfc5a5"/><path d="M0 0H960V80H0Z" fill="#866953"/><path d="M660 75H900V300H660Z" fill="#e3d4bd" stroke="#9d795a" stroke-width="13"/><path d="M680 100H879V270H680Z" fill="#91b7bb"/><path d="M780 96V280" stroke="#ae8365" stroke-width="14"/><rect x="110" y="323" width="680" height="55" rx="9" fill="#9b7358"/><rect x="242" y="129" width="324" height="204" rx="9" fill="#efe4ca" stroke="#b18c69" stroke-width="13"/><g stroke="#ad9175" fill="none" stroke-width="5"><path d="M285 208Q363 120 441 212"/><path d="M287 253Q363 167 439 254"/><path d="M301 292Q339 260 373 289"/></g>'+person(127,304,"#6e9a91",.73);
  if(state.choices[state.index]==="old")view+='<path d="M285 208Q363 120 441 212Q475 239 492 206" fill="none" stroke="#ffd188" stroke-width="12"/>'+sound("カーン",551,144,38);
  else view+=sound("カーン",516,117,39);
 }else if(key==="finale"){
  view=village.replace('fill="#f9d49e"','fill="#ffdca9"')+'<path d="M0 250H960V440H0Z" fill="url(#river)"/><path d="M0 329Q226 216 476 317T960 296" fill="none" stroke="#e4c49e" stroke-width="28"/><path d="M0 360Q226 248 476 350T960 329" fill="none" stroke="#66859b" stroke-width="21"/><g fill="#f6d9aa" opacity=".46"><path d="M55 389H209"/><path d="M321 408H466"/><path d="M641 385H844"/></g><path d="M747 275V100" stroke="#c4ac91" stroke-width="21"/><path d="M690 156H809" stroke="#c4ac91" stroke-width="14"/>'+person(314,310,"#ac736b",.82)+person(650,302,"#86a6a2",.89)+'<ellipse cx="490" cy="342" rx="82" ry="22" fill="#cc926c" stroke="#f4d5a2" stroke-width="8"/>';
  if(state.investigation.pot)view+=sound("カン",482,238,47);
  else view+=sound("カン",486,184,49);
  if(state.investigation.answer==="pot")view+='<path d="M458 211Q374 137 333 211" fill="none" stroke="#ffe4aa" stroke-width="8"/>';
  if(state.rhythm)view+='<ellipse cx="500" cy="173" rx="127" ry="90" fill="url(#halo)"/>'+sound("トトン",504,151,63);
 }else{
  view='<rect x="0" y="0" width="960" height="440" fill="#f0d7b0"/><path d="M0 0H960V96H0Z" fill="#bc9774"/><path d="M100 84H355V340H100Z" fill="#769499" stroke="#e4c092" stroke-width="18"/><path d="M119 100H336V325H119Z" fill="#b5d4d1"/><path d="M225 105V327M120 210H333" stroke="#cfb18d" stroke-width="13"/><rect x="364" y="304" width="557" height="76" rx="8" fill="#a67f66"/><rect x="598" y="290" width="91" height="26" rx="7" fill="#d9b585"/>'+person(455,291,"#bc7768",.9)+person(806,292,"#83a99f",.79)+sound("ガシャン",493,147,53);
 }
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 440" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+esc(s.title)+'">'+defs+'<rect width="960" height="440" fill="url(#sky)"/>'+lights+view+'</svg>';
}
function available(){const s=scenes[state.index];if(s.kind==="choice")return !!state.choices[state.index];if(s.kind==="sign")return state.choices[state.index]==="old";if(s.kind==="sandbox")return !!state.market&&state.discovery;if(s.kind==="rhythm")return state.investigation.answer==="pot"&&!!state.rhythm&&!!state.bond;return true;}
function render(){
 const i=state.index,s=scenes[i];
 $("act").textContent=s.act;$("chapter").textContent=s.act+" — "+String(i+1).padStart(2,"0");
 $("scene-title").textContent=s.title;
 const transition=i===scenes.findIndex(x=>x.kind==="sign")&&state.market==="early-open"?"朝市を少し早く開いたあと、八時の鐘も鳴り、今朝の『カーン』が生まれた。 ":"";
 const endingBranch=s.kind==="end"?(state.market==="early-open"?"朝市で新しい『ガシャン』が跳ねたとき、立ち止まった客がパンも買っていった。 ":"古い字と、鐘から生まれた新しい『カーン』を見比べた人々が、パン屋へ寄っていった。 "):"";
 const endingBond=s.kind==="end"?(state.bond==="invite"?"トトンはトトが鳴らす新しい音を聞くと鍋のふちへ戻る。 ":"トトンは捕まらないまま、三人の音を追いかけている。 "):"";
 $("story-lead").textContent=transition+endingBranch+endingBond+s.lead;$("art").innerHTML=artSvg(s);
 $("art").setAttribute("aria-label",s.title);
 $("dialogue").innerHTML=s.talk.map(([n,t])=>'<div class="speech"><b>'+esc(n)+'</b><span>'+esc(t)+'</span></div>').join("");
 $("progress-text").textContent=String(i+1).padStart(2,"0")+" / "+scenes.length;
 $("current").textContent=String(i+1).padStart(2,"0")+" / "+scenes.length;
 $("progress-bar").style.width=((i+1)/scenes.length*100)+"%";
 $("scene-tabs").innerHTML=scenes.map((x,j)=>'<button data-i="'+j+'" '+(j===i?'aria-current="step"':'')+' '+(j<state.max?'class="done"':'')+' '+(j>state.max?'disabled':'')+' aria-label="'+(j+1)+'番目の場面を表示">'+(j+1).toString().padStart(2,"0")+'</button>').join("");
 $("scene-tabs").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.index=Number(b.dataset.i);state.ending=false;render();}));
 $("prev").disabled=i===0;$("next").textContent=i===scenes.length-1?"物語の結末を見る →":"次の場面 →";
 $("next").disabled=!available();
 const active=["choice","sign","sandbox","rhythm"].includes(s.kind);
 $("interaction").hidden=!active;
 $("choice-buttons").innerHTML="";$("sandbox-holder").innerHTML="";$("rhythm-holder").innerHTML="";$("result").hidden=false;$("result").className="result";
 if(s.kind==="choice"||s.kind==="sign")renderChoice(s);
 if(s.kind==="sandbox")renderSandbox(s);
 if(s.kind==="rhythm")renderRhythm(s);
 if(!active)$("result").hidden=true;
 $("ending").hidden=!state.ending;
}
function renderChoice(s){
 $("prompt-title").textContent="あなたなら、どう試す？";$("prompt").textContent=s.ask;
 $("choice-buttons").innerHTML=s.options.map(x=>'<button data-option="'+x.id+'" class="'+(state.choices[state.index]===x.id?"selected":"")+'">'+esc(x.label)+'</button>').join("");
 $("choice-buttons").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.choices[state.index]=b.dataset.option;state.ending=false;render();}));
 const picked=s.options.find(x=>x.id===state.choices[state.index]);
 if(s.kind==="sign")$("prompt-title").textContent="古い彫り跡を、音字と重ねる";
 $("result").textContent=picked?.result||"好きな方法を選んでみよう。どちらも物語は続く。";
 if(picked&&available())$("result").classList.add("success");
}
function renderSandbox(s){
 $("prompt-title").textContent="朝市で音字の個性を探そう";$("prompt").textContent=s.ask;
 $("result").textContent=state.discovery?"新旧の音字は、見た目が同じでも好きな音も相手も違う。店主はミオの見世物を気に入った！":state.market==="early-open"?"今朝の『ガシャン』が生まれた。トトに見せてみよう。":state.market==="bell-open"?"今朝の『カーン』が生まれた。トトに見せてみよう。":"古い『カーン』か『コトン』を動かして、朝市を見てみよう。";
 if(state.discovery)$("result").classList.add("success");
 const frame=document.createElement("iframe");frame.id="morning-lab";frame.src="./sandbox.html?embed=1";frame.title="朝市の音字を自由に動かすゲーム";$("sandbox-holder").appendChild(frame);
}
let soundContext=null;
function tap(times,material="wood"){
 try{
  const A=window.AudioContext||window.webkitAudioContext;if(!A)return;soundContext??=new A();
  if(soundContext.state==="suspended")soundContext.resume();
  const start=soundContext.currentTime+.03;
  times.forEach((d,j)=>{const o=soundContext.createOscillator(),g=soundContext.createGain();o.type=material==="rail"?"triangle":"sine";o.frequency.setValueAtTime((material==="rail"?690:material==="pot"?345:420)+j*(material==="rail"?6:32),start+d);g.gain.setValueAtTime(.0001,start+d);g.gain.exponentialRampToValueAtTime(.18,start+d+.015);g.gain.exponentialRampToValueAtTime(.0001,start+d+.19);o.connect(g).connect(soundContext.destination);o.start(start+d);o.stop(start+d+.2)});
 }catch{}
}
function renderRhythm(s){
 $("prompt-title").textContent="今、この場所にしかない音を鳴らす";$("prompt").textContent=s.ask;
 if(!state.investigation.rail||!state.investigation.pot){
  $("prompt-title").textContent="この『カン』、どちらの音を覚えた？";
  $("rhythm-holder").innerHTML='<div class="choices"><button data-test-sound="rail" class="'+(state.investigation.rail?"selected":"")+'">エマが手すりを三回叩く</button><button data-test-sound="pot" class="'+(state.investigation.pot?"selected":"")+'">トトが鍋を三回叩く</button></div>';
  $("rhythm-holder").querySelectorAll("[data-test-sound]").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.testSound;state.investigation[k]=true;state.investigation.answer=null;state.rhythm=null;state.bond=null;tap(k==="rail"?[0,.39,.78]:[0,.18,.36],k);render();}));
  const rail=state.investigation.rail?"エマが手すりを叩く。乾いた『カン、カン、カン』が響くが、古い字は動かない。":"";
  const pot=state.investigation.pot?"トトが鍋の傷にスプーンを当てる。小さな『カン』が三つ鳴った途端、古い字が飛んできて鍋にくっつく。":"";
  $("result").textContent=(rail+" "+pot).trim()||"二人が同じように三回叩く。古い『カン』が気に入っているのはどちらの音だろう？";
  return;
 }
 if(state.investigation.answer!=="pot"){
  $("prompt-title").textContent="古い『カン』が、自分から寄ってきたのは？";
  $("rhythm-holder").innerHTML='<div class="choices"><button data-answer="rail">エマの手すり</button><button data-answer="pot">トトの鍋</button></div>';
  $("rhythm-holder").querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>{
   state.investigation.answer=b.dataset.answer;
   render();
  }));
  $("result").textContent=state.investigation.answer==="rail"?"手すりが鳴っても古い『カン』は石の上にいた。鍋を鳴らしたときはどうだった？":"よく観察してから選ぼう。手すりと鍋では、字の動きが違った。";
  return;
 }
 $("rhythm-holder").innerHTML='<p class="discovery-reveal">トトは鍋の三つの傷を指で触った。古い『カン』が、また鍋のふちで三度光る。「……そっちの音、好きだったのか」。エマは鍋を受け取って、スプーンを一本トトに戻した。「今度は一緒に鳴らそう」。</p><div class="rhythm">'+s.options.map(x=>'<button data-rhythm="'+x.id+'" class="'+(state.rhythm===x.id?"selected":"")+'"><span class="sound">'+esc(x.label)+'</span><small>タップして鳴らす</small></button>').join("")+'</div>';
 $("rhythm-holder").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.rhythm=b.dataset.rhythm;state.bond=null;tap(state.rhythm==="slow"?[0,.55,.8]:[0,.23,.77]);render();}));
 const chosen=s.options.find(x=>x.id===state.rhythm);
 if(!chosen){$("result").textContent="自分でリズムを選んで鳴らそう。まだ音字は生まれていない。";return;}
 $("result").innerHTML=esc(chosen.result)+' <span class="newborn">トトン ✨</span>';
 $("rhythm-holder").insertAdjacentHTML("beforeend",'<div class="newborn-reaction"><p>'+s.postTalk.map(x=>'<strong>'+esc(x[0])+'</strong>「'+esc(x[1])+'」').join("　")+'</p><p><strong>どうする？</strong> 生まれた子はミオの拍手を気に入ったようだ。</p><div class="choices">'+s.bondOptions.map(x=>'<button data-bond="'+x.id+'" class="'+(state.bond===x.id?"selected":"")+'">'+esc(x.label)+'</button>').join("")+'</div></div>');
 $("rhythm-holder").querySelectorAll("[data-bond]").forEach(b=>b.addEventListener("click",()=>{state.bond=b.dataset.bond;render();}));
 const bond=s.bondOptions.find(x=>x.id===state.bond);
 if(bond){$("result").innerHTML+= '<p class="bond-result">'+esc(bond.result)+'</p>';$("result").classList.add("success");}
}

function refreshEnd(){
 $("ending").hidden=false;
 const market=state.market==="early-open"?"店主が思い切りトレイを落とした朝、『ガシャン』が一つ増えた。":"本物の鐘が鳴った朝、『カーン』がもう一つ増えた。";
 const bonded=state.bond==="invite"?"トトは母と新しいリズムを鳴らして『トトン』を呼んだ。":"トトがつかまえようとした『トトン』は、三人の音を聞きに戻ってきた。";
 $("ending-text").textContent=market+" 店主はミオが新しい音字を見せて集めたお客へパンを売り、翌日には仕事を頼んだ。"+bonded+" エマは水門の夜勤を終えてスープを飲み、古い三打の音字と、新しい子がそれぞれ好きな場所で遊んでいる。街は昨日と同じ。それでもミオには、昨日よりずっと賑やかに見えた。";
 $("ending").scrollIntoView({block:"start",behavior:"smooth"});
}
$("prev").addEventListener("click",()=>{if(state.index>0){state.index--;state.ending=false;render();}});
$("next").addEventListener("click",()=>{if(!available())return;if(state.index<scenes.length-1){state.index++;state.max=Math.max(state.max,state.index);state.ending=false;render();}else{state.ending=true;refreshEnd();}});
$("restart").addEventListener("click",()=>{state.index=0;state.max=0;state.choices={};state.market=null;state.discovery=false;state.investigation={rail:false,pot:false,answer:null};state.rhythm=null;state.bond=null;state.ending=false;render();window.scrollTo({top:0,behavior:"smooth"});});
$("world-answer").addEventListener("click",()=>{const n=$("world-notes");n.hidden=!n.hidden;if(!n.hidden){n.innerHTML='<h3>ベルノアの世界の答え</h3>'+world.rules.map(t=>'<p>'+esc(t)+'</p>').join("")} });
function syncLab(data){
 if(state.index!==sandboxIndex)return;
 if(data?.type==="sound-complete-height"){const h=Number(data.height);const frame=$("morning-lab");if(frame&&Number.isFinite(h)&&h>=420&&h<5000)frame.style.height=Math.ceil(h+2)+"px";}
 if(data?.type==="sound-complete-state"){
  state.market=data.market==="bell-open"||data.market==="early-open"?data.market:null;state.discovery=data.discovery==="done";
  $("next").disabled=!available();
  $("result").textContent=state.discovery?"新旧の音字の違いが見えた！　ミオの見世物を店主も気に入った。":state.market==="early-open"?"生まれたての『ガシャン』をトトに見せよう。":state.market==="bell-open"?"今朝の『カーン』をトトに見せよう。":"まず古い音字を動かしてみよう。";
  $("result").classList.toggle("success",state.discovery);
 }
}
window.__soundCompleteUpdate=syncLab;
window.addEventListener("message",e=>{if(e.origin!==location.origin)return;if(e.source===$("morning-lab")?.contentWindow)syncLab(e.data)});
window.__completeSnapshot=()=>({scene:state.index+1,total:scenes.length,maxReached:state.max+1,choices:{...state.choices},market:state.market,discovery:state.discovery,investigation:{...state.investigation},rhythm:state.rhythm,bond:state.bond,canAdvance:available(),ending:state.ending});
render();
