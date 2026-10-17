if(new URLSearchParams(location.search).has("embed"))document.body.classList.add("embedded");
const $=id=>document.getElementById(id);
const initial=()=>({
 bell:false,baker:"closed",kid:"curious",market:"quiet",discovery:"blocked",order:[],
 glyphs:[{id:1,word:"カーン",x:.47,y:.36,live:false,origin:"昨日の響き",bondedTo:2},{id:2,word:"コトン",x:.31,y:.57,live:false,origin:"古い木箱の音"}],
 people:{baker:{x:.17,y:.70,state:"waiting"},kid:{x:.51,y:.70,state:"working"},keeper:{x:.81,y:.72,state:"waiting"}},
 events:["朝市の鐘はまだ鳴っていない。けれど古い『カーン』だけがふらふら浮かんでいる。"],reaction:"トト「さっきの母ちゃんの字と同じだ。いま音が鳴ってなくても動くんだな」",nextId:3
});
let world=initial(),history=[],selected=1,hintIndex=0;
const folks={baker:{name:"店主",x:.17,y:.70},kid:{name:"トト",x:.51,y:.70},keeper:{name:"鐘番",x:.81,y:.72}};
const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
function spawn(word,x,y,origin){
 if(world.glyphs.some(g=>g.origin===origin))return;
 world.glyphs.push({id:world.nextId++,word,x,y,live:true,origin});
}
function add(msg){world.events.push(msg);world.reaction=msg;if(world.events.length>14)world.events.shift();}
function near(x,y){const all=Object.entries(world.people).map(([key,p])=>({key,d:Math.hypot((x-p.x)*1.15,y-p.y)})).sort((a,b)=>a.d-b.d);return all[0].d<(all[0].key==="baker"?.18:.33)?all[0].key:null;}
function drop(id,x,y){
 const g=world.glyphs.find(g=>g.id===id);if(!g)return;
 history.push(structuredClone(world));selected=id;
 x=cap(x,.04,.96);y=cap(y,.07,.92);
 g.x=x;g.y=y;
 // This particular old word has learned an affinity for one companion.
 // Newly created words have no inherited preference: individual history,
 // not text spelling, drives behavior.
 if(g.bondedTo){
  const friend=world.glyphs.find(other=>other.id===g.bondedTo);
  if(friend&&Math.hypot((x-friend.x)*1.15,y-friend.y)<.40){
   g.chaseFrom={x,y};
   g.x=cap(friend.x+.10,.04,.96);g.y=cap(friend.y-.09,.07,.92);
   add("「カーン」が指からすり抜けて、小さな「コトン」の横でくるり。トトが『そっちがいいのか？』と首をかしげる。");
   x=g.x;y=g.y;
   // The independently moving word can still be spotted where it lands.
   // Its NPC consequences must not vanish merely because it disobeyed.
  }
 }
 const person=near(x,y);
 if(!person){add("文字が宙を漂った。今のところ、誰も気づかない。");render();return;}
 const p=world.people[person];
 p.x=x;p.y=cap(y,.60,.83);
 const word=g.word;
 if(person==="keeper"){
  if(word==="カーン"&&!world.bell){
   p.state="listening";world.order.push("keeper");
   add("鐘番「その字、今朝のじゃないな。お、ちょうど八時だ」。鐘番は自分の時計を見て、いつもどおり鐘のひもを引いた。");
   world.bell=true;
   spawn("カーン",.80,.42,"今朝の本物の鐘");
   world.market="bell-open";
   add("カーン！ 本物の音が響く。古い字の横に、新しい『カーン』が現れた。見た目は同じ。でも新顔は『コトン』を追わない。");
  }else if(word==="コトン"){
   p.state="watching";add("鐘番「昔からいる子だよ。ここの鐘は八時に鳴らすから、焦らなくていい」。");
  }else{
   add("鐘番は『"+word+"』を眺めた。「鳴ったあとの字も、ずっと住みつくからね」");
  }
 }else if(person==="baker"){
  if(world.baker==="closed"&&word==="カーン"){
   p.state="active";world.baker="early";world.market="early-open";world.order.push("baker");
   add("店主「鐘が鳴った？ ……ま、いいか。パンは焼けてる」。店を早く開けようとして、トレイをガタン！と落とす。");
   spawn("ガシャン",.22,.69,"今朝のパン屋のトレイ");
   add("『ガシャン』がぱっと生まれた。初めて聞いた本物の音が、文字になって飛び出す瞬間をミオは見た。");
  }else if(word==="ガシャン"){
   add("店主「その子には皿を割った分の請求書を出したいねえ」。本物の皿は一枚も割れていなかった。");
  }else if(word==="コトン"){
   add("店主「コトンちゃんかい。あの箱の音は、もう何年もしてないねえ」。");
  }else{
   add("店主は『"+word+"』を追ってきた。「あんた、こういう子の扱いは妙に上手いね」");
  }
 }else{
  if((word==="ガシャン"&&world.market==="early-open")||(word==="カーン"&&world.market==="bell-open"&&g.live)){
   world.discovery="done";world.kid="noticing";p.state="amazed";
   if(word==="ガシャン"){
    add("ミオが生まれたての『ガシャン』をトトへ連れていく。トトは、昨日から棚にいた『ガシャン』と比べて目を丸くする。「同じ顔なのに、新顔は俺を見てる！」");
    add("見物人が笑ってパンを買う。店主はミオに次の配達を頼んだ。");
    if(!world.bell){
     world.bell=true;
     spawn("カーン",.80,.42,"今朝の本物の鐘");
     add("やがて八時。鐘番が時計を見て、いつもどおり鐘を鳴らした。石の上には生まれたての『カーン』も現れる。");
    }
   }else{
    add("ミオが生まれたての『カーン』をトトへ連れていく。古い方は『コトン』を追って逃げたのに、新しい方は鐘を振り返っている。トト「同じ字が二人！ しかも性格が違う！」");
    add("見物人が足を止め、店主の焼きたてパンが売れる。「あんた、うちの看板役も頼めそうだね」と店主がミオへ笑った。");
   }
  }else if(word==="カーン"&&!world.bell){
   world.kid="misled";add("トト「本物の鐘、まだ鳴ってないよな？」 ミオが首を振ると、古い『カーン』は『コトン』を探して跳ねた。");
  }else if(word==="コトン"){
   add("トトが『コトン』に手を振る。古い『カーン』があとを追う。「あいつ、めっちゃ好きじゃん」。");
  }else{
   add("トトが『"+word+"』を目で追う。どの子も勝手に好きなところへ行く。");
  }
 }
 render();
}
function render(){
 $("reaction").textContent=world.reaction.length>64?world.reaction.slice(0,61)+"…":world.reaction;
 $("map").dataset.discovery=world.discovery;
 $("discovery-state").textContent=world.discovery==="done"?"新旧の個体差を発見！":"音字のひみつを探そう";
 $("bell-state").textContent=world.bell?"鳴った（本物）":"まだ鳴っていない";
 $("bakery-state").textContent=world.baker==="closed"?"焼きたてパン":world.baker==="early"?"早めの開店":"開店中";
 $("kid-state").textContent={curious:"不思議な音字に夢中",misled:"古い字を観察中",noticing:"新旧の字の違いを発見"}[world.kid]||"楽しんでいる";
 $("actors").innerHTML=Object.entries(world.people).map(([key,p])=>'<div class="npc" data-person="'+key+'" data-state="'+p.state+'" style="left:'+(p.x*100)+'%;top:'+(p.y*100)+'%;--shirt:'+(key==="baker"?"#b77757":key==="keeper"?"#5381a1":"#81a68d")+'"><div class="avatar"></div><strong>'+folks[key].name+'</strong></div>').join("");
 $("glyphs").innerHTML=world.glyphs.map(g=>{
  const dx=g.chaseFrom?(g.chaseFrom.x-g.x)*$("map").clientWidth:0;
  const dy=g.chaseFrom?(g.chaseFrom.y-g.y)*$("map").clientHeight:0;
  return '<button type="button" class="glyph '+(g.live?"live":"")+(g.chaseFrom?" chasing":"")+'" data-glyph="'+g.id+'" aria-label="'+g.word+'をつかんで動かす" style="left:'+(g.x*100)+'%;top:'+(g.y*100)+'%;--chase-x:'+dx+'px;--chase-y:'+dy+'px"><span>'+g.word+'</span><small>'+(g.live?"今の実音":"古い響き")+'</small></button>';
 }).join("");
 world.glyphs.forEach(g=>{delete g.chaseFrom;});
 $("log").innerHTML=world.events.map(e=>"<li>"+e.replaceAll("&","&amp;").replaceAll("<","&lt;")+"</li>").join("");
 $("replay").disabled=history.length===0;
 notifyParent();
 $("glyphs").querySelectorAll(".glyph").forEach(el=>el.addEventListener("pointerdown",startDrag));
}
function startDrag(e){
 if(e.pointerType==="mouse"&&e.button!==0)return;
 e.stopPropagation();selected=Number(e.currentTarget.dataset.glyph);
 const node=e.currentTarget,box=$("map").getBoundingClientRect();
 let moved=false;const startX=e.clientX,startY=e.clientY;
 node.setPointerCapture(e.pointerId);node.classList.add("dragging");
 const move=evt=>{
  if(evt.pointerId!==e.pointerId)return;
  if(Math.hypot(evt.clientX-startX,evt.clientY-startY)>4)moved=true;
  node.style.left=(cap((evt.clientX-box.left)/box.width,.04,.96)*100)+"%";
  node.style.top=(cap((evt.clientY-box.top)/box.height,.07,.92)*100)+"%";
 };
 const done=evt=>{
  if(evt.pointerId!==e.pointerId)return;
  node.removeEventListener("pointermove",move);
  node.removeEventListener("pointerup",done);
  node.removeEventListener("pointercancel",cancel);
  node.classList.remove("dragging");
  if(moved)drop(selected,(evt.clientX-box.left)/box.width,(evt.clientY-box.top)/box.height);else render();
 };
 const cancel=()=>{
  node.removeEventListener("pointermove",move);
  node.removeEventListener("pointerup",done);
  node.removeEventListener("pointercancel",cancel);
  render();
 };
 node.addEventListener("pointermove",move);
 node.addEventListener("pointerup",done);
 node.addEventListener("pointercancel",cancel);
}
$("map").addEventListener("pointerup",e=>{
 // Tap/click the empty ground after selecting a word, for accessibility on touch devices.
 if(e.target.closest(".glyph"))return;
 const r=$("map").getBoundingClientRect();
 drop(selected,(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);
});
$("glyphs").addEventListener("keydown",e=>{
 if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key))return;
 const target=e.target.closest("[data-glyph]");if(!target)return;
 e.preventDefault();selected=Number(target.dataset.glyph);
 const glyph=world.glyphs.find(g=>g.id===selected);const step=.045;
 const dx=e.key==="ArrowLeft"?-step:e.key==="ArrowRight"?step:0;
 const dy=e.key==="ArrowUp"?-step:e.key==="ArrowDown"?step:0;
 drop(glyph.id,glyph.x+dx,glyph.y+dy);
});
function notifyParent(){
 if(window.parent===window)return;
 const origin=location.origin;
 const update={type:"sound-complete-state",market:world.market,bell:world.bell,kid:world.kid,discovery:world.discovery};
 if(typeof window.parent.__soundCompleteUpdate==="function")window.parent.__soundCompleteUpdate(update);
 requestAnimationFrame(()=>window.parent.postMessage({type:"sound-complete-height",height:Math.ceil(document.querySelector(".wrap").getBoundingClientRect().height)},origin));
}
window.addEventListener("load",notifyParent);
$("howto").addEventListener("click",()=>{
 const shown=$("howto").getAttribute("aria-expanded")==="true";
 $("howto").setAttribute("aria-expanded",String(!shown));
 $("howto-detail").hidden=shown;notifyParent();
});
const hints=[
 "古い『カーン』を鐘番かパン屋の近くへ動かしてみよう。うまくいかなければ一手戻してみて。",
 "古い『カーン』は『コトン』のそばに戻る。先に『コトン』を離してみると、違う反応になるよ。",
 "『コトン』を離してから『カーン』をパン屋か鐘番へ。新しい音字が生まれたら、その子をトトに見せてみて。そんなに難しくないよ。"
];
$("hint").addEventListener("click",()=>{
 const target=$("hint-detail");target.hidden=false;
 target.textContent="ヒント "+(Math.min(hintIndex+1,3))+"/3 — "+hints[Math.min(hintIndex,2)];
 hintIndex=Math.min(hintIndex+1,3);
 $("hint").textContent=hintIndex===3?"最後のヒントを表示中":"次のヒントを見る";
 $("hint").disabled=hintIndex===3;notifyParent();
});
$("reset").addEventListener("click",()=>{world=initial();history=[];selected=1;hintIndex=0;$("hint").disabled=false;$("hint").textContent="ヒントを見る";$("hint-detail").hidden=true;render();});
$("replay").addEventListener("click",()=>{if(!history.length)return;world=history.pop();selected=world.glyphs[0]?.id||1;render();});
window.__echoSandboxSnapshot=()=>structuredClone({bell:world.bell,baker:world.baker,kid:world.kid,market:world.market,order:world.order,people:world.people,glyphs:world.glyphs,events:world.events,discovery:world.discovery,undo:history.length,hintIndex,howToExpanded:$("howto").getAttribute("aria-expanded")==="true"});
render();