const maxScroll = Math.floor(document.body.scrollHeight - window.innerHeight);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.replaceChild(renderer.domElement, document.getElementById('model'));

var directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.x = -20;
directionalLight.position.y = 40;
directionalLight.z = 20;
scene.add(directionalLight);

var loader = new THREE.GLTFLoader();

var mesh;
var mixer;

loader.load(
  'model/Dragon.gltf',
  function(gltf) {
    document.getElementById('loading').style.visibility = 'hidden';
    mesh = gltf;
    scene.add(gltf.scene);
    mixer = new THREE.AnimationMixer(mesh.scene);
    var clips = mesh.animations;
    console.log(clips);
    var clip = THREE.AnimationClip.findByName(clips, 'Armature|Idel_New');
    var action = mixer.clipAction(clip);
    action.play();
    action.time = 0.3;
  },
  // called while loading is progressing
  function(xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  // called when loading has errors
  function(error) {
    console.log('An error happened');
  }
);

camera.position.y = 30;
calcZoom();
var clock = new THREE.Clock();

var animate = function() {
  requestAnimationFrame(animate);
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
};

animate();

function calcZoom() {
  const percentage = Math.floor((window.scrollY / maxScroll) * 100);
  const rx = 50;
  const rz = 50;
  const angle = percentage * (Math.PI / 180);
  const z = 50 + Math.floor(rz * Math.sin(angle));
  const x = -40 + Math.floor(rx * Math.cos(angle));
  document.getElementById('position').innerText = `${x}, ${z} ${percentage}%`;
  camera.position.z = z;
  camera.position.x = x;
  camera.lookAt(0, 10, 0);
}

window.addEventListener('scroll', ev => {
  calcZoom();
});
