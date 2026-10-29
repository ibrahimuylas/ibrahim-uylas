// Shared junctions give each generation one horizontal bus, rather than
// independent automatic elbow routes that introduce tiny offsets at joins.
export function familyEdgePath({sourceX,sourceY,targetX,targetY,data}) {
  const start=`M ${sourceX} ${sourceY}`;
  if (Math.abs(sourceX-targetX)<0.01) return `${start} V ${targetY}`;
  if (Math.abs(sourceY-targetY)<0.01) return `${start} H ${targetX}`;
  if(data?.route==='ancestors') return `${start} V ${targetY} H ${targetX}`;
  if(data?.route==='children') return `${start} H ${targetX} V ${targetY}`;
  return `${start} V ${(sourceY+targetY)/2} H ${targetX} V ${targetY}`;
}

// Lay out the recorded pedigree, including every sibling and every known ancestor.
// Ancestor branches reserve their own horizontal span, so adding a generation
// cannot overlap the neighbouring branch. No unrecorded relatives are invented.
export function buildFamilyLayout(dogs) {
  const byId=new Map(dogs.map(d=>[d.id,d]));
  const parents=new Set(dogs.flatMap(d=>d.parents));
  const leaves=dogs.filter(d=>!parents.has(d.id));
  const distances=new Map();
  function visit(id,depth,path=new Set()) {
    if(!byId.has(id))throw new Error(`Missing parent ${id}`);
    if(path.has(id))throw new Error(`Pedigree cycle at ${id}`);
    if((distances.get(id)??-1)>=depth)return;
    distances.set(id,depth);
    for(const parent of byId.get(id).parents)visit(parent,depth+1,new Set([...path,id]));
  }
  leaves.forEach(d=>visit(d.id,0));
  if(distances.size!==dogs.length)throw new Error('Pedigree contains a cycle');
  const depth=Math.max(...distances.values());
  const widthOf=d=>d.role==='Mother'||d.role==='Father'?280:210;
  const spans=new Map();
  function span(id){if(!spans.has(id)){const d=byId.get(id);spans.set(id,Math.max(widthOf(d),d.parents.reduce((sum,p)=>sum+span(p),0)+Math.max(0,d.parents.length-1)*60));}return spans.get(id);}
  const positions=new Map();
  function place(id,left){
    if(positions.has(id))return;
    const d=byId.get(id),width=widthOf(d);
    positions.set(id,{id,x:left+span(id)/2-width/2,y:(depth-distances.get(id))*360+(distances.get(id)===0?100:0),width,tier:distances.get(id)===0?'puppy':distances.get(id)===1?'parent':distances.get(id)===2?'grandparent':'ancestor'});
    let x=left;
    for(const p of d.parents){place(p,x);x+=span(p)+60;}
  }
  const roots=[...new Set(leaves.flatMap(d=>d.parents))];
  let x=0;
  for(const id of roots){place(id,x);x+=span(id)+80;}
  const ancestralWidth=Math.max(0,x-80);
  const orderedLeaves=[...leaves.filter(d=>d.role==='Candidate'),...leaves.filter(d=>d.role!=='Candidate')];
  const leafWidth=orderedLeaves.length*250+Math.max(0,orderedLeaves.length-1)*36;
  const totalWidth=Math.max(ancestralWidth,leafWidth);
  for(const p of positions.values())p.x+=(totalWidth-ancestralWidth)/2;
  orderedLeaves.forEach((d,i)=>positions.set(d.id,{id:d.id,x:(totalWidth-leafWidth)/2+i*286,y:depth*360+100,width:250,tier:'puppy'}));
  const groups=[];
  for(const [role,title] of [['Candidate','Our three candidates'],['Sibling','Other siblings']]){
    const members=dogs.filter(d=>d.role===role).map(d=>positions.get(d.id));if(!members.length)continue;
    const left=Math.min(...members.map(p=>p.x))-14,top=Math.min(...members.map(p=>p.y))-100;
    groups.push({id:`group:${role}`,x:left,y:top,width:Math.max(...members.map(p=>p.x+p.width))-left+14,height:410,title,candidate:role==='Candidate',members:members.map(p=>p.id)});
  }
  const families=new Map();
  for(const d of dogs){if(!d.parents.length)continue;const key=[...d.parents].sort().join('|');if(!families.has(key))families.set(key,{parents:d.parents,children:[]});families.get(key).children.push(d.id);}
  const junctions=[],edges=[];
  for(const [key,family] of families){
    const id=`family:${key}`;
    // A shared litter connects to its group borders, not through every photo.
    // Only collapse a group when all members have this exact set of parents.
    const familyGroups=groups.filter(g=>g.members.every(c=>family.children.includes(c)));
    const grouped=new Set(familyGroups.flatMap(g=>g.members));
    const targets=[...familyGroups,...family.children.filter(c=>!grouped.has(c)).map(c=>positions.get(c))];
    const center=family.parents.reduce((sum,p)=>sum+positions.get(p).x+positions.get(p).width/2,0)/family.parents.length;
    junctions.push({id,x:center-.5,y:Math.min(...targets.map(c=>c.y))-(familyGroups.length?24:55)-.5});
    for(const p of family.parents)edges.push({id:`${p}->${id}`,source:p,target:id,data:{route:'ancestors',delay:120},relatives:[...family.parents,...family.children]});
    for(const {id:c} of targets)edges.push({id:`${id}->${c}`,source:id,target:c,data:{route:'children',delay:240},relatives:[...family.parents,...family.children]});
  }
  return {placements:[...positions.values()],junctions,edges,groups,width:totalWidth+40,height:depth*360+440};
}
