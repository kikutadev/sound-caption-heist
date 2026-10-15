import { abilities, chapters, scenes, chapterStart, stageStart } from "./scenes.js";
import { illustration } from "./art.js";
const $=id=>document.getElementById(id);
const avatars={"トト":"toto","ミオ":"mio","エマ":"emma","クララ":"clara","アーデル":"adel","ナディア":"nadia","巡回員":"guard","救助員":"rescuer","作業員":"worker"};
let index=0;
let detailsOpen=false;
const chaptersNav=$("chapters");
for(let i=0;i<chapters.length;i++){
 const button=document.createElement("button");
 button.className="chapter";
 button.type="button";
 button.innerHTML='<small>CHAPTER 0'+(i+1)+'</small><strong>'+chapters[i]+'</strong>';
 button.addEventListener("click",()=>go(chapterStart[i]));
 chaptersNav.appendChild(button);
}
for(let i=0;i<10;i++){
 const option=document.createElement("option");
 option.value=String(i);
 option.textContent="STAGE "+String(i+1).padStart(2,"0")+" "+scenes[stageStart[i]].name;
 $("stage-select").appendChild(option);
}
$("stage-select").addEventListener("change",e=>go(stageStart[Number(e.target.value)]));
$("prev").addEventListener("click",()=>go(index-1));
$("next").addEventListener("click",()=>go(index===scenes.length-1?0:index+1));
$("ability-details").addEventListener("click",()=>{
 detailsOpen=!detailsOpen;
 $("ability-details").setAttribute("aria-expanded",String(detailsOpen));
 $("ability-details").querySelector("span").textContent=detailsOpen?"⌃":"⌄";
 $("ability-list").classList.toggle("hidden",!detailsOpen);
});
window.addEventListener("keydown",event=>{
 const node=document.activeElement;
 if(node && ["SELECT","INPUT","TEXTAREA","BUTTON"].includes(node.tagName) && node.tagName!=="BUTTON")return;
 if(event.altKey||event.metaKey||event.ctrlKey)return;
 if(event.key==="ArrowRight"){event.preventDefault();go(index+1);}
 if(event.key==="ArrowLeft"){event.preventDefault();go(index-1);}
});
let touchX=null;
$("illustration").addEventListener("touchstart",e=>{
 if(e.touches.length===1)touchX=e.touches[0].clientX;
},{passive:true});
$("illustration").addEventListener("touchend",e=>{
 if(touchX===null||!e.changedTouches.length)return;
 const delta=e.changedTouches[0].clientX-touchX;touchX=null;
 if(Math.abs(delta)>55)go(index+(delta<0?1:-1));
},{passive:true});
function go(next){
 if(!Number.isFinite(next))return;
 const selected=Math.max(0,Math.min(scenes.length-1,next));
 if(selected===index){render();return;}
 index=selected;
 history.replaceState(null,"","#scene-"+String(index+1).padStart(2,"0"));
 render();
}
function render(){
 const scene=scenes[index];
 const art=$("artwork");
 art.innerHTML=illustration(scene);
 art.setAttribute("aria-label",scene.name+"："+scene.intro);
 $("scene-number").textContent="SCENE "+String(index+1).padStart(2,"0")+" / "+String(scenes.length).padStart(2,"0");
 $("scene-kind").textContent=scene.kind;
 $("scene-location").textContent=scene.place;
 $("scene-sound").textContent=scene.sound;
 $("stage-label").textContent=scene.kind==="エピローグ"?"EPILOGUE":"STAGE "+String(scene.stage).padStart(2,"0");
 $("scene-title").textContent=scene.name;
 $("scene-lead").textContent=scene.intro;
 $("gameplay").textContent=scene.play;
 $("artwork").setAttribute("data-scene",scene.art);
 $("artwork").setAttribute("data-effect",scene.effect);
 const ability=abilities.find(item=>item.key===scene.ability)||abilities[0];
 $("ability-tag").textContent=ability.mark+" "+ability.name+(scene.kind==="能力解放"?" 解放":"");
 $("ability-symbol").textContent=ability.mark;
 $("ability-name").textContent=ability.name+(scene.kind==="能力解放"?" — NEW!":"");
 $("ability-note").textContent=ability.desc;
 const dialogues=$("dialogues");
 dialogues.replaceChildren();
 for(const [speaker,line] of scene.talk){
  const box=document.createElement("div");box.className="dialogue";
  const avatar=document.createElement("div");avatar.className="avatar "+(avatars[speaker]||"worker");avatar.textContent=speaker==="巡回員"?"巡":speaker.charAt(0);
  const speech=document.createElement("div");speech.className="speech";
  const strong=document.createElement("strong");strong.textContent=speaker;
  const p=document.createElement("p");p.textContent=line;
  speech.append(strong,p);box.append(avatar,speech);dialogues.appendChild(box);
 }
 $("ability-list").replaceChildren();
 for(const a of abilities){
  const b=document.createElement("div");b.className="ability-list-item"+(scene.stage<a.stage?" locked":"");
  const icon=document.createElement("span");icon.textContent=a.mark;
  const name=document.createElement("b");name.textContent=a.name;
  const detail=document.createElement("em");detail.textContent=scene.stage<a.stage?"STAGE "+String(a.stage).padStart(2,"0")+"で登場":a.desc;
  b.append(icon,name,detail);$("ability-list").appendChild(b);
 }
 for(let i=0;i<chaptersNav.children.length;i++){
  const b=chaptersNav.children[i];b.setAttribute("aria-current",i===scene.ch?"step":"false");
 }
 $("stage-select").value=String(scene.stage-1);
 $("page-count").textContent=(index+1)+" / "+scenes.length;
 $("progress-fill").style.width=(100*(index+1)/scenes.length)+"%";
 $("prev").disabled=index===0;
 $("next").innerHTML=index===scenes.length-1?'最初に戻る <span>↻</span>':'次の場面 <span>→</span>';
 $("paper").dataset.chapter=String(scene.ch+1);
}
const fromHash=/#scene-(\d+)/.exec(location.hash);
if(fromHash) index=Math.min(scenes.length-1,Math.max(0,Number(fromHash[1])-1));
window.addEventListener("hashchange",()=>{
 const match=/#scene-(\d+)/.exec(location.hash);
 if(match){index=Math.min(scenes.length-1,Math.max(0,Number(match[1])-1));render();}
});
render();
/** Read-only QA diagnostics for verifying the published chapter/story/ability. */
Object.defineProperty(window,"__storyboardSnapshot",{value:()=>({
 scene:index+1,total:scenes.length,stage:scenes[index].stage,chapter:scenes[index].ch+1,
 title:scenes[index].name,ability:scenes[index].ability,kind:scenes[index].kind
})});
