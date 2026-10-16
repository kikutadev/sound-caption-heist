import {cue,audioEnabled,toggleAudio} from "./audio.js";

/**
 * 紙芝居用の操作実験。プレイヤーの入力、観測結果、次の行動をその場で結ぶ。
 * Stage02以降の本編NPCや物理シミュレーションを実装したものではない。
 */
const states=new Map();
const scenarios={
 1:{title:"足音の字幕は、誰に見える？",desc:"本物の足音は動かない。文字を動かすと、警備員の視線が変わる。",sound:"コツコツ",spots:[["hidden","塀の死角"],["crate","木箱のそば"],["lamp","街灯の下"]]},
 3:{title:"音はあるのに、字幕がない",desc:"同じ街の記録を比較しよう。調べたい欄へ『音』を移してみる。",sound:"コツ、コツ",spots:[["oldzone","旧区画／公開表示"],["raw","旧区画／原音記録"],["livezone","表通り／公開表示"]]},
 4:{title:"昨夜のミオが選んだ表示先",desc:"昨日の音は地下で鳴った。どこへ表示したら、地上の人が気づく？",sound:"カン！",spots:[["oldzone","地下の原位置"],["house","表通りの空き家"],["dark","暗い裏路地"]]},
 5:{title:"誰が、見えない声を知る？",desc:"知らせ方で人の動きも、次に鳴る音も変わる。どちらも救出の可能性がある。",sound:"カン！",spots:[["unsafe","崩れた扉"],["public","通りの人々へ"],["guard","巡回員の手元へ"]]}
};
const afterSpots=[["unsafe","崩れた扉"],["witness","確認できる場所"]];
const htmlEscape=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

/** 実際の情報差分とNPCの判断を状態に反映し、単なる正解文字列だけにしない。 */
function choose(act,st,key,onComplete){
 st.error=false;
 if(act===1){
  st.success=key!=="hidden";st.shifted=st.success;
  st.message=key==="hidden"?"巡回員には見えない。「字幕を動かしたのに何も起きない！」とトトが首をかしげる。":key==="crate"?"巡回員が木箱の音字幕を見て、荷物を確認しに行った。路地の入口が空いた。":"巡回員は街灯の下を調べに行った。実音の場所はそのままなのに、警備の向きだけ変わった。";
  st.trace=st.success?["字幕を移した","巡回員が見た","警備位置が変化"]:["字幕を移した","死角で見えない","反応なし"];
  cue("foot");
 }else if(act===3){
  st.seen??=[];
  if(!st.seen.includes(key))st.seen.push(key);
  st.success=st.seen.includes("raw")&&st.seen.includes("oldzone");
  st.message=key==="oldzone"?"旧区画の公共字幕：表示なし。奥から聞こえる『コツ、コツ』は、ここには一文字も現れない。":key==="raw"?"旧区画の原音ログ：波形あり、音源位置あり。『人がいない』は実音の記録と一致しない。":"表通りの公共字幕：同じ足音が、普通に文字になっている。塔そのものは壊れていない。";
  st.trace=st.seen.map(v=>v==="oldzone"?"旧区画：公開なし":v==="raw"?"原音：あり":"表通り：公開あり");
  if(st.success)st.message+=" ミオ「故障じゃない……選んで表示してる！」";
  cue("sign");
 }else if(act===4){
  st.success=key==="house";st.shifted=st.success;st.error=!st.success;
  st.message=key==="oldzone"?"音は地下で鳴るが、登録外なので地上に字幕が出ない。昨日のSOSはここからでは見つけられない。":key==="dark"?"暗がりに動かしても通行人からは見えない。実際の人へ届くことが必要だ。":"表通りの空き家の壁なら『カン！』が見える。巡回員が異変に気づき地下を調べ始めた。昨夜のミオはSOSを消したのではなく、見える場所へ届けた！";
  st.trace=st.success?["地下の原音は本物","空き家で公開された","巡回員が気づいた"]:["本当のSOS","見せる先が悪い","気づかれない"];
  cue("sign");
 }else if(act===5){
  if(st.phase==="ready"){
   if(key==="unsafe"){
    st.error=true;st.message="巡回員は隔壁の崩れを見て止まった。危険な扉を無理やり開くことはしない。";st.trace=["字幕で通知","危険確認","安全な経路を再検討"];return;
   }
   st.route=key;st.phase="sound";st.success=false;
   st.sound=key==="public"?"ガラガラ！":"ギギッ！";
   st.message=key==="public"?"通りに見せたSOSで人が集まる。巡回員が安全柵を外し、実際に『ガラガラ！』と鳴った。**新しい字幕をもう一度動かせる。**":"巡回員へ静かに届けたSOSから、エマと協力して金具を点検。『ギギッ！』という実音が新しく生まれた。**新しい字幕をもう一度動かせる。**";
   st.trace=["一手目：SOSを見せた",key==="public"?"現場に市民が集まる":"巡回員が安全確認",st.sound+" が鳴る"];
   cue(key==="public"?"cart":"metal");
  }else if(st.phase==="sound"){
   if(key==="unsafe"){
    st.error=true;st.message="新しい音字幕が危険な扉に出ている。人は現物を見て立ち止まった。置き直せる。";st.trace.push("危険な位置で停止");return;
   }
   st.phase="complete";st.success=true;
   st.trace.push("二手目：新字幕を移す","三人が地上に戻る");
   st.message=st.route==="public"?"通行人も原音の証拠と三人の救出を目撃した。地図の『無人』を疑う人が増えた。":"現場で巡回員が三人を確認。静かに救出できたが、市民への説明はこれからになる。";
   cue("step");
   onComplete?.(st.route,st.sound);
  }
 }
}
/** マウス／タッチでのドラッグとボタン入力を同一の判定へ接続する。 */
function renderPuzzle(act,root,st,onComplete){
 const scene=scenarios[act];
 const spots=act===5&&st.phase!=="ready"?afterSpots:scene.spots;
 const sound=act===5&&st.sound?st.sound:scene.sound;
 root.innerHTML='<section class="toy"><header><button class="toy-audio" type="button" data-audio aria-pressed="'+audioEnabled()+'">'+(audioEnabled()?"音 ON":"音 OFF")+'</button><span>YOUR TURN · '+act+'</span><h3>'+htmlEscape(scene.title)+'</h3><p>'+htmlEscape(scene.desc)+'</p></header>'+
  '<div class="toy-map mystery-map" data-act="'+act+'" data-phase="'+st.phase+'">'+
  '<div class="toy-source">実音：'+(act===5&&st.sound?(st.route==="public"?"安全柵":"点検金具"):"地下の発生地点")+'</div>'+
  '<div class="toy-actor '+(st.shifted?"shifted":"")+'">'+(act===3?"保守員":act===4?"巡回員":"巡回員")+'</div>'+
  '<div class="toy-crew '+(st.success&&act===5?"shifted":"")+'">'+(act===5?"救助班":"目撃者")+'</div>'+
  spots.map(([key,label],i)=>'<button type="button" class="toy-target mystery-target mystery-position-'+i+'" data-to="'+key+'"><b>'+htmlEscape(label)+'</b><small>'+(key==="unsafe"?"危険・要確認":key==="oldzone"?"非表示の可能性あり":"証拠を調べる")+'</small></button>').join("")+
  '<button id="toy-chip" type="button" class="toy-chip">'+htmlEscape(sound)+'<small>つかんで移す</small></button>'+
  '<div class="mystery-visual '+(st.success?"active":"")+'">'+(act===5?(st.phase==="complete"?"三人が帰還":st.phase==="sound"?"新しい字幕が出現":"助けを呼ぼう"):act===3?(st.success?"原音あり／公開なし":"原音と公開を比較"):act===4?(st.success?"ミオの目的が判明":"表示先を確かめる"):"人の視線を動かす")+'</div>'+
  '</div><div class="toy-actions">'+(act===5&&st.phase==="complete"?'<button data-reset type="button">別の知らせ方を試す ↻</button>':spots.map(([key,label])=>'<button data-choice="'+key+'" type="button">'+htmlEscape(label)+'</button>').join(""))+'</div>'+
  '<p class="toy-result '+(st.error?"toy-error":"")+'" role="status" aria-live="polite">'+htmlEscape(st.message??"字幕を動かすか、調べる場所を選ぼう。")+'</p>'+
  '<div class="toy-steps">'+(st.trace??[]).map(t=>'<span>'+htmlEscape(t)+'</span>').join('<b>→</b>')+'</div></section>';
 const select=key=>{choose(act,st,key,onComplete);renderPuzzle(act,root,st,onComplete);};
 root.querySelectorAll("[data-choice]").forEach(button=>button.addEventListener("click",()=>select(button.dataset.choice)));
 root.querySelector("[data-reset]")?.addEventListener("click",()=>{
  Object.assign(st,{phase:"ready",route:null,sound:null,success:false,shifted:false,error:false,trace:[],message:"次は誰に届けよう？"});
  onComplete?.(null,null);
  renderPuzzle(act,root,st,onComplete);
 });
 root.querySelector("[data-audio]")?.addEventListener("click",()=>{toggleAudio();renderPuzzle(act,root,st,onComplete);});
 const token=root.querySelector("#toy-chip"),map=root.querySelector(".toy-map");let dragged=null;
 token.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;dragged={id:e.pointerId,x:e.clientX,y:e.clientY};token.setPointerCapture(e.pointerId);token.classList.add("dragging");});
 token.addEventListener("pointermove",e=>{if(dragged&&e.pointerId===dragged.id)token.style.transform="translate("+(e.clientX-dragged.x)+"px,"+(e.clientY-dragged.y)+"px)";});
 token.addEventListener("pointerup",e=>{
  if(!dragged||e.pointerId!==dragged.id)return;
  dragged=null;token.classList.remove("dragging");token.style.transform="";
  const found=[...map.querySelectorAll("[data-to]")].find(b=>{const r=b.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});
  if(found)select(found.dataset.to);
 });
 token.addEventListener("pointercancel",()=>{dragged=null;token.classList.remove("dragging");token.style.transform="";});
}
/** 三度叩いて初めて二打が返ることを実入力で確かめさせる。 */
function renderKnock(root,st){
 root.innerHTML='<section class="toy"><header><button type="button" data-audio class="toy-audio" aria-pressed="'+audioEnabled()+'">'+(audioEnabled()?"音 ON":"音 OFF")+'</button><span>YOUR TURN · 02</span><h3>三打で、誰が返事をする？</h3><p>昨日のミオが動かしたのは、誰のSOSだった？</p></header><div class="knock-field"><span class="pipe-art" aria-hidden="true"></span><strong>'+(st.answered?"コン、コン！":Array.from({length:3},(_,i)=>i<st.count?"●":"○").join(" "))+'</strong><button id="knock-once" type="button">'+(st.answered?"もう一度試す":"管を一回叩く")+'</button></div><div class="toy-actions"><button id="knock-three" type="button">三打を一度に鳴らす</button></div><p class="toy-result" role="status" aria-live="polite">'+(st.answered?"奥から二打。トト「母ちゃんだ！」　ミオ「本物の返事……昨日の私も聞いた？」":"まだ返事はない。あと何回叩こう？")+'</p></section>';
 const knock=n=>{
  if(st.answered){st.count=0;st.answered=false;}
  cue(n===3?"knockTriple":"knock");
  st.count+=n;
  if(st.count>=3){st.count=3;st.answered=true;cue("reply");}
  renderKnock(root,st);
 };
 root.querySelector("#knock-once").addEventListener("click",()=>knock(1));
 root.querySelector("#knock-three").addEventListener("click",()=>knock(3));
 root.querySelector("[data-audio]").addEventListener("click",()=>{toggleAudio();renderKnock(root,st);});
}
/** 各幕の試作を表示し、ページを往復してもプレイヤーの証拠と選択を保持する。 */
export function mountToy(act,root,onComplete){
 const st=states.get(act)??(act===2?{count:0,answered:false}:{phase:"ready",success:false,trace:[]});
 states.set(act,st);
 if(act===2)renderKnock(root,st);
 else if(scenarios[act])renderPuzzle(act,root,st,onComplete);
}
export function toyState(act){
 const s=states.get(act);
 return s?{success:Boolean(s.success??s.answered),phase:s.phase??"knock",route:s.route??null,sound:s.sound??null,count:s.count??null,trace:[...(s.trace??[])]}:null;
}
