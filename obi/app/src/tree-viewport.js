import { MIN_ZOOM } from './zoom.js';

// Use the pedigree's known dimensions, not measurements of transformed nodes.
export function fittedTreeViewport(layout, width, height) {
  if (!(width > 0 && height > 0)) return null;
  const zoom = Math.max(MIN_ZOOM, Math.min(1.15,
    width / (layout.width * 1.09), height / (layout.height * 1.09)));
  return { x: (width - layout.width * zoom) / 2 + 20 * zoom,
    y: (height - layout.height * zoom) / 2, zoom };
}

export function sameViewport(a, b) {
  return Math.abs(a.x-b.x)<0.25 && Math.abs(a.y-b.y)<0.25 && Math.abs(a.zoom-b.zoom)<0.0001;
}

// Expanded mobile view starts close enough to inspect the selected family member.
// Fit remains the explicit way to return to the complete pedigree.
export function focusedTreeViewport(layout, id, width, height) {
  const node = layout.placements.find(p => p.id === id);
  if (!node || !(width > 0 && height > 0)) return fittedTreeViewport(layout, width, height);
  const zoom = Math.max(MIN_ZOOM, Math.min(1.2, width / (node.width * 1.65), height / 420));
  const bounded = (center, size, extent) => extent * zoom <= size
    ? (size - extent * zoom) / 2
    : Math.min(16, Math.max(size - extent * zoom - 16, center));
  return { x: bounded(width / 2 - (node.x + node.width / 2) * zoom, width, layout.width),
    y: height / 2 - (node.y + 130) * zoom, zoom };
}

// Resize notifications can be repeated, fractional, or delivered during a fit.
// Remember the dimensions BEFORE moving the camera so its own notifications
// cannot schedule another fit. One pending frame always uses the latest size.
export function observeTreeSize(element, onResize, {
  Observer = ResizeObserver, requestFrame = requestAnimationFrame,
  cancelFrame = cancelAnimationFrame,
} = {}) {
  let lastWidth = -1, lastHeight = -1, frame, disposed = false;
  const observer = new Observer(([entry]) => {
    if (disposed || !entry) return;
    const width = Math.round(entry.contentRect.width);
    const height = Math.round(entry.contentRect.height);
    if (width <= 0 || height <= 0 || (width === lastWidth && height === lastHeight)) return;
    lastWidth = width; lastHeight = height;
    if (frame !== undefined) cancelFrame(frame);
    frame = requestFrame(() => {
      frame = undefined;
      if (!disposed) onResize(lastWidth, lastHeight);
    });
  });
  observer.observe(element);
  return () => { disposed = true; observer.disconnect(); if (frame !== undefined) cancelFrame(frame); };
}
