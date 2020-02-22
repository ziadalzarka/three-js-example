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
  undefined,
  function(error) {
    console.error(error);
  }
);

camera.position.y = 20;
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
  const percentage = window.scrollY / maxScroll;
  camera.position.z = 50 + Math.floor(percentage * 100);
}

window.addEventListener('scroll', ev => {
  calcZoom();
});
