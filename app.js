import * as THREE from './vendor/three.module.js';
import {createBouquet} from './flowers.js';
import {gift} from './config.js';

const canvas=document.querySelector('#bouquet');
const status=document.querySelector('#status');
document.querySelector('#message').textContent=gift.message;
try {
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));
  renderer.setClearColor(0x080d19,0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.35;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);
  camera.position.set(0,2.1,9.5);camera.lookAt(0,.1,0);
  scene.add(new THREE.HemisphereLight(0xf9e7f1,0x3c514a,2.1));
  function light(color,intensity,position){const l=new THREE.DirectionalLight(color,intensity);l.position.set(...position);scene.add(l);}
  light(0xffe6e4,3,[3,6,5]);light(0xc1cfff,2,[-4,2,-3]);light(0xf5a3c2,.8,[-3,1,4]);
  const bouquet=createBouquet();scene.add(bouquet);
  const particlePositions=new Float32Array(26*3);
  for(let i=0;i<26;i++){particlePositions[i*3]=Math.sin(i*71.3)*3;particlePositions[i*3+1]=Math.cos(i*33.7)*2.7;particlePositions[i*3+2]=-1.8+Math.sin(i*12.4);}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(particlePositions,3));
  const particles=new THREE.Points(pg,new THREE.PointsMaterial({color:0xe0acc5,size:.023,transparent:true,opacity:.45}));scene.add(particles);
  let dragging=false,lastX=0,lastY=0,previous=0,elapsed=0;
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;bouquet.rotation.y+=(e.clientX-lastX)*.009;bouquet.rotation.x=THREE.MathUtils.clamp(bouquet.rotation.x+(e.clientY-lastY)*.003,-.3,.3);lastX=e.clientX;lastY=e.clientY;});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{dragging=false;});
  canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();bouquet.rotation.y+=e.key==='ArrowLeft'?-.15:.15;}});
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=camera.aspect<1?10.5:9.5;camera.fov=camera.aspect<.8?43:34;camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(canvas);resize();
  status.hidden=true;
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.textContent='The flowers need a moment. Refresh to bring them back.';});
  function animate(time){requestAnimationFrame(animate);const dt=Math.min((time-previous)/1000,.05);previous=time;if(document.hidden)return;
    if(!dragging){elapsed+=dt;bouquet.rotation.y+=dt*Math.PI*2/gift.rotationSeconds;bouquet.position.y=Math.sin(elapsed*.75)*.035;particles.rotation.y=elapsed*.018;}
    renderer.render(scene,camera);
  }requestAnimationFrame(animate);
} catch(error){status.hidden=false;status.textContent='Your bouquet needs WebGL. Please try an updated browser with hardware acceleration enabled.';console.error(error);}
