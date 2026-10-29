export function galleryItems(dog) {
  return [...dog.photos, ...(dog.concepts || [])];
}
export function mediaDescription(dog, item, index) {
  return item.kind==='ai-concept'
    ? `${dog.name} — AI adult concept`
    : `${dog.name} — original photograph ${index+1}`;
}
