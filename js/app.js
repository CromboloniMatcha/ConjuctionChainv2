/* Game logic: drag-and-plug behaviour, feedback and progress. Needs data.js loaded first. */
const $=id=>document.getElementById(id);
const slot=$("slot");
let q=0,found,plugged,wrong=0,tries=0;
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);

function load(){
  const Q=QUESTIONS[q];
  found=new Set();plugged=null;tries=0;
  $("top").textContent=Q.top+"…";
  $("bottom").textContent="…"+Q.bottom+".";
  $("progress").textContent="Question "+(q+1)+" of "+QUESTIONS.length;
  $("pbar").style.width=(q/QUESTIONS.length*100)+"%";
  $("tries").textContent="";
  slot.className="slot";
  slot.querySelectorAll(".piece").forEach(p=>p.remove());
  const tray=$("tray");tray.innerHTML="";
  shuffle(Object.keys(CONJ)).forEach(w=>{
    const cell=document.createElement("div");cell.className="cell";
    const p=document.createElement("div");p.className="piece";p.textContent=w;p.dataset.w=w;
    p.style.setProperty("--rot",(Math.random()*12-6).toFixed(1)+"deg");
    p.style.setProperty("--h",(Object.keys(CONJ).indexOf(w)*31)%360);
    p.home=cell;p.addEventListener("pointerdown",startDrag);
    cell.appendChild(p);tray.appendChild(cell);
  });
  $("next").disabled=true;
  $("next").textContent=q===QUESTIONS.length-1?"Finish":"Next";
  info();
}
function info(msg){
  const Q=QUESTIONS[q],n=Q.answer.length;
  let h="";
  if(msg) h+='<div class="row bad">'+msg+'</div>';
  if(plugged){
    const c=CONJ[plugged.dataset.w];
    // Never reveal the other correct answers in the "similar words" hint
    const syn=c.syn.split(",").map(s=>s.trim()).filter(s=>s&&!Q.answer.includes(s));
    h+='<div class="row"><b class="ok">✓ '+plugged.dataset.w+'</b> — '+c.use+'</div>';
    if(syn.length) h+='<div class="row">Similar words: <i>'+syn.join(", ")+'</i></div>';
  }else if(!msg){
    h+='<div class="row">Which conjunction fits? Drag a piece into the gap.</div>';
  }
  h+='<div class="found">'+(n>1?"This question has "+n+" correct answers. ":"")+"Found: "+found.size+" / "+n+(found.size?" ("+[...found].join(", ")+")":"")+'</div>';
  $("info").innerHTML=h;
  $("next").disabled=found.size<n;
}
function setStyle(p,o){for(const k in o)p.style[k]=o[k];}
function place(p,dest,from){
  ["position","left","top","width","height","zIndex","transform"].forEach(k=>p.style.removeProperty(k.replace(/[A-Z]/g,m=>"-"+m.toLowerCase())));
  p.classList.remove("drag");
  dest.appendChild(p);
  const to=p.getBoundingClientRect();
  p.style.transition="none";
  p.style.transform="translate("+(from.left-to.left)+"px,"+(from.top-to.top)+"px)";
  p.offsetWidth;
  p.style.transition="";
  p.style.transform="";
}
function startDrag(e){
  e.preventDefault();
  const p=e.currentTarget,r=p.getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top;
  if(p.parentElement===slot){plugged=null;slot.classList.remove("ok");info();}
  setStyle(p,{position:"fixed",left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px",zIndex:50,transform:"scale(1.06)"});
  p.classList.add("drag");
  p.setPointerCapture(e.pointerId);
  const move=ev=>{p.style.left=ev.clientX-ox+"px";p.style.top=ev.clientY-oy+"px";};
  const up=ev=>{
    p.removeEventListener("pointermove",move);p.removeEventListener("pointerup",up);p.removeEventListener("pointercancel",up);
    const from=p.getBoundingClientRect(),s=slot.getBoundingClientRect(),m=30;
    const inside=ev.clientX>s.left-m&&ev.clientX<s.right+m&&ev.clientY>s.top-m&&ev.clientY<s.bottom+m;
    const w=p.dataset.w;
    if(inside){
      tries++;$("tries").textContent="Tries: "+tries;
      if(QUESTIONS[q].answer.includes(w)){
        if(plugged&&plugged!==p){place(plugged,plugged.home,plugged.getBoundingClientRect());}
        plugged=p;found.add(w);
        place(p,slot,from);slot.classList.add("ok");info();return;
      }
      wrong++;
      p.classList.add("bad");setTimeout(()=>p.classList.remove("bad"),600);
      slot.classList.add("flash");setTimeout(()=>slot.classList.remove("flash"),500);
      place(p,p.home,from);
      info("✗ “"+w+"” doesn’t fit here. Try another piece!");
      return;
    }
    place(p,p.home,from);
    info();
  };
  p.addEventListener("pointermove",move);p.addEventListener("pointerup",up);p.addEventListener("pointercancel",up);
}
$("next").onclick=()=>{
  if(q<QUESTIONS.length-1){q++;load();return;}
  $("stage").innerHTML='<div class="done"><h2>Well done! 🎉</h2><p>You completed all '+QUESTIONS.length+' questions with '+wrong+' wrong attempt'+(wrong===1?"":"s")+'.</p></div>';
  $("info").remove();$("next").textContent="Play again";$("next").disabled=false;$("next").onclick=()=>location.reload();
};
load();