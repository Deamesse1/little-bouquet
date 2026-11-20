import * as THREE from './vendor/three.module.js';

// Small, solid voxels sample curved petal surfaces. Each bloom has its own
// coordinate frame; geometry remains volumetric from every viewing angle.
export function createBouquet() {
  const group = new THREE.Group();
  const pixels = [];
  const step = .042;
  const v = new THREE.Vector3();
  const pinks = ['#c65c89','#df81a7','#f0a2bd','#f9bfd0','#ffd5df'];
  const whites = ['#d4bec6','#e8d9dc','#f5e9e4','#fff5ea','#fffaf2'];
  const greens = ['#254b3b','#386749','#507f54','#739567'];
  function voxel(x,y,z,color,size=step,frame=null) {
    v.set(x,y,z); if(frame) v.applyQuaternion(frame.q).add(frame.p);
    pixels.push({p:v.clone(),color,size});
  }
  function frame(position,normal,scale=1) {
    return {p:new THREE.Vector3(...position),q:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...normal).normalize()),scale};
  }
  function line(a,b,color,width=.045) {
    const length=a.distanceTo(b), n=Math.ceil(length/.026);
    for(let i=0;i<=n;i++){const p=a.clone().lerp(b,i/n);voxel(p.x,p.y,p.z,color,width);}
  }
  function stem(f,index) {
    const bottom=new THREE.Vector3(Math.sin(index*2.4)*.2,-2.25+index*.018,Math.cos(index*2.4)*.18);
    const tie=new THREE.Vector3(bottom.x*.65,-1.35,bottom.z*.65);
    line(bottom,tie,greens[1],.065);line(tie,f.p,greens[index%2+1],.055);
    for(let j=0;j<3;j++){
      const origin=tie.clone().lerp(f.p,.33+j*.19);
      const angle=index*2.4+j*2.1;
      const leaf=frame(origin.toArray(),[Math.cos(angle),.55,Math.sin(angle)]);
      const length=.65+j*.08;
      for(let y=0;y<length;y+=step){const t=y/length,w=.16*Math.pow(Math.sin(Math.PI*t),.8);
        for(let x=-w;x<=w;x+=step)voxel(x,y,Math.sin(t*Math.PI)*.09+Math.abs(x)*.25,Math.abs(x)<.025?greens[3]:greens[1+(Math.floor(t*8)%2)],step,leaf);
      }
    }
  }
  function peony(position,normal,size,index){
    const f=frame(position,normal);stem(f,index);
    // Six nested whorls, broad scalloped outer petals and tightly folded heart.
    for(let layer=0;layer<6;layer++){
      const count=layer<3?11:9;
      const radius=(.67-layer*.092)*size;
      const baseY=(-.11+layer*.074)*size;
      for(let petal=0;petal<count;petal++){
        const angle=petal/count*Math.PI*2+layer*.47;
        const length=(.39-layer*.037)*size;
        const width=(.28-layer*.032)*size;
        for(let t=0;t<=1;t+=.065){
          const w=width*Math.pow(Math.sin(Math.PI*t),.45);
          for(let x=-w;x<=w;x+=step*.9){
            const r=radius*.44+length*t;
            const ruffle=Math.sin(x*48+petal*1.7)*.027*t*t;
            const y=baseY+.25*size*Math.sin(t*2.1)+.14*size*t*t+ruffle+Math.pow(Math.abs(x)/(width||1),2)*.07;
            const c=Math.min(4,Math.max(0,Math.floor(t*3)+((petal+layer)%3===0?1:0)));
            voxel(Math.cos(angle)*r-Math.sin(angle)*x,y,Math.sin(angle)*r+Math.cos(angle)*x,pinks[c],step,f);
          }
        }
      }
    }
    for(let i=0;i<100;i++){const a=i*2.4,r=.15*Math.sqrt(i/100)*size;voxel(Math.cos(a)*r,.29*size+Math.sin(i*1.7)*.045,Math.sin(a)*r,pinks[1+i%3],step,f);}
  }
  function lily(position,normal,size,index,pink=false){
    const f=frame(position,normal);stem(f,index);
    for(let petal=0;petal<6;petal++){
      const angle=petal*Math.PI/3;
      for(let t=0;t<=1;t+=.035){
        const r=(.07+t*.86)*size,w=.205*Math.pow(Math.sin(Math.PI*t),.85)*size;
        for(let x=-w;x<=w;x+=step*.85){
          const y=(.48*Math.sin(t*2.35)-.10*t+Math.abs(x)*.65)*size;
          const vein=Math.abs(x)<.035&&t<.5;
          // Rose midribs fade into blush and ivory edges on the pink lilies.
          const edge=Math.abs(x)/Math.max(w,.001);
          const c=pink
            ? (edge>.76?'#ffe2e7':vein?'#bd5184':t<.35?'#d77a9f':t<.75?'#ed9fba':'#f9c6d5')
            : vein?'#dfb2bd':whites[Math.min(4,2+Math.floor(t*2))];
          voxel(Math.cos(angle)*r-Math.sin(angle)*x,y,Math.sin(angle)*r+Math.cos(angle)*x,c,step,f);
        }
      }
    }
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3+.2,r=.14;
      for(let t=0;t<=1;t+=.055)voxel(Math.cos(a)*r*t,.08+t*.45,Math.sin(a)*r*t,'#b1a26d',.025,f);
      for(let k=-2;k<=2;k++)voxel(Math.cos(a)*r+k*.022,.54,Math.sin(a)*r,'#ac714b',.04,f);
    }
    for(let t=0;t<.5;t+=.025)voxel(0,t,0,'#b8c38a',.03,f);
  }
  peony([-.65,.9,.40],[-.35,.9,.6],1.08,0);
  peony([.53,.53,.65],[.3,.7,.9],1.05,1);
  peony([.20,1.40,-.12],[.15,1,.1],1.02,2);
  peony([-.63,.63,-.66],[-.5,.75,-.7],.94,3);
  peony([.65,.71,-.60],[.7,.7,-.6],.91,4);
  lily([.99,1.27,.16],[.75,.65,.6],.94,5);
  lily([-.98,1.49,-.22],[-.6,.85,.2],.87,6);
  lily([-.24,.34,.96],[-.3,.6,1],.86,7);
  lily([.05,1.04,-.97],[.1,.7,-1],.92,8);
  // A loose outer crown fills the silhouette without covering the peony hearts.
  lily([-.48,1.96,.20],[-.35,.9,.7],.75,9,true);
  lily([.68,1.92,-.46],[.45,.9,-.35],.79,10);
  lily([-1.19,.55,.43],[-.85,.4,.65],.88,11,true);
  lily([1.18,.35,.32],[.8,.4,.8],.84,12);
  lily([.52,.06,.97],[.35,.35,1],.73,13,true);
  lily([-1.12,.60,-.59],[-.85,.55,-.65],.78,14);
  lily([.92,.24,-.88],[.65,.35,-1],.86,15,true);
  lily([-.40,.02,-1.00],[-.35,.4,-1],.74,16,true);
  lily([.45,1.48,.92],[.3,.75,1],.73,17,true);
  lily([-.70,.20,.88],[-.65,.5,1],.70,18);
  // Satin-coloured voxel ribbon around the gathered stems, plus two loops/tails.
  for(let a=0;a<Math.PI*2;a+=.07)for(let y=-1.44;y<-1.26;y+=.035)voxel(Math.cos(a)*.21,y,Math.sin(a)*.21,'#b77b95',.045);
  for(const side of [-1,1]){
    for(let t=0;t<Math.PI*2;t+=.045){
      const x=side*(.12+.33*(1-Math.cos(t))),y=-1.35+.16*Math.sin(t),z=.23+.08*Math.sin(t*2);
      for(let k=0;k<3;k++)voxel(x,y+k*.035,z,'#d8a5b8',.04);
    }
    for(let t=0;t<1;t+=.035)for(let k=0;k<3;k++)voxel(side*(.12+t*.24)+k*.035,-1.43-t*.62,.25+.06*Math.sin(t*5),'#c893aa',.04);
  }
  const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:.87,metalness:0}),pixels.length);
  const dummy=new THREE.Object3D();
  pixels.forEach((p,i)=>{dummy.position.copy(p.p);dummy.scale.setScalar(p.size);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color(p.color));});
  mesh.instanceMatrix.needsUpdate=true;mesh.instanceColor.needsUpdate=true;
  group.add(mesh);group.userData.voxelCount=pixels.length;
  return group;
}
