// Relationships verified against the archived Billie, Zane, Jay and Ryder pages.
// These describe the parent relative to the open profile, not relative to Obi.
const parentRoles = {
  billie: 'Mother', zane: 'Father', jay: 'Mother', ryder: 'Father',
  halsey: 'Mother', 'not-an-illusion': 'Father',
  'basileas-american-journey': 'Mother',
  'gordonview-all-my-exs-live-in-texas': 'Father',
  'timberlines-different-dimension': 'Mother', 'timberlines-fenaz': 'Father',
};
export const parentRole = id => parentRoles[id] || 'Parent';
export function healthGroups(tests) {
  return [
    {title: 'Screening', rows: tests.filter(test => test.category !== 'Genetic')},
    {title: 'Genetic results', rows: tests.filter(test => test.category === 'Genetic')},
  ].filter(group => group.rows.length);
}
