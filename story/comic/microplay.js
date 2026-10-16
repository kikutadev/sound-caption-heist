import {cue,audioEnabled,toggleAudio} from "./audio.js";

/** 紙芝居内の小さな操作実験。実ゲームStage02以降の完成AIや物理ではない。 */
const states=new Map();
const scenes={
 1:{title:"音字幕を移すと、人が動く",hint:"実音はそのまま。字を見た巡回員の判断を変えよう。",sound:"コツコツ",spots:[["hidden","塀の死角"],["crate","木箱の前"],["lamp","街灯の下"]]},
 3:{title:"聞こえない。でも文字は届く",hint:"同じ音をこちら側と境界の向こうで比較し、旧中継器も試そう。",sound:"カン！",spots:[["near","こちら側の鐘"],["far","無響帯の向こう"],["relay","旧中継器"]]},
 4:{title:"録音と生きた返事を見分けよう",hint:"三打への定型返事だけでは人間か分からない。別の回数を試そう。",sound:"カン！",spots:[["three","三打で送る"],["four","わざと四打"],["archive","古い自動応答"]]},
 5:{title:"音字幕で連絡路を復旧させる",hint:"見せる先を選び、実物から新しく生まれた音も中継しよう。",sound:"カン！",spots:[["broken","壊れた中継台"],["city","街の鐘楼"],["hill","丘の旧塔"]]}
};
const continuation=[["broken","壊れた中継台"],["next","次の中継点"]];
const esc=x=>String(x).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

/** 字幕の移動で人や中継がどう変わるかを判断し、原因と結果を保持する。 */
function apply(act,st,key,onComplete){
 st.error=false;
 if(act===1){
  st.success=key!=="hidden";st.actor=st.success;
  st.note=key==="hidden"?"死角に文字が浮かんでも巡回員には見えない。別の場所を試せる。":key==="crate"?"巡回員は木箱の字を見て荷物を確かめに行った。路地が空いた。":"巡回員は街灯の足元へ。足音は元の場所なのに、見せた字で判断が変わった。";
  st.trace=st.success?["字幕を動かす","巡回員が見る","調査先が変わる"]:["字幕を動かす","見えない","巡回員は動かない"];
  cue("foot");
 }else if(act===3){
  st.tried??=[];
  if(!st.tried.includes(key))st.tried.push(key);
  const near=st.tried.includes("near"),far=st.tried.includes("far"),relay=st.tried.includes("relay");
  st.success=near&&far&&relay;
  st.actor=relay;
  if(key==="near"){st.note="こちら側の鐘は耳に聞こえる。もちろん『カン！』の字幕も見える。";cue("knock");}
  if(key==="far")st.note="向こうでは鐘が鳴っているのに、この耳には届かない。でも近接装置が振動を拾い『カン！』の字幕がこちらへ来る。";
  if(key==="relay"){st.note="旧中継器に字幕を置くと、向こうの作業員がその字に気づいて、本物の鐘を鳴らした。地図の外の塔に明かり！";cue("metal");}
  if(st.success)st.note+=" これが音字塔の昔の仕事……音が届かない土地へ、文字を届けること。";
  st.trace=st.tried.map(v=>v==="near"?"こちら：音と字幕":v==="far"?"向こう：字幕だけ":"旧塔：応答の灯り");
 }else if(act===4){
  st.tried??=[];
  if(!st.tried.includes(key))st.tried.push(key);
  if(key==="archive"){st.note="古い録音にも『受信しました』。三打だけでは向こうに誰かいるとは言えない。";st.trace=["過去の定型音声を確認"];}
  if(key==="three"){st.note="三打で『受信しました』。同じ文字が返る……これは録音かもしれない。";st.trace.push("三打：定型の二打");cue("knockTriple");}
  if(key==="four"){st.phase="dilemma";st.success=false;st.note="四打で『四回も鳴らすな！ 昼寝してたのに！ そっちは誰？』。人間がいる！ なのにこちらの鐘はほとんど聞こえない。塔を調べよう。";st.trace.push("四打：相手が怒って質問");cue("reply");}
  if(key==="off"){
   st.off=true;st.note="塔を止めた。街外れの鐘が、突然こちらの耳に戻った！ でも遠くの人の字幕は消えた。";
   st.trace.push("塔OFF：近くの鐘が聞こえる／遠くの字幕が消える");cue("knock");
  }
  if(key==="on"){
   st.on=true;st.note="再起動。遠くの町から文字が戻った。でも鐘の音は薄い。この塔は、音を遠くへ字として送る代わりに、周囲の音を弱めていた。";
   st.trace.push("塔ON：遠くの字幕が戻る／近くの音が弱まる");
  }
  st.success=Boolean(st.off&&st.on);
  if(st.success)st.note+=" プレイヤーが両方を実際に試して、世界の静けさの原因が分かった。";
 }else if(act===5){
  if(st.phase==="ready"){
   if(key==="broken"){
    st.error=true;st.note="壊れた中継台を見た作業員は触らずに止まった。安全な別の経路を選べる。";
    st.trace=["壊れた中継台","人が確認して停止"];return;
   }
   st.route=key;st.phase="new-sound";st.success=false;st.actor=true;
   st.sound=key==="city"?"ガラン！":"ギギッ！";
   st.note=key==="city"?"鐘楼の作業員が本物の鐘を鳴らし『ガラン！』が生まれた。高出力にすると街の鐘は聞こえづらくなる。新字幕を次の塔へ！":"丘の旧塔で金具を外し『ギギッ！』が生まれた。短い中継でも送信中の鐘は弱くなる。新字幕を次の塔へ！";
   st.trace=["最初の字幕を移す",key==="city"?"鐘楼で実際に鐘を打つ":"丘の実物金具を動かす",st.sound+" が発生"];
   cue(key==="city"?"cart":"metal");
  }else if(st.phase==="new-sound"){
   if(key==="broken"){st.error=true;st.note="壊れた中継台には誰も近づかない。別の接続点を選ぼう。";st.trace.push("危険のため停止");return;}
   st.phase="linked";st.success=false;
   st.trace.push("新字幕を次の塔へ送信","遠い人から返事");
   st.note=st.route==="city"?"遠い町から『こっちはパンを焦がした！』。広場のみんなが笑った。でも鐘はほとんど聞こえない。送り続けるしかない？":"丘の先で塔が点灯。『受け取った！』と短い返事。遠い人とつながれたが、送信中は近くの金具の音が弱まる。";
   cue("reply");
  }else if(st.phase==="linked"){
   if(key==="continue"){
    st.note="中継を続けると遠い文字は見える。でも近くの鐘はまだ聞こえない。ほかのやり方はない？";st.trace.push("連続送信：鐘の音は弱い");return;
   }
   if(key==="request"){
    st.phase="ack";st.trace.push("こちらから三打で休止を確認");
    st.note="ミオが『いったん休む。次は正午につなぐ。いい？』と話す。プレイヤーがその字幕と三打を中継すると、遠くから『コン、コン！　正午ね！』。相手が次の時間に同意した。";
    cue("knockTriple");cue("reply");
   }
  }else if(st.phase==="ack"){
   if(key==="keep"){
    st.note="もう返事は受け取った。それでも塔を動かしている間は近くの鐘が弱い。";return;
   }
   if(key==="rest"){
    st.phase="complete";st.success=true;
    st.trace.push("二打を確認して休止","街の鐘が戻る！","正午に短く中継を再開する約束");
    st.note=st.route==="city"?"塔を休ませると、広場の鐘が大きく鳴った！　遠い人の『パン焦がした』もみんなで読めた。町のみんなが次の短い中継を引き受けた。":"塔を休ませると、近くの鐘がはっきり聞こえた！　遠い人は次の時間に隣の集落へ合図を送る。街にも遠くにも、返事の順番ができた。";
    cue("bell");cue("step");onComplete?.(st.route,st.sound);
   }
  }
 }
}

/** 字幕を直接ドラッグする操作とボタン操作を、同じ判定に統一する。 */
function renderPuzzle(act,host,st,onComplete){
 const scene=scenes[act],
 spots=act===5?(
   st.phase==="ready"?scene.spots:
   st.phase==="new-sound"?continuation:
   st.phase==="linked"?[["continue","送信を続ける"],["request","三打＋『正午にまた話そう』を送る"]]:
   st.phase==="ack"?[["keep","塔を動かしたまま"],["rest","返事を受け取り、塔を休ませる"]]:[]
 ):act===4&&st.phase==="dilemma"?[["off","塔を停止"],["on","塔を再起動"]]:scene.spots;
 const word=act===5&&st.sound?st.sound:scene.sound;
 host.innerHTML='<section class="toy"><header><button type="button" data-audio class="toy-audio" aria-pressed="'+audioEnabled()+'">'+(audioEnabled()?"音 ON":"音 OFF")+'</button><span>YOUR TURN · '+act+'</span><h3>'+esc(scene.title)+'</h3><p>'+esc(scene.hint)+'</p></header><div class="toy-map mystery-map" data-act="'+act+'" data-phase="'+st.phase+'">'+
  '<div class="toy-source">実音の発生地点はそのまま</div>'+
  '<div class="toy-actor '+(st.actor?"shifted":"")+'">'+(act===4?"トト":act===5?"作業員":"巡回員")+'</div>'+
  '<div class="toy-crew '+(st.success&&act===5?"shifted":"")+'">'+(act===5?"遠い塔":act===3?"中継塔":"見ている人")+'</div>'+
  spots.map(([key,label],i)=>'<button type="button" class="toy-target mystery-target mystery-position-'+i+'" data-to="'+esc(key)+'"><b>'+esc(label)+'</b><small>'+(key==="broken"?"通れない":key==="far"?"耳には届かない":key==="four"?"定型でない入力":"調べる")+'</small></button>').join("")+
  '<button id="toy-chip" type="button" class="toy-chip">'+esc(word)+'<small>つかんで移す</small></button>'+
  '<div class="mystery-visual '+(st.success?"active":"")+'">'+esc(act===5?(st.success?"遠い返事も、街の鐘も！":st.phase==="linked"?"遠方はつながった／近くは静か":st.phase==="ack"?"二打の返事！　休止できる":"どこまで届く？"):act===4&&st.success?"塔は周囲の音を弱めている":act===3&&st.success?"地図の外の塔が点灯":st.note?"何が変わった？":"好きな場所へ動かす")+'</div></div>'+
  (act===5?'<div class="relay-progress" aria-label="中継路の通電状態"><span class="relay-node lit">街</span><span class="relay-wire '+(st.route?"lit":"")+'">→</span><span class="relay-node '+(st.route?"lit":"")+'">'+(st.route==="hill"?"丘の塔":st.route==="city"?"鐘楼":"分岐")+'</span><span class="relay-wire '+(st.phase==="linked"||st.phase==="ack"||st.success?"lit":"")+'">→</span><span class="relay-node '+(st.phase==="linked"||st.phase==="ack"||st.success?"lit":"")+'" >向こうの人</span><span class="relay-local '+(st.success?"audible":"silent")+'">街の鐘：'+(st.success?"はっきり聞こえる":st.route?"音が弱い":"待機中")+'</span></div>':'')+
  '<div class="toy-actions">'+(act===5&&st.phase==="complete"?'<button data-reset type="button">別の経路も試す ↻</button>':spots.map(([key,label])=>'<button data-choice="'+esc(key)+'" type="button">'+esc(label)+'</button>').join(""))+'</div>'+
  '<p class="toy-result '+(st.error?"toy-error":"")+'" role="status" aria-live="polite">'+esc(st.note??"この文字を動かすと、どこで何が起きるだろう？")+'</p>'+
  '<div class="toy-steps">'+(st.trace??[]).map(t=>'<span>'+esc(t)+'</span>').join('<b>→</b>')+'</div></section>';
 const choose=key=>{apply(act,st,key,onComplete);renderPuzzle(act,host,st,onComplete);};
 host.querySelectorAll("[data-choice]").forEach(button=>button.addEventListener("click",()=>choose(button.dataset.choice)));
 host.querySelector("[data-reset]")?.addEventListener("click",()=>{Object.assign(st,{phase:"ready",success:false,actor:false,route:null,sound:null,error:false,trace:[],note:null});onComplete?.(null,null);renderPuzzle(act,host,st,onComplete);});
 host.querySelector("[data-audio]")?.addEventListener("click",()=>{toggleAudio();renderPuzzle(act,host,st,onComplete);});
 const chip=host.querySelector("#toy-chip"),map=host.querySelector(".toy-map");let drag=null;
 chip.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};chip.setPointerCapture(e.pointerId);chip.classList.add("dragging");});
 chip.addEventListener("pointermove",e=>{if(drag&&e.pointerId===drag.id)chip.style.transform="translate("+(e.clientX-drag.x)+"px,"+(e.clientY-drag.y)+"px)";});
 chip.addEventListener("pointerup",e=>{if(!drag||e.pointerId!==drag.id)return;drag=null;chip.classList.remove("dragging");chip.style.transform="";const spot=[...map.querySelectorAll("[data-to]")].find(b=>{const r=b.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});if(spot)choose(spot.dataset.to);});
 chip.addEventListener("pointercancel",()=>{drag=null;chip.classList.remove("dragging");chip.style.transform="";});
}

/** 三打の実入力で、登場人物の二打の返事を鳴らす。 */
function renderKnocks(host,st){
 host.innerHTML='<section class="toy"><header><button data-audio type="button" class="toy-audio" aria-pressed="'+audioEnabled()+'">'+(audioEnabled()?"音 ON":"音 OFF")+'</button><span>YOUR TURN · 02</span><h3>地下の管へ三回、返事を試そう</h3><p>声が届かない側に、本当に人はいる？</p></header>'+
 '<div class="knock-field"><span class="pipe-art" aria-hidden="true"></span><strong>'+(st.answered?"コン、コン！":Array.from({length:3},(_,i)=>i<st.count?"●":"○").join(" "))+'</strong><button id="knock-once" type="button">'+(st.answered?"もう一度三打を試す":"管を一回叩く")+'</button></div>'+
 '<div class="toy-actions"><button id="knock-three" type="button">三回まとめて叩く</button></div>'+
 '<p class="toy-result" role="status" aria-live="polite">'+(st.answered?"コン、コン！ トト「母ちゃんだ！」 音は管を伝わって帰ってきた。":"耳を澄ましても、まだ返事はない。")+'</p></section>';
 const knock=n=>{if(st.answered){st.count=0;st.answered=false;}cue(n===3?"knockTriple":"knock");st.count+=n;if(st.count>=3){st.count=3;st.answered=true;cue("reply");}renderKnocks(host,st);};
 host.querySelector("#knock-once").addEventListener("click",()=>knock(1));
 host.querySelector("#knock-three").addEventListener("click",()=>knock(3));
 host.querySelector("[data-audio]").addEventListener("click",()=>{toggleAudio();renderKnocks(host,st);});
}
/** チャプター移動後も小さな実験の結果を残す。 */
export function mountToy(act,host,onComplete){
 const st=states.get(act)??(act===2?{count:0,answered:false}:{phase:"ready",success:false,trace:[]});
 states.set(act,st);
 if(act===2)renderKnocks(host,st);else if(scenes[act])renderPuzzle(act,host,st,onComplete);
}
/** QAブラウザは画面の操作結果のみを読み取る。 */
export function toyState(act){
 const st=states.get(act);
 return st?{success:Boolean(st.success??st.answered),phase:st.phase??"knock",route:st.route??null,sound:st.sound??null,count:st.count??null,trace:[...(st.trace??[])]}:null;
}