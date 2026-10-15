import {cue,audioEnabled,toggleAudio} from "./audio.js";
/** Interactive demonstrations of the story's sound-caption rules. Not the shipped NPC/physics engine. */
const state=new Map();
const escape=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const boards={
1:{title:"字幕を動かして、警備員をどかす",sound:"コツコツ",targets:[["hidden","塀の死角"],["crate","木箱"],["lamp","街灯"]]},
3:{title:"最初の「カン！」を運べ",sound:"カン！",targets:[["collapse","音の真下"],["stairs","安全な階段"],["ladder","点検用の梯子"]]},
4:{title:"字幕を動かして、新しい音を作れ",sound:"コトン！",targets:[["old","崩れた空き家"],["workshop","工房"],["canal","水路"]]}
};
const secondTargets=[["old","危険な空き家"],["crew","交代員の前"]];

/** Change one player's choice into an on-screen NPC reaction and a new state. */
function resolve(act,st,key,onComplete){
 st.error=false;
 if(act===1){
  st.success=key!=="hidden";st.actor=st.success;
  st.message=key==="hidden"?"塀の死角。警備員には字幕が見えない。トト「そこじゃ何も起きない！」":key==="crate"?"巡回員が木箱を調べに行った。正門が空いた！ トト「今だ！」":"巡回員が街灯を確認する。裏道が通れる！ ミオ「本物の足音は動いてないのにね。」";
  st.steps=st.success?["字幕を移動","巡回員が判断","通れる道が変わる"]:["字幕を移動","見えない","反応なし"];
 }else if(act===3){
  st.success=key!=="collapse";st.actor=st.success;
  st.error=!st.success;
  st.message=key==="collapse"?"救助隊員が崩れた床を見て止まった。ミオ「正しい音の場所でも、ここからは入れない。」":key==="stairs"?"階段を確かめた救助員が下りていく。トト「字が示したのは音じゃなく、道だ！」":"別の安全な梯子からも入れた！ 手書きの札は人を命令せず、入口を知らせた。";
  st.steps=st.success?["札を動かす","現物を確認","救助員が進む"]:["札を動かす","床が崩れている","引き返す"];
 }else if(act===4){
  if(st.phase==="ready"){
   if(key==="old"){st.error=true;st.message="交代員が崩れた床を見て止まる。やり直そう。";st.steps=["字幕を移動","現物を確認","通れない"];return;}
   st.route=key;st.phase="produced";st.actor=true;st.success=false;
   st.sound=key==="workshop"?"ガラガラ！":"ギギッ！";
   st.steps=["字幕を移す",key==="workshop"?"巡回員が荷車を動かす":"エマが金具を外す","実際の音が発生"];
   st.message=(key==="workshop"?"巡回員が荷車を動かして":"エマが錆びた金具を外して")+st.sound+" という音が鳴った！　新しい字幕をもう一度動かせる。";
  }else if(st.phase==="produced"){
   if(key==="old"){st.error=true;st.message="新しい字幕が崩れた空き家に。新人は床を見て止まった。今なら動かし直せる。";st.steps.push("危険で停止");return;}
   st.phase="finished";st.success=true;st.steps.push("新字幕を再配置","交代員が現地を確認","全員通過");
   st.message=st.route==="workshop"?"交代員が荷車のどいた工房を確認し、三人とも通った！":"交代員が手すりを確かめ、三人とも水路から通った！";
   onComplete?.(st.route,st.sound);
  }
 }
}

/** Build a spatial board where both pointer movement and buttons perform the same action. */
function draw(act,root,st,onComplete){
 const cfg=boards[act],targetList=act===4&&st.phase!=="ready"?secondTargets:cfg.targets;
 const note=st.message??"気になる場所へ音字幕を移してみよう。";
 const locations=targetList.map(([key,label],i)=>'<button type="button" class="toy-target toy-'+key+'" data-to="'+key+'"><b>'+label+'</b><small>'+((key==="old"||key==="collapse")?"壊れていて危険":key==="hidden"?"死角":key==="crew"?"次に見せる相手":"現地確認できる")+'</small></button>').join("");
 const chip=act===4&&st.sound?st.sound:cfg.sound;
 const prop=act===4?'<div aria-hidden="true" class="toy-prop cart '+(st.route==="workshop"&&st.phase!=="ready"?"activated":"")+'">荷車</div><div aria-hidden="true" class="toy-prop canal '+(st.route==="canal"&&st.phase!=="ready"?"activated":"")+'">金具</div>':act===1?'<div aria-hidden="true" class="toy-gate '+(st.success?"opened":"")+'">通行門</div>':'<div aria-hidden="true" class="toy-gate '+(st.success?"opened":"")+'">崩れた床</div>';
 root.innerHTML='<section class="toy"><header><button type="button" data-audio class="toy-audio" aria-pressed="'+audioEnabled()+'">'+(audioEnabled()?"音 ON":"音 OFF")+'</button><span>YOUR TURN · '+act+'</span><h3>'+cfg.title+'</h3><p>'+(act===4?"人が現物を動かすと、新しい字幕が生まれる。":act===3?"昔の救助場面。何処へ置けば、救助員は進める？":"実際の足音はそのまま。文字だけ動かせる。")+'</p></header><div class="toy-map" data-act="'+act+'" data-state="'+escape(st.phase||"ready")+'"><div class="toy-source">実音の発生場所</div><div class="toy-actor '+(st.actor?"shifted":"")+'">'+(act===4&&st.route==="canal"?"エマ":act===3?"救助員":"巡回員")+'</div><div class="toy-crew '+(st.success&&act===4?"shifted":"")+'">交代員</div>'+locations+prop+'<button id="toy-chip" type="button" class="toy-chip">'+escape(chip)+'<small>つかんで移す</small></button></div><div class="toy-actions">'+(st.phase==="finished"?'<button data-reset type="button">違う道でも試す ↻</button>':targetList.map(([key,label])=>'<button data-choice="'+key+'" type="button">'+label+'へ移動</button>').join(""))+'</div><p class="toy-result '+(st.error?"toy-error":"")+'" role="status" aria-live="polite">'+escape(note)+'</p><div class="toy-steps">'+(st.steps??[]).map(s=>'<span>'+escape(s)+'</span>').join('<b>→</b>')+'</div></section>';
 const choose=key=>{
  const previous=st.phase;
  resolve(act,st,key,onComplete);
  cue(act===4&&previous==="ready"&&st.phase==="produced"?(st.route==="workshop"?"cart":"metal"):act===1?"foot":act===3?"sign":"step");
  draw(act,root,st,onComplete);
 };
 root.querySelector("[data-audio]")?.addEventListener("click",()=>{toggleAudio();draw(act,root,st,onComplete);});
 root.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>choose(b.dataset.choice)));
 root.querySelector("[data-reset]")?.addEventListener("click",()=>{Object.assign(st,{phase:"ready",sound:null,route:null,success:false,error:false,actor:false,steps:[],message:"新しい道を試そう。"});onComplete?.(null,null);draw(act,root,st,onComplete);});
 const token=root.querySelector("#toy-chip"),map=root.querySelector(".toy-map");let held=null;
 token.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;held={id:e.pointerId,x:e.clientX,y:e.clientY};token.setPointerCapture(e.pointerId);token.classList.add("dragging");});
 token.addEventListener("pointermove",e=>{if(held&&e.pointerId===held.id)token.style.transform="translate("+(e.clientX-held.x)+"px,"+(e.clientY-held.y)+"px)";});
 token.addEventListener("pointerup",e=>{if(!held||e.pointerId!==held.id)return;held=null;token.classList.remove("dragging");token.style.transform="";const target=[...map.querySelectorAll("[data-to]")].find(b=>{const r=b.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});if(target)choose(target.dataset.to);});
 token.addEventListener("pointercancel",()=>{held=null;token.classList.remove("dragging");token.style.transform="";});
}
/** Stage-two knocks are the player's action; two replies are not automatic before the third knock. */
function renderKnock(root,st){
 root.innerHTML='<section class="toy"><header><button type="button" data-audio class="toy-audio" aria-pressed="'+audioEnabled()+'">'+(audioEnabled()?"音 ON":"音 OFF")+'</button><span>YOUR TURN · 02</span><h3>三打を鳴らして、返事を待とう</h3><p>地下の管を叩いてみよう。三回目に誰かが返す。</p></header><div class="knock-field"><span class="pipe-art" aria-hidden="true"></span><strong>'+(st.answered?"コン、コン！":Array.from({length:3},(_,i)=>i<st.count?"●":"○").join(" "))+'</strong><button type="button" id="knock-once">'+(st.answered?"もう一度":"管を一回叩く")+'</button></div><div class="toy-actions"><button type="button" id="knock-three">三回まとめて叩く</button></div><p class="toy-result" role="status" aria-live="polite">'+(st.answered?"二回だけ返事！　トト「母ちゃんの癖だ！」　ミオ「大声で言ってみな。」":"まだ返事はない。")+'</p></section>';
 const knock=n=>{
  if(st.answered){st.answered=false;st.count=0;}
  cue(n===3?"knockTriple":"knock");
  st.count+=n;
  if(st.count>=3){st.count=3;st.answered=true;cue("reply");}
  renderKnock(root,st);
 };
 root.querySelector("[data-audio]")?.addEventListener("click",()=>{toggleAudio();renderKnock(root,st);});
 root.querySelector("#knock-once").addEventListener("click",()=>knock(1));
 root.querySelector("#knock-three").addEventListener("click",()=>knock(3));
}
/** Mount a playable demonstration inside its act and preserve state across pages. */
export function mountToy(act,root,onComplete){
 if(![1,2,3,4].includes(act))return;
 const st=state.get(act)??(act===2?{count:0,answered:false}:{phase:"ready",success:false,steps:[]});
 state.set(act,st);
 if(act===2)renderKnock(root,st);else draw(act,root,st,onComplete);
}
/** Expose observable results for real-browser acceptance tests. */
export function toyState(act){
 const st=state.get(act);
 return st?{success:Boolean(st.success??st.answered),phase:st.phase??"knock",sound:st.sound??null,route:st.route??null,count:st.count??null,steps:[...(st.steps??[])]}:null;
}
