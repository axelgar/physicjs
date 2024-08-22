import { Body } from './Body';
import * as THREE from 'three';
import { Vector } from './Vector';
import { Quaternion } from './Quaternion';
import { matrix, multiply } from 'mathjs';

type BlockParams = {
  L: Vector;
  P: Vector;
  x: Vector;
  mass: number;
  q: Quaternion;
  width: number;
  depth: number;
  height: number;
};

export class Block extends Body {
  constructor({ mass, x, q, P, L, width, height, depth }: BlockParams) {
    const Ibody = multiply(
      mass / 12,
      matrix([
        [(height ^ 2) + (depth ^ 2), 0, 0],
        [0, (width ^ 2) + (depth ^ 2), 0],
        [0, 0, (width ^ 2) + (height ^ 2)],
      ])
    );
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const shape = new THREE.Mesh(geometry, material);

    super({
      x,
      q,
      P,
      L,
      mass,
      Ibody,
      shape,
      force: new Vector(0, 0, 0),
      torque: new Vector(0, 0, 1),
    });
  }

  computeForces(t: number) {
    this.force.x = -this.v.x * 0.1; // Example damping force
    this.force.y = -this.v.y * 0.1; // Example damping force
    this.force.z = -this.v.z * 0.1; // Example damping force

    this.torque.x = this.Ibody.get([0, 0]) * this.omega.x;
    this.torque.y = this.Ibody.get([1, 1]) * this.omega.y;
    this.torque.z = this.Ibody.get([2, 2]) * this.omega.z;
  }
}
