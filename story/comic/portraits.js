/** Character portraits; character identities remain consistent across speech panels. */
const colors={"ミオ":["#333942","#779192","#e8b58a"],"トト":["#7c4935","#bd604b","#ebbf8d"],"エマ":["#574639","#5b8587","#d6a47d"]};
export function portrait(name,mood){
 const c=colors[name]??colors["ミオ"];
 const happy=mood==="joy"||mood==="smile",startled=mood==="urgent"||mood==="surprised";
 const eyes=happy?'<path d="M20 38q7-7 13 0M44 38q7-7 13 0" fill="none" stroke="#303036" stroke-width="3"/>':startled?'<ellipse cx="27" cy="38" rx="3.5" ry="5" fill="#303036"/><ellipse cx="49" cy="38" rx="3.5" ry="5" fill="#303036"/>':'<path d="M22 39h11M44 39h11" stroke="#303036" stroke-width="3"/>';
 const mouth=happy?'<path d="M31 50q7 8 15 0" fill="none" stroke="#98534a" stroke-width="3"/>':startled?'<ellipse cx="39" cy="51" rx="5" ry="6" fill="#98534a"/>':'<path d="M32 52h12" stroke="#98534a" stroke-width="2"/>';
 return '<svg viewBox="0 0 78 84" aria-hidden="true"><path d="M0 84Q8 65 39 65Q70 65 78 84Z" fill="'+c[1]+'"/><ellipse cx="39" cy="39" rx="27" ry="29" fill="'+c[2]+'"/><path d="M13 46Q0 11 32 5Q79 1 64 45L58 27Q38 19 27 30L13 48Z" fill="'+c[0]+'"/>'+eyes+mouth+(name==="トト"?'<path d="M13 70Q39 58 62 70L54 84H22Z" fill="#b04731"/>':'')+'</svg>';
}
