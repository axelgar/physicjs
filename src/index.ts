import { Vector } from "./Vector";
import { Particle } from "./Particle";
import { gravity } from "./utils/gravity-acceleration";
import {
  computeForce,
  multiplyVectorByScalar,
  updatesShapesFromArray,
} from "./equations";
import { randomBetween } from "./utils/random-number-between-range";
import { Shape } from "./Shape";
import { matrix } from "mathjs";
import { Quaternion } from "./Quaternion";
import { STATE_SIZE } from "./constants";
import { Block } from "./Block";

// const dx = derivative("x^2 + x", "x");

const particles: Particle[] = [];
const numberParticles = 1;

for (let i = 0; i < numberParticles; i++) {
  particles.push(
    new Particle(
      1,
      new Vector(
        randomBetween(1, 50),
        randomBetween(1, 50),
        randomBetween(1, 50)
      ),
      new Vector(0, 0)
    )
  );
}

function dydt(t: number, y: number[], ydot: number[]): void {
  const shapes = [
    new Block(
      10,
      new Vector(20, 30, 13),
      new Quaternion(1, 2, 3, 4),
      new Vector(20, 30, 13),
      new Vector(20, 30, 13)
    ),
  ];
  // Put data from y[] into Bodies[]
  updatesShapesFromArray(y, shapes);

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].computeForces(t);
    shapes[i].ddtStateToArray(ydot.slice(i * STATE_SIZE, (i + 1) * STATE_SIZE));
  }
}

dydt(1, [21, 34, 2], [0, 23, 5, 21]);
