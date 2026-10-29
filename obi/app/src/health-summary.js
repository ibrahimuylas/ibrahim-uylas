// Local, AI-authored reading aids. Original breeder records remain the source of truth.
export const healthReferences = {
  hips: {label:'FCI hip grading guidance',url:'https://www.fci.be/medias/SCI-DYS-HAN-CLA-en-15522.pdf'},
  nad: {label:'GenSol: NAD carrier interpretation',url:'https://www.gensoldx.com/tests/neuroaxonal-dystrophy-shepherd-type-nad-shep/'},
};

export function healthSummary(dog) {
  if (!dog.tests.length) return [];
  const notes=[];
  const hips=dog.tests.find(t=>t.name==='Hips (HD)');
  const nad=dog.tests.find(t=>t.name==='NAD');
  if (hips) {
    const explanation=hips.result.startsWith('B/C')
      ? 'This includes a C grade and should not be described as “clear hips”. FCI grades describe X-ray findings; ask a vet to review the original hip report and its significance.'
      : hips.result.startsWith('A/A')
        ? 'The breeder reports an A grade for both hips. This is a favourable X-ray screening result, not a guarantee of lifelong joint health or of a puppy’s hip status.'
        : 'This is the breeder’s recorded hip grade. The original grading report provides the detail; it does not determine a puppy’s own hip status.';
    notes.push({title:'Hip screening',text:`${hips.result}. ${explanation}`,reference:'hips'});
  }
  if (nad?.carrier) notes.push({title:'NAD carrier result',text:'The breeder explicitly records NAD carrier status. For the tested recessive form of NAD, a carrier has one variant copy and is not expected to develop disease from that variant alone, but can pass it on. This does not establish any individual puppy’s genotype.',reference:'nad'});
  const genetic=dog.tests.filter(t=>t.category==='Genetic');
  if (genetic.length) notes.push({title:'Genetic results',text:`${genetic.length} genetic entries are recorded: ${genetic.map(t=>t.name).join(', ')}. Read each result above individually. “+/+” is retained as written by the breeder; the original laboratory report is needed to confirm the notation and exact variants tested.`});
  const other=dog.tests.filter(t=>t.category==='Orthopaedic'&&t!==hips);
  if (other.length) notes.push({title:'Other screening',text:other.map(t=>`${t.name}: ${t.result}`).join('; ')+'. These are separate screening findings, not an overall health score.'});
  const eyes=dog.tests.find(t=>t.category==='Eye examination');
  if (eyes) notes.push({title:'Eye examination',text:`Recorded as “${eyes.result}”. This describes the reported examination, not eye colour. The page entry alone does not establish the date or scope of the latest eye certificate.`});
  return notes;
}
