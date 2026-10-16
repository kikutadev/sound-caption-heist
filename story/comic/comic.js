import {mountToy,toyState} from "./microplay.js";
import {portrait} from "./portraits.js";
/** 音の字幕を「読む」のではなく、人の判断が変わる瞬間を紙芝居として実演する。 */
const chapters=[{"title":"空き家から三打","short":"SOS","tag":"ACT 01 · THE WRONG PLACE","heading":"誰もいない場所から、<b>返事がある。</b>","panels":[{"type":"street","sfx":"カン……カン……","caption":"誰もいないと記録された旧街区。音は地下、字幕は空き家に浮かぶ。","talk":[["トト","また三回だ！　絶対に誰かいる！","urgent"],["ミオ","この字、音源と違う場所にある……。","thought"]]},{"type":"map","sfx":"地下 → 空き家","caption":"プレイヤーが足音の字幕を動かせば巡回員はつられて振り向く。でも、SOSは人が動かした痕跡が見当たらない。","talk":[["トト","今の、ミオがやったんだよね？　あっちも？","surprised"],["ミオ","違う。あの三打はまだ触ってない。","thought"]]},{"type":"pipe","sfx":"カン、カン、カン","caption":"地下の管がかすかに震えている。聞こえないはずの側から、小さなSOSが来る。","talk":[["トト","管なら返事できそう。もう三回叩こう！","urgent"],["ミオ","叩く前に手を挟まないでね。","dry"]]}]},{"title":"向こうの音が聞こえない","short":"境界","tag":"ACT 02 · THE SILENCE","heading":"鳴っているのに、<b>聞こえない。</b>","panels":[{"type":"pipe","sfx":"カン！ カン！ カン！","caption":"地下の管へ三回。向こうから二回だけ返事。トトが飛び上がった。","talk":[["トト","三回で呼ぶ。二回で返す。母ちゃんだ！","joy"],["ミオ","向こうも聞いてた証拠。返事って、大事だね。","thought"]]},{"type":"silent","sfx":"カン！ → ……","caption":"隔壁のこちらでは鐘の音が聞こえる。向こうで同じ鐘を鳴らしても、音は届かない。それなのに文字だけは見える。","talk":[["トト","いま鳴らしたよ！　字だけ飛んできた！","surprised"],["ミオ","遠くまで耳が届いてるんじゃない。文字が届いてるんだ。","thought"]]},{"type":"rescue","sfx":"ギギッ","caption":"エマは自分で出口を開き、巡回員が安全を確かめて迎える。離れた作業場との連絡が長く途絶えていたことを話す。","talk":[["エマ","トト！　そんな靴で何してるの！","stern"],["トト","母ちゃん！　……二回しか返事しないから心配した！","joy"],["ミオ","この合図、誰かほかの人にも届くかな。","thought"]]}]},{"title":"世界へ続く文字","short":"塔","tag":"ACT 03 · THE FIRST NETWORK","heading":"字幕は、音が届かない土地への<b>橋だった。</b>","panels":[{"type":"silent","sfx":"コツ、コツ","caption":"音のない境界へ字幕を置いても耳では聞こえない。しかし旧中継器を通すと、誰かの目に届き、返事が帰ってくる。","talk":[["トト","字なら行ける！　もっと向こうにも！","joy"],["ミオ","……実音は動かないのに、会話はできる。","thought"]]},{"type":"firstsign","sfx":"むこうの町へ","caption":"旧塔の地図には、街の外の塔へ続く線。図面の端には消された鐘の印と、三つの刻み・二つの刻みがある。","talk":[["トト","三つと二つ！　母ちゃんとの合図みたい。","surprised"],["ミオ","通信係の印かな。……覚えておこう。","thought"]]},{"type":"tower","sfx":"ガラン！","caption":"作業員が実際に鐘を打つと新しい字幕が生まれ、遠い塔に小さな灯りがついた。何年も地図から消えていた場所に、今も反応がある。","talk":[["トト","光った！　地図の外まで！","joy"],["ミオ","記録じゃない。今、何かが反応した。","thought"]]}]},{"title":"知らない人の返事","short":"返事","tag":"ACT 04 · SOMEONE IS THERE","heading":"自動応答？ それとも、<b>本当に誰かいる？</b>","panels":[{"type":"tower","sfx":"コン、コン","caption":"遠方から『受信しました』。三回鳴らすと二回返る。けれど、古い自動応答かもしれない。","talk":[["トト","返事が来た。絶対、人がいる！","urgent"],["ミオ","録音でも返せる。驚くようなことを送ってみよう。","thought"]]},{"type":"map","sfx":"カン！ カン！ カン！ カン！","caption":"トトがわざと四回叩く。向こうから、いま初めて書いたような文字が返る。","talk":[["トト","四回も叩くな!?　怒られた！","joy"],["ミオ","知らない人にまで小言をもらう才能だね。","dry"]]},{"type":"morning","sfx":"そっちは誰？","caption":"塔を止めるとこちらの鐘が聞こえ、遠い字幕は消える。再起動すると文字が届き、鐘は弱まる。『声の橋』そのものが、周りの音を奪っていた。","talk":[["トト","塔を止めたら、鐘が聞こえる！","surprised"],["ミオ","声を遠くに送るほど、近くが静かになる……。","thought"]]}]},{"title":"二つの音を取り戻す","short":"つなぐ","tag":"ACT 05 · TWO SOUNDS, ONE MORNING","heading":"遠い人の返事も、<b>街の鐘も。</b>","panels":[{"type":"fork","sfx":"カン！","caption":"遠くへ強く送ると街の鐘が弱くなる。弱く送っても、続ける限り少し静かになる。どこへ最初の文字を届けるか。","talk":[["トト","向こうにも話したい。こっちの鐘も聞きたい！","urgent"],["ミオ","届ける先は選べる。……送りっぱなしじゃなくてもいいはず。","thought"]]},{"type":"tower","sfx":"カン、カン、カン！ → コン、コン！","caption":"本物の鐘を鳴らして次の塔へ文字を送る。返事が届いてから、ミオが声を出して生まれた『次は正午につなぐ、いい？』の字幕と三打を送る。二打の承諾を待ち、プレイヤーが塔を休ませる。街の鐘が戻った。","talk":[["トト","向こうも受け取った！　よし、休んでいいって！","joy"],["エマ","一度受け取ったら、次の時間まで待てるのよ。","smile"],["ミオ","……これで聞こえる。街の鐘も。","smile"]]},{"type":"sunrise","sfx":"カーン！ ／ パン焦がした！","caption":"市場の朝。エマの鍋が三打、トトが二打で返す。鐘の音を聞きながら短い通信の時間に地図の外の人の文字を読む。次の合図を引き受ける人が増えていく。","talk":[["エマ","トト！　朝ごはんは口で返事！","stern"],["トト","向こうの人、パン焦がしたって！ 母ちゃんよりひどい！","joy"],["エマ","うちのは焦がしてない！","stern"],["ミオ","……いつもより、にぎやかな朝だね。","smile"]]}]}];
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

 const towers='<rect width="960" height="530" fill="#142536"/>'+
  '<path d="M0 430Q210 300 410 410Q610 270 960 415V530H0Z" fill="#243e4c"/>'+
  '<path d="M0 472Q215 375 440 454Q650 366 960 435V530H0Z" fill="#182e3f"/>'+
  [135,330,535,755,905].map((x,i)=>{
   const y=[248,206,278,175,238][i],col=i===3?"#f6ca83":"#89bfc2";
   return '<g><path d="M'+x+' 495V'+y+'M'+(x-29)+' '+(y+40)+'L'+x+' '+(y-43)+'L'+(x+29)+' '+(y+40)+'Z" fill="#1b2c3a" stroke="#678695" stroke-width="5"/><rect x="'+(x-11)+'" y="'+(y-45)+'" width="22" height="16" fill="'+col+'"/><circle cx="'+x+'" cy="'+(y-40)+'" r="23" fill="none" stroke="'+col+'" opacity="'+(i===3?.85:.25)+'" stroke-width="4"/><path d="M'+(x-29)+' 495L'+x+' '+y+'L'+(x+29)+' 495" fill="none" stroke="#527080" stroke-width="4"/></g>'
  }).join("")+
  '<path d="M135 211Q310 90 535 240T905 200" fill="none" stroke="#e0c58e" stroke-width="5" stroke-dasharray="11 17" opacity=".55"/>'+
  '<circle cx="755" cy="135" r="47" fill="#f8dc9b" opacity=".16"/>'+
  '<g fill="#d6d9d0" font-size="24" font-weight="700"><text x="150" y="96">街</text><text x="780" y="96">地図の向こう</text></g>';
 const station='<rect width="960" height="530" fill="#182d39"/>'+
  '<path d="M0 120Q480 -100 960 120V530H0Z" fill="#203746" stroke="#547381" stroke-width="17"/>'+
  '<path d="M300 0V530M640 0V530" stroke="#527180" stroke-opacity=".45" stroke-width="20"/>'+
  '<path d="M480 10V530" stroke="#f6cb85" stroke-width="10" stroke-dasharray="20 18"/>'+
  '<path d="M0 425H960" stroke="#89a5a8" stroke-width="16"/>'+
  '<g font-size="31" font-weight="800" fill="#f3daa4"><text x="70" y="100">聞こえる</text><text x="660" y="100">文字だけ届く</text></g>'+
  '<circle cx="195" cy="275" r="68" fill="none" stroke="#fac782" stroke-width="7"/>'+
  '<circle cx="765" cy="275" r="68" fill="none" stroke="#92d3bd" stroke-width="7" stroke-dasharray="13 15"/>'+
  '<path d="M300 280H640" stroke="#d2bf8f" stroke-width="6" stroke-dasharray="10 16"/>';
 const sunrise='<rect width="960" height="530" fill="#856b6e"/>'+
  '<path d="M0 0H960V290H0Z" fill="#9b9292"/>'+
  '<circle cx="620" cy="235" r="150" fill="#ffe0ae" opacity=".8"/>'+
  '<path d="M0 420Q220 280 390 340Q660 210 960 355V530H0Z" fill="#4d6170"/>'+
  '<path d="M0 472Q250 365 540 415T960 395V530H0Z" fill="#2b4759"/>'+
  '<g fill="#1d3342" stroke="#cbab7b" stroke-width="5"><path d="M120 440L160 198L205 440Z"/><path d="M460 440L500 230L540 440Z"/><path d="M790 430L830 170L875 430Z"/></g>'+
  '<g stroke="#fff0bb" fill="#fff1c2"><circle cx="160" cy="196" r="12"/><circle cx="500" cy="229" r="10"/><circle cx="830" cy="168" r="14"/></g>'+
  '<path d="M160 195Q470 12 830 165" fill="none" stroke="#e6c58e" stroke-width="7" stroke-dasharray="14 15"/>';
 const content={
 tower:towers,
 station:station,
 sunrise:sunrise,
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
function routeOutcome(){
 if(route==="city")return "【広場の中継】遠い町の朝ごはんの話が届いた。三打への二打を確かめて塔を休ませると、みんなの前で街の鐘が鳴った。次の短い通信は広場の人々が手伝う。音："+routeSound;
 if(route==="hill")return "【丘の中継】遠くの集落が次へ合図を回した。三打への二打を確かめて塔を休ませると、街の鐘が戻った。次の短い通信には丘の作業員と遠くの人が参加する。音："+routeSound;
 return "まだ中継は完成していません。三打で返事を確かめ、塔を休ませる方法を試してください。";
}
/** 選択による目撃者と、その後に参加する人々の違いを最後まで残す。 */
function updateWitnessCut(){
 const host=$("comic-play");if(!host)return;
 const complete=Boolean(toyState(5)?.success);
 const grid=$("paper-stage").querySelector(".followup-grid");
 if(grid)grid.hidden=!complete;
 let el=$("witness-cut");
 if(!complete||!route){el?.remove();return;}
 if(!el){el=document.createElement("section");el.id="witness-cut";host.after(el);}
 el.className="witness-cut "+(route==="city"?"public":"guard");
 if(route==="city")el.innerHTML="<strong>広場の人が、次の合図を引き受けた</strong><p>パン屋が窓を開けると、久しぶりに鐘が響いた。遠い町の『パン焦がした！』に店員が笑い、子どもたちは次の通信のために三打を練習している。</p>";
 else el.innerHTML="<strong>丘の作業員が、向こうの人と約束した</strong><p>二つ目の塔にも短い返事。丘の作業員は次の通信時刻を板に書く。短い字を送ったあと、街の鐘がしっかり聞こえる。遠くの集落も自分たちで次へ中継する。</p>";
}
function showPage(next){
 const target=Math.max(0,Math.min(chapters.length-1,next));
 page=target;const current=chapters[page];
 const pivot=1;
 const opening=current.panels.slice(0,pivot).map((panel,i)=>panelMarkup(panel,i)).join("");
 const remainder=current.panels.slice(pivot).map((panel,i)=>panelMarkup(panel,i+pivot)).join("");
 $("paper-stage").innerHTML='<header class="act-header"><span>'+safe(current.tag)+'</span><h2>'+current.heading+'</h2></header><div class="comic-grid">'+opening+'</div>'+(page<5?'<div class="comic-play" id="comic-play"></div>':'')+'<div class="comic-grid followup-grid">'+remainder+'</div>';
 if(page<5)mountToy(page+1,$("comic-play"),(selected,sound)=>{route=selected;routeSound=sound;const note=document.querySelector('.chosen-note');if(note)note.textContent=routeOutcome();if(page===4)updateWitnessCut();});
 if(page===4){
  const note=document.createElement("p");note.className="chosen-note";
  note.textContent=routeOutcome();
  $("paper-stage").appendChild(note);
  updateWitnessCut();
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
Object.defineProperty(window,"__comicSnapshot",{value:()=>({act:page+1,total:chapters.length,panels:$("paper-stage").querySelectorAll("[data-panel]").length,route:route,choiceVisible:Boolean($("toy-chip")||$("knock-once")),toy:toyState(page+1)})});