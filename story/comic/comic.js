import {mountToy,toyState} from "./microplay.js";
import {portrait} from "./portraits.js";
/** 音の字幕を「読む」のではなく、人の判断が変わる瞬間を紙芝居として実演する。 */
const chapters=[
 {title:"空き家からの三打",short:"異常",tag:"ACT 01 · THE IMPOSSIBLE SOUND",heading:"誰もいない場所から、<b>助けを呼ぶ音。</b>",
 panels:[
  {type:"street",sfx:"カン、カン……",caption:"閉鎖された旧街区。音は、今夜も同じ場所から聞こえる。",talk:[["トト","ミオ、またあの音だ！　誰かが助けを呼んでる！","urgent"],["ミオ","音字塔の記録では、ここは無人……のはず。","thought"]]},
  {type:"map",caption:"音源の記録は「地下」。しかし、公開される字幕だけが「空き家」へ飛ぶ。",talk:[["トト","音は下なのに、字はあの家!?","surprised"]]},
  {type:"street",sfx:"カン……",caption:"誰が動かした？　何のために？",talk:[["ミオ","全部がずれるなら故障。でも、三打だけだ。","thought"],["トト","考えてる間に、もう一回鳴るかも！","urgent"]]}
 ]},
 {title:"三打への二打",short:"返事",tag:"ACT 02 · AN ANSWER",heading:"三回叩いた。<b>二回、返ってきた。</b>",
 panels:[
  {type:"pipe",sfx:"カン！ カン！ カン！",caption:"トトが配管の前で手を止めた。向こうに誰かいるなら、どう確かめる？",talk:[["トト","……返事してよ。","low"]]},
  {type:"pipe",sfx:"コン、コン！",caption:"自分で三回叩いたあと、管の向こうからたった二回。トトの顔が一変する。",talk:[["トト","二回だ！　母ちゃん、返事が雑な時は二回なんだ！","joy"],["ミオ","その言い方、本人の前でもできる？","dry"]]},
  {type:"rescue",caption:"エマは自分で内側の掛け金を外して待っていた。巡回員が外から開ける。",talk:[["エマ","こっちは平気。……あんた、靴びしょびしょ！","stern"],["トト","助かった人の第一声がそれ!?","joy"]]}
 ]},
 {title:"最初の「カン！」",short:"発見",tag:"ACT 03 · THE FIRST SIGN",heading:"字は、音の場所を<b>教えるだけじゃなかった。</b>",
 panels:[
  {type:"silent",sfx:"コツ……",caption:"字幕が一枚も出ない通路。なのに、巡回員は音の方を正確に向く。",talk:[["トト","字がないのに、当てた!?","surprised"],["ミオ","音はずっと聞こえてた。おかしいのは、あっちの管だね。","thought"]]},
  {type:"reflection",sfx:"カーン……",caption:"昔の拡声管が、音を街の反対側へ運んでしまう。それで人々は方向を見失った。",talk:[["トト","遠くまで聞こえるようにしたら、近くで迷子になったの？","thought"],["ミオ","便利な工事ほど、あとが大変。","dry"]]},
  {type:"firstsign",sfx:"カン！",caption:"昔の救助現場を再現した模型。地下の真上は崩れている。古い「カン！」の札は、まだ動かせる。",talk:[["トト","あの人、真下じゃ入れない。札、動かしたら？","joy"],["ミオ","それ、今の私たちもできるね。","smile"]]}
 ]},
 {title:"字幕を動かせ",short:"決断",tag:"ACT 04 · YOUR MOVE",heading:"ここから先は、<b>あなたが動かす。</b>",
 panels:[
  {type:"map",caption:"昨夜の修理履歴にミオの署名。仮に音源を確かめた直後、点検蓋の事故で倒れ、数時間の記憶を失った。まだ安全な入口を確認できていない。",talk:[["トト","昨日直したの、ミオじゃん！","surprised"],["ミオ","場所は確かめた。でも、人が通れるかは別。……やり残した方を片づけよう。","thought"]]},
  {type:"workshop",sfx:"ガラガラ！／ギギッ！",caption:"荷台をどけるか、錆びた手すりを外すか。人が実物を動かすと、新しい音字幕が生まれる。",talk:[["ミオ","人が動くと、新しい音も生まれる。……さて、どっちを使う？","smile"]]},
  {type:"fork",sfx:"コン、コン！ → カン！ カン！ カン！",caption:"エマが二打で安全を知らせ、トトが三打を返す。だが字幕は再び、崩れた空き家へ。",talk:[["トト","また空き家だ！　この三打、動かせるよ！","urgent"],["ミオ","最後は、あなたが選んで。","smile"]]}
 ]},
 {title:"朝の二打",short:"余韻",tag:"ACT 05 · THE NEXT MORNING",heading:"救難の合図は、<b>いつもの朝の音になる。</b>",
 panels:[
  {type:"morning",sfx:"カン、カン、カン！",caption:"夜が明けた。音字幕の行き先は、プレイヤーが確かめた入口のまま。交代員三人も戻った。",talk:[["ミオ","今朝は、字が空き家に戻ってない。よし。","smile"]]},
  {type:"kitchen",sfx:"コン、コン！",caption:"エマが鍋を三回叩く。トトは反射的に二回返す。",talk:[["エマ","朝ごはんは、口で返事！","stern"],["トト","母ちゃんが三回叩くからでしょ！","joy"]]},
  {type:"kitchen",caption:"危険を知らせた三打も、ちゃんと帰ってきた二打も、今日からは家の音。",talk:[["ミオ","この家は、地図がなくてもうるさいな。","smile"]]}
 ]}
];
const $=id=>document.getElementById(id);
const safe=t=>String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;").replaceAll(">","&gt;");

/** 背景を静止画として再利用しながら、場面ごとに音や人物を前景として強調するSVGを描く。 */
function illustration(type){
 const brick=Array.from({length:11},(_,i)=>'<path d="M0 '+(i*44)+' H960" stroke="#8c8990" stroke-opacity=".11"/>' ).join("");
 const bolts=Array.from({length:11},(_,i)=>'<circle cx="'+(36+i*87)+'" cy="170" r="5" fill="#b2a18a"/>').join("");
 const lamps=Array.from({length:7},(_,i)=>'<g transform="translate('+(88+i*134)+' 97)"><path d="M0 -100v64" stroke="#ad936f" stroke-width="4"/><rect x="-11" y="-38" width="22" height="36" fill="#ffd38e" stroke="#332c30" stroke-width="5"/><circle cy="-24" r="33" fill="#ffd38e" opacity=".07"/></g>').join("");
 const signs='<path d="M280 404Q472 348 666 375" fill="none" stroke="#ffd68d" stroke-width="6" stroke-dasharray="12 12"/><path d="m649 354 27 22-30 18" fill="none" stroke="#ffd68d" stroke-width="6"/>';
 const builders='<path d="M0 480L382 198M960 480L578 198" stroke="#425363" stroke-width="13"/><path d="M382 198H578" stroke="#ba8d65" stroke-width="5"/>';
 const street='<rect width="960" height="530" fill="#18283b"/><path d="M0 0H340L408 480H0ZM960 0H650L572 480H960Z" fill="#2a3c49"/>'+builders+brick+lamps+'<rect x="365" y="118" width="230" height="128" fill="#102235"/><path d="M480 0V470" stroke="#8392a1" stroke-opacity=".22"/>';
 const pipe='<rect width="960" height="530" fill="#1b2832"/>'+brick+'<g stroke="#667784" fill="none" stroke-width="24"><path d="M0 210H940V310H0"/><path d="M345 0V330M690 0V310"/></g><path d="M0 210H940V310H0" stroke="#d0ae74" stroke-opacity=".5" fill="none" stroke-width="3"/>'+bolts;
 const arch='<rect width="960" height="530" fill="#263443"/><path d="M70 500V180Q75 25 480 20Q880 25 890 180V500" fill="#131e2d" stroke="#7e756d" stroke-width="45"/><path d="M340 495V240L480 130L620 240V495" fill="#182d3e"/>'+brick;
 const fig='<g fill="#0b1724" stroke="#b59268" stroke-width="3"><circle cx="510" cy="301" r="24"/><path d="M483 325l-30 100h95l-16-100Z"/></g>';
 const content={
 street:street+signs+'<rect x="715" y="235" width="141" height="204" fill="#0d1827" stroke="#ac8c66" stroke-width="5"/><text x="785" y="461" text-anchor="middle" fill="#ffda9a" font-size="17">空き家</text>',
 map:'<rect width="960" height="530" fill="#1a2b36"/><g stroke="#5f9c9d" stroke-opacity=".3">'+Array.from({length:15},(_,i)=>'<path d="M'+(i*70)+' 0V530"/><path d="M0 '+(i*45)+'H960"/>').join("")+'</g><path d="M425 453L630 130" stroke="#a7c8c1" stroke-width="6" stroke-dasharray="10 12"/><circle cx="416" cy="440" r="30" fill="#b5e8d1"/><circle cx="630" cy="130" r="34" fill="#f2ba76"/><text x="416" y="504" text-anchor="middle" fill="#b5e8d1" font-size="25">原音：地下</text><text x="630" y="95" text-anchor="middle" fill="#f2ba76" font-size="25">字幕：空き家</text><path d="M510 405L490 185L630 130" stroke="#f2ba76" stroke-width="5" stroke-dasharray="12 10" fill="none"/>',
 pipe:pipe+'<g fill="none" stroke="#ffcf8b"><circle cx="700" cy="290" r="76" stroke-width="4" opacity=".8"/><circle cx="700" cy="290" r="128" opacity=".4" stroke-width="4"/></g>',
 rescue:arch+'<rect x="560" y="190" width="210" height="299" rx="16" fill="#453e3b" stroke="#b69876" stroke-width="8"/>'+Array.from({length:5},(_,i)=>'<path d="M'+(570+i*47)+' 190V489" stroke="#98979d" stroke-width="7"/>').join("")+'<circle cx="661" cy="286" r="35" fill="#e1bb91"/><path d="M610 323Q661 278 713 323V466H610Z" fill="#557d7d"/>',
 silent:arch+'<path d="M580 120L790 330" stroke="#a8ccb8" stroke-width="5" stroke-dasharray="8 14"/><circle cx="785" cy="336" r="36" fill="#f6bd7a"/><text x="785" y="342" text-anchor="middle" font-size="16" fill="#283a40">音</text>',
 reflection:street+'<path d="M170 390Q275 80 480 120Q685 160 790 390" stroke="#ffcb82" stroke-width="22" stroke-opacity=".3" fill="none"/><path d="M180 380Q275 103 480 151Q685 195 790 384" stroke="#ffcc7c" stroke-width="5" stroke-dasharray="11 12" fill="none"/>',
 firstsign:arch+'<path d="M470 470 660 470 660 380 730 380 730 320 800 320 800 260 860 260 860 500H470Z" fill="#887b66" stroke="#dab489" stroke-width="5"/><path d="M250 500 250 282 350 240 392 330 480 335" stroke="#b86d63" fill="none" stroke-width="17"/>'+fig+'<rect x="748" y="150" width="125" height="82" rx="4" fill="#f7dfab" stroke="#86583e" stroke-width="7"/><text x="810" y="204" text-anchor="middle" fill="#713d36" font-weight="900" font-size="41">カン！</text>',
 fork:street+'<path d="M480 430L190 280M480 430L783 270" fill="none" stroke="#f1c28f" stroke-width="19" stroke-linecap="round"/><rect x="69" y="213" rx="9" width="255" height="87" fill="#3d5f68" stroke="#edc88b" stroke-width="4"/><text x="194" y="252" fill="#fff0d0" text-anchor="middle" font-size="27">工房 ／ 近道</text><rect x="650" y="213" rx="9" width="259" height="87" fill="#336074" stroke="#edc88b" stroke-width="4"/><text x="782" y="252" fill="#fff0d0" text-anchor="middle" font-size="27">水路 ／ 遠回り</text>',
 workshop:pipe+'<rect x="554" y="327" width="260" height="116" rx="12" fill="#9b7057"/><circle cx="609" cy="454" r="31" fill="#151e28" stroke="#e0bd87" stroke-width="10"/><circle cx="757" cy="454" r="31" fill="#151e28" stroke="#e0bd87" stroke-width="10"/><path d="M530 230Q700 120 853 228" stroke="#fbd09a" stroke-width="7" stroke-dasharray="7 12" fill="none"/>',
 morning:street+'<circle cx="481" cy="96" r="91" fill="#ffe5a1" opacity=".85"/><path d="M0 530L430 240L530 240L960 530" fill="#bf9871" opacity=".7"/>',
 kitchen:'<rect width="960" height="530" fill="#67534b"/><rect x="0" y="0" width="960" height="290" fill="#8d735c"/><rect x="540" y="40" width="285" height="230" fill="#f6ce8d" stroke="#e3b982" stroke-width="17"/><path d="M685 40V270M540 153H825" stroke="#906e5a" stroke-width="11"/><path d="M0 415H960V530H0Z" fill="#3d302e"/><ellipse cx="480" cy="383" rx="212" ry="51" fill="#c5aba1"/><path d="M388 350H580L556 395H411Z" fill="#43585b" stroke="#e1c5a2" stroke-width="8"/><path d="M421 342V294M477 342V282M534 342V304" stroke="#efcc9c" stroke-opacity=".5" stroke-width="9"/>'
 }[type]||street;
 return '<svg viewBox="0 0 960 530" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation"><defs><radialGradient id="vignette"><stop offset="20%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".6"/></radialGradient></defs>'+content+'<rect width="960" height="530" fill="url(#vignette)"/></svg>';
}
/** 登場人物の台詞をすべてテキスト要素として描画し、字幕の読みにくい焼き込みを避ける。 */
function panelMarkup(panel,i){
 const dialogue=panel.talk.map(([name,line,mood])=>'<div class="line '+safe(mood)+'"><span class="talk-face">'+portrait(name,mood)+'</span><span class="talk-copy"><b class="speaker">'+safe(name)+'</b><span>'+safe(line)+'</span></span></div>').join("");
 return '<section class="comic-panel '+(i===0?'wide':'')+'" data-panel="'+i+'" data-art="'+safe(panel.type)+'"><div class="panel-art">'+illustration(panel.type)+'</div><div class="panel-top"><span class="frame-no">'+String(i+1).padStart(2,"0")+'</span>'+(panel.sfx?'<strong class="sfx">'+safe(panel.sfx)+'</strong>':'')+'</div><div class="panel-text"><p class="beat">'+safe(panel.caption)+'</p><div class="lines">'+dialogue+'</div></div></section>';
}
let page=0;
let route=null;
let routeSound=null;
const strip=$("chapter-strip");
chapters.forEach((chapter,i)=>{
 const button=document.createElement("button");button.type="button";button.className="chapter-button";
 button.innerHTML='<small>第'+(i+1)+'幕</small><strong>'+safe(chapter.short)+'</strong>';
 button.addEventListener("click",()=>showPage(i));strip.appendChild(button);
});
function showPage(next){
 const target=Math.max(0,Math.min(chapters.length-1,next));
 page=target;const current=chapters[page];
 const pivot=page===2||page===3?2:1;
 const opening=current.panels.slice(0,pivot).map((panel,i)=>panelMarkup(panel,i)).join("");
 const remainder=current.panels.slice(pivot).map((panel,i)=>panelMarkup(panel,i+pivot)).join("");
 $("paper-stage").innerHTML='<header class="act-header"><span>'+safe(current.tag)+'</span><h2>'+current.heading+'</h2></header><div class="comic-grid">'+opening+'</div>'+(page<4?'<div class="comic-play" id="comic-play"></div>':'')+'<div class="comic-grid followup-grid">'+remainder+'</div>';
 if(page<4)mountToy(page+1,$("comic-play"),(selected,sound)=>{route=selected;routeSound=sound;});
 if(page===4){
  if(!route){const banner=document.createElement("p");banner.className="unplayed-banner";banner.textContent="この結末は参考演出です。第4幕で二つ目の字幕まで動かすと、あなたの選んだ経路の結末になります。";$("paper-stage").querySelector(".act-header").after(banner);}
  const note=document.createElement("p");note.className="chosen-note";
  note.textContent=route?(route==="workshop"?"選んだ工房側から三人が帰った。あの「"+routeSound+"」はまだ車輪のそばで鳴る。":"選んだ水路側から三人が帰った。あの「"+routeSound+"」はまだ金具のそばで鳴る。"):"これは結末の見本。第4幕で実際に新しい字幕を動かすと、あなたの選択がここへ残る。";
  $("paper-stage").appendChild(note);
 }
 [...strip.children].forEach((b,i)=>{b.setAttribute("aria-current",i===page?"step":"false");});
 $("back").disabled=page===0;$("forward").textContent=page===chapters.length-1?"第1幕に戻る ↻":"次の幕 →";
 $("page-indicator").textContent=(page+1)+" / "+chapters.length;
 $("progress-bar").style.width=(100*(page+1)/chapters.length)+"%";
 history.replaceState(null,"","#act-"+(page+1));
 if(target!==next)return;
}
/** 物語を中断せず送る操作に加え、URLで各幕へ直接戻れるようにする。 */
$("back").addEventListener("click",()=>showPage(page-1));
$("forward").addEventListener("click",()=>showPage(page===chapters.length-1?0:page+1));
document.addEventListener("keydown",event=>{
 const active=document.activeElement;
 if(["INPUT","SELECT","TEXTAREA"].includes(active?.tagName))return;
 if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
 if(event.key==="ArrowRight"){event.preventDefault();showPage(page+1);}
 if(event.key==="ArrowLeft"){event.preventDefault();showPage(page-1);}
});
let touchStart=null;
$("paper-stage").addEventListener("touchstart",e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
$("paper-stage").addEventListener("touchend",e=>{
 if(!touchStart||!e.changedTouches.length)return;
 const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
 touchStart=null;
 if(Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)*1.6&&!e.target.closest(".toy"))showPage(page+(dx<0?1:-1));
},{passive:true});
window.addEventListener("hashchange",()=>{const match=/#act-(\d+)/.exec(location.hash);if(match)showPage(Number(match[1])-1);});
const match=/#act-(\d+)/.exec(location.hash);showPage(match?Number(match[1])-1:0);
/** ブラウザQA専用の読み取りスナップショット。 */
Object.defineProperty(window,"__comicSnapshot",{value:()=>({act:page+1,total:chapters.length,panels:$("paper-stage").querySelectorAll("[data-panel]").length,route:route,choiceVisible:Boolean($("toy-chip")),toy:toyState(page+1)})});