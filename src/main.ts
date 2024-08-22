import * as THREE from 'three';
import { Block } from './Block';
import { Vector } from './Vector';
import { STATE_SIZE } from './constants';
import { Quaternion } from './Quaternion';
import { ode, updatesShapesFromArray } from './equations';

const bodies = [
  new Block({
    mass: 10,
    depth: 1,
    width: 1,
    height: 1,
    L: new Vector(20, 30, 13),
    P: new Vector(20, 30, 13),
    q: new Quaternion(1, 1, 1, 1),
    x: new Vector(0, 0, 0),
  }),
];
const y0: number[] = new Array(STATE_SIZE * bodies.length).fill(0);
const yfinal: number[] = new Array(STATE_SIZE * bodies.length).fill(0);

function dydt(t: number, y: number[], ydot: number[]): void {
  updatesShapesFromArray(y, bodies);

  for (let i = 0; i < bodies.length; i++) {
    bodies[i].computeForces(t);
    const stateArray = bodies[i].ddtStateToArray();
    ydot.splice(i * STATE_SIZE, (i + 1) * STATE_SIZE, ...stateArray);
  }
}

for (let i = 0; i < bodies.length; i++) {
  const stateArray = bodies[i].ddtStateToArray();
  yfinal.splice(i * STATE_SIZE, (i + 1) * STATE_SIZE, ...stateArray);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

for (let body of bodies) {
  scene.add(body.shape);
}

camera.position.z = 10;

let t = 0;
function animate() {
  for (let i = 0; i < STATE_SIZE * bodies.length; i++) {
    y0[i] = yfinal[i];
  }

  // Perform ODE integration
  ode(y0, yfinal, STATE_SIZE * bodies.length, t, t + 1.0 / 60.0, dydt);
  // Copy yfinal back into state variables
  updatesShapesFromArray(yfinal, bodies);
  renderer.render(scene, camera);
  t++;
}

renderer.setAnimationLoop(animate);
