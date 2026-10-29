export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 2.5;
export function zoomAround(viewport, pointer, delta) {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, viewport.zoom * Math.exp(-delta * 0.003)));
  return {zoom, x:pointer.x-(pointer.x-viewport.x)*zoom/viewport.zoom, y:pointer.y-(pointer.y-viewport.y)*zoom/viewport.zoom};
}
export function attachModifierZoom(element, getViewport, setViewport, onManual) {
  const handle = event => {
    if (!event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const bounds = element.getBoundingClientRect();
    const delta = event.deltaY * (event.deltaMode===1?16:event.deltaMode===2?bounds.height:1);
    onManual();
    setViewport(zoomAround(getViewport(), {x:event.clientX-bounds.left,y:event.clientY-bounds.top},delta));
  };
  element.addEventListener('wheel',handle,{passive:false,capture:true});
  return () => element.removeEventListener('wheel',handle,{capture:true});
}
