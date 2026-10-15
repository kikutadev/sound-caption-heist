/* Self-contained original SVG story panels. No downloaded art or assets. */
const tag=(name,attrs={},inside="")=>"<"+name+" "+Object.entries(attrs).map(([k,v])=>k+'="'+String(v)+'"').join(" ")+">"+inside+"</"+name+">";
const rect=(x,y,w,h,fill,extra={})=>tag("rect",{x,y,width:w,height:h,fill,...extra});
const circ=(x,y,r,fill,extra={})=>tag("circle",{cx:x,cy:y,r,fill,...extra});
const path=(d,stroke,width=3,extra={})=>tag("path",{d,fill:"none",stroke,"stroke-width":width,...extra});
const text=(x,y,t,size=19,fill="#f8ebce",extra={})=>tag("text",{x,y,fill,"font-size":size,"font-family":"Noto Sans JP, sans-serif","font-weight":800,"text-anchor":"middle",...extra},t);
const polygon=(points,fill)=>tag("polygon",{points,fill});
const names={mio:"ミオ",toto:"トト",emma:"エマ",clara:"クララ",adel:"アーデル",nadia:"ナディア",guard:"巡回員",worker:"作業員",rescuer:"救助員"};
const palette={
mio:["#deb788","#3c606f","#243d45"],toto:["#e4b783","#b47e51","#50372f"],emma:["#dcb396","#628d87","#435155"],
clara:["#c99a81","#676b88","#2b3442"],adel:["#baaa92","#60746a","#929087"],nadia:["#bd9b7e","#825c65","#41424a"],
guard:["#caaa8a","#8d6255","#2b3c42"],worker:["#d9b28b","#7b8572","#47505a"],rescuer:["#e0b68a","#b49a6d","#3f4b50"]
};
function figure(id,x,y){
 const p=palette[id]||palette.mio, name=names[id]||id;
 let g=circ(0,10,1,"none");
 g+=tag("ellipse",{cx:0,cy:9,rx:44,ry:13,fill:"#08202c88"});
 g+=path("M-20 -24 L-23 8 H-6 L-4 -22 M8 -22 L11 8 H28 L24 -24","#263740",15);
 g+=rect(-28,-80,56,63,p[1],{rx:17,stroke:"#314754","stroke-width":3});
 g+=path("M-25 -65 Q-45 -42 -43 -15 M26 -66 Q45 -39 42 -15",p[0],10);
 g+=circ(0,-110,30,p[0],{stroke:"#715f58","stroke-width":2});
 g+=path("M-29 -112 Q-26 -150 4 -144 Q32 -139 30 -106 L18 -124 Q1 -117 -12 -129 L-31 -108Z",p[2],2);
 if(id==="guard"||id==="rescuer")g+=polygon("-34,-137 34,-137 21,-155 -23,-155",id==="rescuer"?"#ecd083":"#374750");
 if(id==="toto")g+=polygon("-31,-135 30,-135 17,-147 -16,-147","#91613e");
 g+=circ(-9,-108,3,"#273f47")+circ(10,-108,3,"#273f47")+path("M-6 -90 Q0 -86 8 -91","#78584a",2);
 g+=rect(-44,18,88,29,"#163743dd",{rx:10,stroke:"#97b5b9","stroke-width":1})+text(0,38,name,15);
 return tag("g",{transform:"translate("+x+" "+y+")"},g);
}
function bricks(x,y,w,h,color){
 let b=rect(x,y,w,h,color);
 for(let row=0;row<h/24;row++){
  let yy=y+row*24;
  b+=path("M"+x+" "+yy+" H"+(x+w),"#223b4c55",2);
  for(let j=0;j<w/48;j++){let xx=x+j*48+(row%2)*18;b+=path("M"+xx+" "+yy+" v24","#1f3b4655",2);}
 }
 return b;
}
function windows(x,y,n){
 let o="";
 for(let i=0;i<n;i++){let xx=x+i*59;
 o+=rect(xx,y,37,69,"#1e3947")+rect(xx+4,y+4,29,60,i%3===1?"#e5be88":"#a5b7a9")+rect(xx+16,y+3,3,62,"#445968")+rect(xx+3,y+29,32,4,"#415a64");}
 return o;
}
function lamp(x,y){
 return path("M"+x+" "+(y-27)+" v14","#9ba694",4)+rect(x-11,y-14,22,30,"#354f55",{rx:4})+
 rect(x-7,y-9,14,20,"#f4cf8f")+circ(x,y,44,"#efcb8440");
}
function background(kind){
 let o="",water=kind==="canal"||kind==="storm"||kind==="final";
 const internal=["tunnel","archive","workshop","tower"].includes(kind);
 o+=rect(0,0,960,550,"url(#sky)")+circ(738,98,130,"url(#glow)");
 if(!internal){
  for(let i=0;i<14;i++){let x=i*84-20,h=110+(i*37)%115;o+=rect(x,239-h,76,h,"#234a579c")+rect(x+26,247-h,11,21,"#d5c18b44");}
 }
 if(["street","market","yard","festival","sunrise"].includes(kind)){
  o+=bricks(0,81,370,282,"#876d68")+bricks(385,81,575,283,"#637e7d")+windows(35,161,5)+windows(414,155,8);
  o+=rect(0,358,960,192,"#415c63");
  for(let y=359;y<550;y+=26)for(let x=0;x<960;x+=65)o+=rect(x+(y%2)*.46,y,59,2,"#91a69c37");
  if(kind==="market"||kind==="sunrise")for(let j=0;j<3;j++){
   let x=51+j*305;o+=rect(x,331,210,65,"#536b6a")+polygon((x-12)+",338 "+(x+27)+",286 "+(x+195)+",286 "+(x+222)+",338","#c5aa85");
   for(let k=0;k<5;k++)o+=polygon((x-12+k*43)+",338 "+(x+31+k*43)+",338 "+(x+25+k*43)+",287 "+(x+7+k*43)+",287",k%2?"#b46d5c":"#e3c292");
  }
  if(kind==="yard"){
   o+=rect(0,310,960,56,"#3d5760");
   o+=rect(60,328,196,69,"#866c59")+rect(71,340,172,41,"none",{stroke:"#e1bd90","stroke-width":5});
   o+=rect(580,334,112,86,"#8b6e54")+rect(695,361,103,61,"#6b5646");
   o+=rect(754,237,117,105,"#263c49")+circ(810,295,43,"#bea87b")+circ(810,295,20,"#506d72");
   o+=text(811,218,"上の巻き上げ機",18);
  }
  if(kind==="street"){o+=rect(785,263,155,247,"#213a44")+rect(807,312,102,192,"#658379")+path("M800 331 Q858 242 916 331","#c9aa78",11);o+=rect(390,402,110,69,"#9a775b")+rect(402,414,86,45,"none",{stroke:"#cfab82","stroke-width":5});}
  o+=lamp(330,311)+lamp(795,315);
  if(kind==="festival"||kind==="sunrise"){
   o+=path("M0 89 Q480 221 960 89","#efcf98",4);
   for(let i=0;i<19;i++){let x=17+i*51,y=87+34*Math.sin(i*.32);o+=lamp(x,y);}
  }
 }else if(kind==="tunnel"){
  o+=bricks(0,0,960,550,"#49616b")+rect(0,429,960,121,"#304b53");
  for(let i=0;i<6;i++){let x=25+i*186;o+=path("M"+x+" 426 V222 Q"+(x+58)+" 111 "+(x+112)+" 222 V426","#193440",23);}
  o+=rect(624,226,210,197,"#273b4a",{rx:23})+rect(646,232,161,187,"#84918b")+rect(717,234,9,180,"#c4b28c")+circ(737,330,14,"#d9b47d")+lamp(452,303);
 }else if(kind==="archive"){
  o+=rect(0,0,960,550,"#455e64")+rect(0,408,960,142,"#283e49");
  for(let j=0;j<3;j++){let x=34+j*305;o+=rect(x,101,274,294,"#213f4b");
   for(let row=0;row<5;row++){o+=rect(x+8,143+row*49,258,7,"#826f60");for(let k=0;k<10;k++)o+=rect(x+15+k*24,111+row*49,17,30,(row+k)%2?"#bca57d":"#798d83");}
  }
  o+=rect(337,321,291,106,"#243d49")+rect(393,289,179,77,"#e3c694",{rx:6})+circ(484,330,35,"#3c626c")+circ(484,330,21,"#f2d6a1");
 }else if(water){
  o+=bricks(0,110,341,259,"#667e82")+bricks(727,98,233,276,"#6f807b");
  o+=rect(0,360,960,190,"#235569");
  for(let i=0;i<32;i++)o+=path("M"+(i*89%960)+" "+(363+(i*37)%176)+" h"+(12+i%5*7),"#aad9d16e",2);
  o+=polygon("320,420 728,366 732,398 322,452","#9e9078")+path("M326 331 L730 289","#d8bc89",7);
  for(let x=365;x<735;x+=61)o+=path("M"+x+" 340 v-43","#bdab8a",5);
  if(kind==="storm"||kind==="final"){
   o+=rect(0,0,960,550,"#1a2b4d55");
   for(let i=0;i<34;i++)o+=path("M"+(i*97%980)+" "+(i*67%376)+" l-21 87","#a7cfde77",3);
   o+=polygon("534,355 610,355 657,430 568,440","#bc7967");
  }
 }else if(kind==="workshop"){
  o+=bricks(0,66,960,450,"#61777b")+rect(0,425,960,125,"#334853");
  for(let j=0;j<5;j++){let x=101+j*192;o+=circ(x,225,71,"#284250")+circ(x,225,58,"#af9b7d")+circ(x,225,42,"#355764")+circ(x,225,15,"#d4b982");}
  o+=rect(109,386,735,43,"#a18b6e")+lamp(475,351);
 }else if(kind==="tower"){
  o+=bricks(0,0,960,550,"#4e6773")+rect(0,416,960,134,"#233f4b");
  o+=circ(488,230,181,"#253f4d",{stroke:"#dfc08c","stroke-width":16})+circ(488,230,144,"#79958e")+circ(488,230,112,"#29505e")+circ(488,230,79,"#b4a180")+circ(488,230,49,"#345f6e")+circ(488,230,20,"#f3d5a0");
  for(let i=0;i<12;i++){let a=i*Math.PI/6;o+=path("M"+(488+90*Math.cos(a))+" "+(230+90*Math.sin(a))+" L"+(488+146*Math.cos(a))+" "+(230+146*Math.sin(a)),"#e2c999",5);}
  o+=rect(48,341,270,90,"#23424d")+rect(683,337,245,91,"#253e49");
 }
 if(kind==="sunrise")o+=rect(0,0,960,550,"#eeb77a2b");
 return o;
}
function fx(type){
 const bubble=(x,y,t)=>rect(x-85,y-35,170,69,"#f4e2b9",{rx:16,stroke:"#bb9c6c","stroke-width":4})+text(x,y+9,t,26,"#253f49");
 let g="";
 if(type==="move"){g+=path("M280 277 Q487 114 698 269","#f4daab",5,{"stroke-dasharray":"10 12"})+bubble(702,266,"コツコツ");}
 if(type==="misplace"||type==="truth"){
  g+=circ(326,280,50,"#244955e9",{stroke:"#e9ca93","stroke-width":4})+text(326,269,"原音",17)+text(326,292,"地下",16);
  g+=path("M380 276 Q510 153 628 271","#f2d6a6",5,{"stroke-dasharray":"10 10"})+bubble(708,270,"カン、カン");
  g+=text(709,226,type==="truth"?"空き家の字幕":"表示先：空き家",16,"#f7e1b3");
 }
 if(type==="echo"){
   g+=bubble(659,260,"カン×３");
   g+=path("M620 291 Q492 367 378 281","#f5d59b",5,{"stroke-dasharray":"8 10"});
   g+=bubble(325,268,"コン×２");
   g+=text(495,197,"叩いたら、返ってきた",20);
 }
 if(type==="crash"){
   g+=rect(565,362,109,66,"#916b4e",{rx:4,stroke:"#e0c092","stroke-width":5});
   g+=tag("g",{transform:"translate(723 372) rotate(32)"},rect(-53,-39,106,78,"#b28f62",{rx:4,stroke:"#dfbd86","stroke-width":5}));
   g+=bubble(684,274,"ドサッ！");
   g+=text(682,209,"倒れた箱の新しい音",18);
 }
 if(type==="rescue"){
   g+=rect(599,335,244,91,"#324852",{rx:9,stroke:"#d0ba83","stroke-width":6});
   g+=circ(735,379,36,"#d4c194")+circ(735,379,14,"#426776");
   g+=text(732,318,"安全な巻き上げ機",17);
   g+=circ(283,276,55,"#294d59",{stroke:"#f2d6a6","stroke-width":5})+text(283,267,"原音",18)+text(283,293,"地下",18);
   g+=path("M348 275 Q477 95 650 249","#f5d59b",6,{"stroke-dasharray":"9 10"});
   g+=bubble(690,245,"カン×３");
   g+=text(687,183,"字幕で人を呼ぶ",19);
 }
 if(type==="silent-zone"){
  g+=circ(668,277,36,"#d6ad7e",{stroke:"#f5d8a9","stroke-width":4});
  for(let i=0;i<3;i++)g+=circ(669,278,64+i*25,"none",{stroke:"#f2dfbd","stroke-width":3,opacity:.8-i*.22});
  g+=text(664,175,"音はする。でも、文字がない",22);
  g+=text(661,286,"●",24,"#233d43");
 }
 if(type==="firstsign"){
  g+=rect(566,210,238,119,"#f2dcb4",{rx:8,stroke:"#725442","stroke-width":9});
  g+=text(682,282,"カン！",39,"#314b50");
  g+=path("M611 336 Q452 385 284 303","#f4db9f",6,{"stroke-dasharray":"10 12"});
  g+=text(396,221,"手で運ばれた最初の札",22);
  g+=text(337,309,"安全な入口へ",17);
 }
 if(type==="rewind"){
  g+=rect(484,180,368,67,"#203e4de8",{rx:9,stroke:"#f4d9a3","stroke-width":3});
  g+=text(670,224,"昨夜：地下（修正済み）",19);
  g+=path("M679 260 V314","#f5e0a4",5,{"stroke-dasharray":"9 9"});
  g+=rect(484,317,368,67,"#7e514fe8",{rx:9,stroke:"#edcba9","stroke-width":3});
  g+=text(670,359,"今朝：空き家（自動復帰）",18);
 }
 if(type==="incident"){
  g+=rect(575,305,200,100,"#6f6f63",{rx:7,stroke:"#ead2a2","stroke-width":6});
  g+=tag("g",{transform:"translate(635 253) rotate(31)"},rect(-79,-18,158,36,"#a1886b",{rx:3,stroke:"#dbbf90","stroke-width":4}));
  g+=text(656,182,"外れた点検蓋",23);
  g+=bubble(422,307,"ガタン！");
 }
 if(type==="chain"){
  g+=bubble(359,267,"カーン！");
  g+=path("M461 265 Q504 198 559 259","#f6dc9b",5,{"stroke-dasharray":"8 9"});
  g+=bubble(676,269,"ガン！");
  g+=path("M677 326 Q753 361 815 334","#e5c893",4,{"stroke-dasharray":"6 9"});
  g+=text(653,183,"人が動き、新しい音が生まれる",19);
 }
 if(type==="corrected"){
  g+=circ(345,277,65,"#275359",{stroke:"#dbe7b5","stroke-width":6});
  g+=text(345,271,"原音",18)+text(345,298,"地下",18);
  g+=bubble(624,268,"カン×３");
  g+=path("M529 281 Q445 299 420 280","#b5dfbb",6);
  g+=text(623,206,"もう空き家へ飛ばない",18);
 }
 if(type==="erase"){
  const a=[[570,242,-18],[620,212,18],[670,250,-33],[572,305,9],[631,318,35],[690,304,-8]];
  for(const [x,y,r] of a)g+=tag("g",{transform:"translate("+x+" "+y+") rotate("+r+")"},rect(-16,-16,32,32,"#f8e2b8",{rx:4,stroke:"#b08c60","stroke-width":3}));
  g+=text(623,379,"字幕を破壊！",28);
 }
 if(type==="hold"){
  g+=bubble(617,265,"カーン！");
  g+=circ(612,265,114,"none",{stroke:"#ffe2a2","stroke-width":4,"stroke-dasharray":"7 11"});
  g+=text(604,385,"手を離すと消える",20);
  g+=path("M459 238 Q487 196 516 242","#f0cf8b",6);
  g+=text(496,218,"⌛",32);
 }
 if(type==="save"){
  g+=bubble(321,274,"カーン！")+path("M430 265 Q495 203 560 264","#f8dcaa",5,{"stroke-dasharray":"9 12"})+
   rect(548,231,160,103,"#234a57",{rx:13,stroke:"#eccb8d","stroke-width":5})+text(628,295,"保 存",29);
 }
 if(type==="split"){
  g+=bubble(270,271,"カン！")+bubble(716,260,"カン！");
  g+=path("M384 249 Q494 170 603 240","#f4d7a4",5,{"stroke-dasharray":"9 12"})+text(494,199,"× 2",30);
 }
 if(type==="attach"){
   g+=rect(496,368,218,65,"#98744f",{rx:6,stroke:"#d7b186","stroke-width":4});
   g+=circ(540,441,25,"#293b45",{stroke:"#c29e74","stroke-width":6})+circ(684,441,25,"#293b45",{stroke:"#c29e74","stroke-width":6});
   g+=path("M484 350 Q610 302 749 352","#ffdd9f",4,{"stroke-dasharray":"8 10"});
   g+=bubble(612,342,"ガラガラ");
   g+=text(614,256,"荷車に貼る → 文字も走る",21);
 }
 if(type==="correct"){
  g+=bubble(630,277,"ドーン！");
  g+=tag("g",{transform:"translate(676 300) rotate(-16)"},rect(-78,-32,156,64,"#963c41dd",{rx:3,stroke:"#ffdfc8","stroke-width":4})+text(0,10,"訂 正",31,"#fff0d9"));
 }
 return tag("g",{filter:"url(#shadow)"},g);
}
export function illustration(scene){
 let people="";
 const coords=[[173,473],[447,488],[814,475]];
 for(let i=0;i<scene.people.length;i++)people+=figure(scene.people[i],coords[i][0],coords[i][1]);
 const palettes={street:["#426977","#1e4153","#e5c087"],tunnel:["#263d49","#1b323f","#deb47e"],market:["#779294","#51727a","#f2d39a"],yard:["#637c7a","#375562","#efc58e"],archive:["#395b68","#263e4b","#e2c492"],canal:["#4d6f7e","#204d61","#e2c493"],workshop:["#657c76","#3d5665","#e8c38a"],festival:["#405c77","#253f59","#f5be84"],storm:["#263c5d","#1e344f","#e2b181"],tower:["#496a71","#294656","#e1bc85"],final:["#37536c","#223f55","#e6c08d"],sunrise:["#cd9477","#a36f71","#f6c995"]};
 const [sky,bottom,sun]=palettes[scene.art]||palettes.street;
 return tag("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 960 550","aria-hidden":"true"},
 tag("defs",{},tag("linearGradient",{id:"sky",x1:0,y1:0,x2:".1",y2:1},tag("stop",{offset:0,"stop-color":sky})+tag("stop",{offset:1,"stop-color":bottom}))+tag("radialGradient",{id:"glow"},tag("stop",{offset:0,"stop-color":sun,"stop-opacity":".49"})+tag("stop",{offset:1,"stop-color":sun,"stop-opacity":0}))+tag("filter",{id:"shadow",x:"-50%",y:"-50%",width:"200%",height:"200%"},tag("feDropShadow",{dx:1,dy:5,stdDeviation:7,"flood-color":"#061521","flood-opacity":".65"})))+
 background(scene.art)+people+fx(scene.effect)+rect(4,4,952,542,"none",{stroke:"#ebd1a5","stroke-width":9,opacity:".27"}));
}
