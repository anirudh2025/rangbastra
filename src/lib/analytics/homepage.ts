declare global { interface Window { dataLayer?: Array<Record<string, unknown>> } }

const allowedEvents = new Set([
  "collection_selected", "product_opened", "couture_finder_completed",
  "product_saved", "customization_started", "consultation_submitted",
  "bride_story_explored", "craft_detail_explored",
]);

export function initHomepageAnalytics() {
  const root=document.querySelector<HTMLElement>(".homepage-journey");
  if(!root||root.dataset.analyticsReady)return;
  root.dataset.analyticsReady="true";
  const emit=(name:string,properties:Record<string,string>={})=>{
    if(!allowedEvents.has(name))return;
    const safe=Object.fromEntries(Object.entries(properties).filter(([key,value])=>["product","category","occasion","feeling","detail","source"].includes(key)&&typeof value==="string").map(([key,value])=>[key,value.slice(0,80)]));
    window.dataLayer?.push({event:name,...safe});
  };
  root.addEventListener("click",event=>{const link=(event.target as Element).closest<HTMLElement>("[data-track]");if(link){const dimensions={product:link.dataset.product??"",category:link.dataset.category??"",source:"homepage"};emit(link.dataset.track??"",dimensions);if(link.dataset.track==="product_opened"&&link.dataset.category)emit("collection_selected",dimensions)}const primary=(event.target as Element).closest(".consultation-primary");if(primary)emit("customization_started",{source:"homepage_invitation"})});
  document.addEventListener("rangbastra:analytics",event=>{const detail=(event as CustomEvent<Record<string,string>>).detail??{};const {name,...properties}=detail;emit(name,properties)});
  document.addEventListener("rangbastra:product-saved",event=>{const detail=(event as CustomEvent<{product?:string}>).detail;emit("product_saved",{product:detail?.product??"",source:"homepage"})});
}
