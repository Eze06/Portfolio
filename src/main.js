import './style.css';
import * as THREE from 'three';

import CircleType from "circletype";

const VinylElem = document.querySelector(".vinyl");
const VinylFrontElem = document.querySelector(".vinyl-front");
const VinylBackElem = document.querySelector(".vinyl-back");

const VinylDisc = document.querySelector(".vinyl-disc");
const VinylButtonParent = document.querySelector('.vinyl-button');

const TitleElem = document.querySelector("#title");

const mount = document.getElementById("webgl-bg");

const VinylButtonText = document.querySelector(".vinyl-button-text");

new CircleType(VinylButtonText);


if (!mount) throw new Error("Missing #webgl-bg");

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(mount.clientWidth, mount.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  mount.clientWidth / mount.clientHeight,
  0.1,
  60
);
camera.position.set(0, 1.2, 8);

const scene = new THREE.Scene();

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.12));

// Spotlight (main “studio” light)
const spot = new THREE.SpotLight(0xffffff, 2.0, 30, Math.PI * 0.18, 0.45, 1.2);
spot.position.set(0, 6.5, 4.0);
spot.target.position.set(0, 0.0, 0.0);
scene.add(spot);
scene.add(spot.target);

// A subtle rim light from behind
const rim = new THREE.DirectionalLight(0xffffff, 0.18);
rim.position.set(-3, 2, -6);
scene.add(rim);


// Flip Vinyl 
function FlipVinyl() {
  VinylElem.removeEventListener("mouseenter", PlayVinylHoverTween);
  VinylElem.removeEventListener("mouseleave", ReverseVinylHoverTween);

  gsap.to(TitleElem, { opacity: 0, duration: 0.25, overwrite: "auto" });
  gsap.to(VinylButtonParent, { opacity: 0, duration: 0.25, overwrite: "auto" });


  const tl = gsap.timeline({

    defaults: { overwrite: "auto" },


  });

  tl
    .to(VinylElem, {
      scale: 1.15,
      duration: 1,
      ease: "power2.out"
    })

    .to(VinylElem, {
      rotationZ: 0,
      duration: 1
    })

    .to(VinylFrontElem, {
      rotationY: -180,
      duration: 1,
      ease: "power2.inOut"

    })
    .to(VinylBackElem, {
      rotationY: 180,
      duration: 1,
      ease: "power2.inOut"

    }, "<0.5")

}

//Load Index Page
function LoadIndexPage() {
  console.log("Loading Index Page");

  const LoadDuration = 1.5;

  gsap.fromTo(VinylElem,
    {
      opacity: 0,
    },
    {
      ease: "power1.in",
      opacity: 1,
      duration: LoadDuration,
    }
  )

  gsap.fromTo(TitleElem,
    {
      opacity: 0,
    },
    {
      ease: "power1.in",
      opacity: 1,
      duration: LoadDuration,
    }
  )

  gsap.fromTo(VinylButtonParent,
    {
      opacity: 0,
    },
    {
      ease: "power1.in",
      opacity: 1,
      duration: LoadDuration,
    }
  )
}

//Hover for vinyls
const VinylHoverTween = gsap.to(VinylElem, {
  width: "51vh",
  height: "51vh",
  duration: 0.4,
  paused: true,
  overwrite: "auto"
});

function PlayVinylHoverTween() { VinylHoverTween.play(); };

function ReverseVinylHoverTween() { VinylHoverTween.reverse(); };


// Dust particles (Points)
const dustCount = 1800;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount; i++) {
  const i3 = i * 3;
  dustPos[i3 + 0] = (Math.random() - 0.5) * 14;   // x
  dustPos[i3 + 1] = Math.random() * 8 - 1.0;      // y
  dustPos[i3 + 2] = (Math.random() - 0.5) * 12;   // z
}

dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));

const dustMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  transparent: true,
  opacity: 0.55,
  depthWrite: false
});

const dust = new THREE.Points(dustGeo, dustMat);
scene.add(dust);

// Mouse parallax (subtle)
let mx = 0, my = 0;
window.addEventListener("mousemove", (e) => {
  mx = (e.clientX / window.innerWidth) * 2 - 1;
  my = (e.clientY / window.innerHeight) * 2 - 1;
});

// Resize
function resize() {
  const w = mount.clientWidth;
  const h = mount.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);

function damp(v, t, a) { return v + (t - v) * a; }

let t = 0;

var discRotatation = 0;
var discRotationSpeed = 0.5;
var vinylTextRotationSpeed = 0.1;
var vinylTextRotation = 0;



function animate() {
  requestAnimationFrame(animate);
  t += 0.01;


  // Parallax camera (tiny)
  camera.position.x = damp(camera.position.x, mx * 0.35, 0.05);
  camera.position.y = damp(camera.position.y, 1.2 + (-my * 0.20), 0.05);
  camera.lookAt(0, 0.2, 0);

  // Dust drift
  const pos = dust.geometry.attributes.position;
  for (let i = 0; i < dustCount; i++) {
    const i3 = i * 3;
    pos.array[i3 + 1] += Math.sin(t + i * 0.02) * 0.00035;
    pos.array[i3 + 0] += Math.cos(t + i * 0.015) * 0.00018;
  }
  pos.needsUpdate = true;

  discRotatation += discRotationSpeed;
  vinylTextRotation += vinylTextRotationSpeed;

  //Animate Vinly Disc
  VinylDisc.style.transform = `scale(0.22) rotate(${-discRotatation}deg)`;
  VinylButtonText.style.transform = `rotateZ(${vinylTextRotation}deg)`;

  renderer.render(scene, camera);
}
animate();

LoadIndexPage();

// //Add event listeners

// //Vinyl Event Listeners
VinylElem.addEventListener('click', FlipVinyl);
VinylElem.addEventListener('mouseenter', PlayVinylHoverTween);
VinylElem.addEventListener('mouseleave', ReverseVinylHoverTween);
VinylButtonParent.addEventListener('click', FlipVinyl);
