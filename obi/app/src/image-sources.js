import thumbnails from './data/thumbnails.json';

// A small tree node or thumbnail must not decode the full gallery image.
export function thumbnailSource(src) {
  return thumbnails[src]?.src || src;
}
