import './index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
//npm init @vitejs/app
//npx create-vite-app
//npm install
//npm install --save three
//npm install --save dat.gui




function init() {
    let radiusEarth = 1;

    const PlanetsName = ['sun','mercury', 'venuse', 'earth', 'mars', 'jupiter','saturn','uranus','neptune'] 
    const PlanetsColor = ['yellow','#b79c94', '#e6bfa5', '#1976d2', '#c1440e', '#d7b25a','#f0e1a1','#87ceeb','#2b65ec'] 
    let Planets = [];
    const radiusCoefficients = [ 0.3829, 0.949, 1, 0.532, 6.97, 5.14, 3.98, 3.86];
    const PlanetsRadius = [6.9, ...radiusCoefficients.map((coeff) => radiusEarth * coeff)];
    const PlanetsDistance = [0,0.39,0.72,1,1.52,5.20,9.58, 19.22, 30.05];
    let CircleMass = [];



  const canvas = document.querySelector('canvas.webgl')
  const gui = new dat.GUI();

  const textureLoader = new THREE.TextureLoader()

  
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-3,3,75);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

 
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const Light = new THREE.AmbientLight(0xffffff, 0.7 );
scene.add(Light);


const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF  } ); 

const CreateCircle = (radius)=>{
  const geometry = new THREE.TorusGeometry( radius, 0.008, 32, 100 ); 

  const torus = new THREE.Mesh( geometry, material ); 
  scene.add( torus );
  return torus
}


const CreateMesh = (name,radius,color)=>{
   name = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshStandardMaterial({
        emissive: color,
        emissiveMap: textureLoader.load(`/src/assets/${name}.jpg`),
        emissiveIntensity : 0.7
    })
  )
  name.castShadow = true
  name.position.y = 0
  name.position.x = 0

  scene.add(name)
  
  return name

}
let countPlanet =0;
for (let i = 0; i < PlanetsName.length; i++) {
  if(i !== 0){
  Planets[i] = CreateMesh(PlanetsName[i],PlanetsRadius[i],PlanetsColor[i]);
  CircleMass[i] = CreateCircle(countPlanet += PlanetsRadius[i] + 10);

  }
  else{
    Planets[i] = CreateMesh(PlanetsName[i],PlanetsRadius[i],PlanetsColor[i]);
    CircleMass[i] = 0;
  }
}

const sunLight = new THREE.PointLight('yellow', 0.8,300,5);
scene.add(sunLight);
Planets[0].position.set(0,0,0);

// Particless

const countNumParticles = 5000;

const positions =new Float32Array(countNumParticles*3)

for (let i = 0; i < countNumParticles * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200;
  
}

 let particGeometry = new THREE.BufferGeometry();
 particGeometry.setAttribute('position',new THREE.BufferAttribute(positions, 3));

 const particlesMat = new THREE.PointsMaterial();
 particlesMat.size = 0.1;
 particlesMat.sizeAttenuation = true;

 const particles = new THREE.Points(particGeometry,particlesMat)
 scene.add(particles);














  const clock = new THREE.Clock()

  let count =0;

  const randomNumbers = [];

  for (let i = 0; i < 9; i++) {
    const randomNumber = Math.random() - 0.5// Генерируем случайное число от -0.5 до 0.5
    randomNumbers.push(randomNumber); // Добавляем число в массив
  }
  const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

  



    for (let i = 0; i < Planets.length; i++) {
      if(i !== 0){
        
        let dist =count += PlanetsRadius[i] + 10
      Planets[i].position.x = Math.cos(randomNumbers[i] * elapsedTime * 0.3) * dist;
      Planets[i].position.y = Math.sin(randomNumbers[i] * elapsedTime * 0.3) * dist ;
      
      }
      else if(i !== 9){
        let dist =count += PlanetsRadius[i] + 10
        Planets[i].position.x = Math.cos(randomNumbers[i] *elapsedTime*  0.3) * dist;
        Planets[i].position.y =Math.sin(randomNumbers[i] *elapsedTime* 0.3) * dist ;
        count = 0;
      }
      
      Planets[0].position.x = 0;
      Planets[0].position.y = 0;
      Planets[0].position.z = 0;
    }


    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
}
init();