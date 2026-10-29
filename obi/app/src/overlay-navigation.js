export function nextOverlay(previous,type,id) {
  return {type,id,depth:(previous?.depth||0)+1,trail:previous?[...(previous.trail||[]),{type:previous.type,id:previous.id}]:[]};
}
export function archiveHash(view,dog,overlay=null) {
  const query=new URLSearchParams({dog});
  if(overlay)query.set(overlay.type,overlay.id);
  return `#${view}?${query}`;
}
