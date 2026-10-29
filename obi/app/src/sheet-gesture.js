// A drag on the grip/header dismisses; body scrolling only becomes a drag when
// it starts at the top, outside a gallery or interactive control.
export function shouldDismissSheet(distance, elapsed, height) {
  return distance >= Math.min(160, height * .22) || (distance >= 50 && distance / Math.max(1, elapsed) > .6);
}

export function attachSheetGesture(dialog, onDismiss) {
  const header = dialog.querySelector('.sheet-top');
  const content = dialog.querySelector('.dialog-content');
  let drag = null;
  const interactive = target => target.closest('button,a,input,select,textarea,.gallery');
  const start = (x,y) => { drag = {x,y,distance:0,time:performance.now(),vertical:false}; };
  const move = (x,y,event) => {
    if (!drag) return;
    const dx=x-drag.x,dy=y-drag.y;
    if (!drag.vertical) {
      if (Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)) { drag=null;return; }
      if (dy<0) { drag=null;return; }
      if (dy<10||dy<Math.abs(dx)*1.2) return;
      drag.vertical=true;
      dialog.dataset.sheetDragged='true';
      dialog.dataset.dragging='true';
    }
    if(event.cancelable)event.preventDefault();
    drag.distance=Math.max(0,dy);
    dialog.style.setProperty('--sheet-drag',`${drag.distance}px`);
  };
  const finish = (cancel=false) => {
    if (!drag)return;
    const dismiss=!cancel&&drag.vertical&&shouldDismissSheet(drag.distance,performance.now()-drag.time,dialog.clientHeight);
    drag=null;delete dialog.dataset.dragging;
    if(dismiss)onDismiss();else dialog.style.setProperty('--sheet-drag','0px');
  };
  const pointerStart=e=>{
    if(!e.isPrimary){finish(true);return;}
    if(e.button!==0||interactive(e.target))return;
    start(e.clientX,e.clientY);header.setPointerCapture(e.pointerId);
  };
  const pointerMove=e=>move(e.clientX,e.clientY,e);
  const pointerEnd=()=>finish();
  const cancel=()=>finish(true);
  const touchStart=e=>{
    if(e.touches.length!==1||content.scrollTop>0||interactive(e.target)){finish(true);return;}
    start(e.touches[0].clientX,e.touches[0].clientY);
  };
  const touchMove=e=>{
    if(e.touches.length!==1){finish(true);return;}
    move(e.touches[0].clientX,e.touches[0].clientY,e);
  };
  header.addEventListener('pointerdown',pointerStart);
  header.addEventListener('pointermove',pointerMove);
  header.addEventListener('pointerup',pointerEnd);
  header.addEventListener('pointercancel',cancel);
  content.addEventListener('touchstart',touchStart,{passive:true});
  content.addEventListener('touchmove',touchMove,{passive:false});
  content.addEventListener('touchend',pointerEnd);
  content.addEventListener('touchcancel',cancel);
  return()=>{
    header.removeEventListener('pointerdown',pointerStart);header.removeEventListener('pointermove',pointerMove);
    header.removeEventListener('pointerup',pointerEnd);header.removeEventListener('pointercancel',cancel);
    content.removeEventListener('touchstart',touchStart);content.removeEventListener('touchmove',touchMove);
    content.removeEventListener('touchend',pointerEnd);content.removeEventListener('touchcancel',cancel);
    delete dialog.dataset.dragging;delete dialog.dataset.sheetDragged;dialog.style.removeProperty('--sheet-drag');
  };
}
