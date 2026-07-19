export function initHomepageGlow() {
  const glow = document.querySelector<HTMLElement>("[data-homepage-glow]");
  if (!glow || glow.dataset.ready === "true") return;
  glow.dataset.ready = "true";
  const capable = matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
  if (!capable.matches) return;
  let x=-1000,y=-1000,targetX=-1000,targetY=-1000,frame=0,visible=!document.hidden,last=performance.now();
  const render = (time:number) => { if (!visible) { frame=0; return; } const delta=Math.min(50,time-last); last=time; const ease=1-Math.exp(-15*delta/1000); x+=(targetX-x)*ease; y+=(targetY-y)*ease; glow.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`; frame=(Math.abs(targetX-x)+Math.abs(targetY-y)>.2)?requestAnimationFrame(render):0; };
  document.addEventListener("pointermove", (event) => { targetX=event.clientX; targetY=event.clientY; if(x<0){x=targetX;y=targetY} glow.classList.add("is-visible"); if(!frame){last=performance.now();frame=requestAnimationFrame(render)} }, { passive:true });
  document.addEventListener("pointerleave", () => glow.classList.remove("is-visible"));
  document.addEventListener("visibilitychange", () => { visible=!document.hidden; glow.classList.toggle("is-visible",visible&&x>=0); if(!visible&&frame){cancelAnimationFrame(frame);frame=0} });
}
