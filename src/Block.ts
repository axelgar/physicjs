import { Shape } from "./Shape";
import { Vector } from "./Vector";
import { Quaternion } from "./Quaternion";
import { matrix, multiply } from "mathjs";

export class Block extends Shape {
  constructor(
    mass: number,
    position: Vector,
    q: Quaternion,
    P: Vector,
    L: Vector
  ) {
    const Ibody = multiply(
      mass / 12,
      matrix([
        [(position.y ^ 2) + (position.z ^ 2), 0, 0],
        [0, (position.x ^ 2) + (position.z ^ 2), 0],
        [0, 0, (position.x ^ 2) + (position.y ^ 2)],
      ])
    );
    super(mass, Ibody, position, q, P, L);
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
