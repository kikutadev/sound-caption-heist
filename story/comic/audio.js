/** Small Web Audio sounds for user-triggered paper-theater actions. */
let on=true,ctx=null;
export const audioEnabled=()=>on;
export const toggleAudio=()=>{on=!on;return on;};
/** Play a short non-looping cue only after a user gesture. */
export function cue(type){
 if(!on)return;
 try{
  const AudioClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioClass)return;
  ctx??=new AudioClass();
  if(ctx.state==="suspended")void ctx.resume();
  const now=ctx.currentTime;
  const notes={
   foot:[[240,0,.065],[190,.11,.065]],
   knock:[[290,0,.09]],
   knockTriple:[[290,0,.08],[300,.15,.08],[310,.3,.08]],
   reply:[[350,.20,.085],[330,.42,.085]],
   sign:[[495,0,.11]],
   metal:[[160,0,.20],[104,.09,.26]],
   cart:[[100,0,.09],[135,.09,.09],[85,.18,.13],[115,.29,.09]],
   step:[[420,0,.08],[540,.14,.11]],
   bell:[[440,0,.70],[660,0,.52],[880,0,.37]]
  }[type]??[[230,0,.10]];
  for(const [freq,delay,length] of notes){
   const osc=ctx.createOscillator(),gain=ctx.createGain(),start=now+delay;
   osc.type=type==="cart"||type==="metal"?"sawtooth":"triangle";
   osc.frequency.setValueAtTime(freq,start);
   gain.gain.setValueAtTime(0.0001,start);
   gain.gain.exponentialRampToValueAtTime(type==="cart"?0.027:type==="bell"?0.038:0.10,start+.012);
   gain.gain.exponentialRampToValueAtTime(.0001,start+length);
   osc.connect(gain);gain.connect(ctx.destination);
   osc.start(start);osc.stop(start+length+.025);
  }
 }catch{/* Audio should never block visual or keyboard gameplay. */}
}
