// import { Body } from './Body';
// import { matrix } from 'mathjs';
// import { Vector } from './Vector';
// import { Quaternion } from './Quaternion';

// type SphereParams = {
//   L: Vector;
//   P: Vector;
//   x: Vector;
//   mass: number;
//   q: Quaternion;
//   radius: number;
// };

// export class Sphere extends Body {
//   constructor({ mass, x, q, P, L, radius }: SphereParams) {
//     const value = (2 / 5) * mass * (radius ^ 2);
//     const Ibody = matrix([
//       [value, 0, 0],
//       [0, value, 0],
//       [0, 0, value],
//     ]);

//     super({
//       x,
//       q,
//       P,
//       L,
//       mass,
//       Ibody,
//       force: new Vector(1, 1, 1),
//       torque: new Vector(0, 0, 1),
//     });
//   }

//   computeForces(t: number) {
//     this.force.x = -this.v.x * 0.1; // Example damping force
//     this.force.y = -this.v.y * 0.1; // Example damping force
//     this.force.z = -this.v.z * 0.1; // Example damping force

//     this.torque.x = this.Ibody.get([0, 0]) * this.omega.x;
//     this.torque.y = this.Ibody.get([1, 1]) * this.omega.y;
//     this.torque.z = this.Ibody.get([2, 2]) * this.omega.z;
//   }
// }
