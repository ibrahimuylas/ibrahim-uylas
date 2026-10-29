import thumbnails from './data/thumbnails.json';

// Hand-checked face centres and square crop widths, relative to the source.
// Key by photo ID so a reordered gallery never inherits the wrong framing.
const faces = {
  '364e14912a06': [.65, .27, .34], // Billie
  '294cf51b745a': [.57, .27, .34], // Zane
  'a5313bdb35ef': [.47, .27, .34], // Jay
  '3fae457d40c2': [.51, .30, .36], // Ryder
  '12773a2f5791': [.50, .35, .40], // Halsey
  'a6e1b5f5db84': [.47, .25, .52], // Not An Illusion
  '9070baffe040': [.35, .40, .42], // Basileas American Journey
  '89050ee07fb8': [.51, .33, .40], // Gordonview All My Ex’s Live In Texas
  '2bd527c258ae': [.49, .46, .78], // Timberlines Different Dimension
  '3282097f4497': [.35, .36, .48], // Timberlines Fenaz
};

export function parentPortraitStyle(photo) {
  const face = faces[photo.id], image = thumbnails[photo.src];
  if (!face || !image) return undefined;
  const [x, y, size] = face;
  const height = image.height / image.width;
  // Clamp the square within the image so circular portraits never expose gaps.
  const left = Math.max(0, Math.min(1 - size, x - size / 2));
  const top = Math.max(0, Math.min(height - size, y * height - size / 2));
  return {width: `${100 / size}%`, height: 'auto', left: `${-left / size * 100}%`, top: `${-top / size * 100}%`};
}
