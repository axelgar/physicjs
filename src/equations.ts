import { Matrix } from "mathjs";
import { Shape } from "./Shape";
import { Vector } from "./Vector";
import { STATE_SIZE } from "./constants";
import { Quaternion } from "./Quaternion";

/**
 * Cross product between two vectors, returns a new vector that is orthogonal (perpendicular) to both vectorA and vectorB.
 * The cross product is not commutative. The order of the elements in the cross product is important.
 * @param vectorA
 * @param vectorB
 * @returns Vector
 */
export function crossProduct(vectorA: Vector, vectorB: Vector) {
  return new Vector(
    vectorA.y * vectorB.z - vectorA.z * vectorB.y,
    vectorA.z * vectorB.x - vectorA.x * vectorB.z,
    vectorA.x * vectorB.y - vectorA.y * vectorB.x
  );
}

/**
 * Cross product between two vectors, returns a new vector that is orthogonal (perpendicular) to both vectorA and vectorB.
 * The cross product is not commutative. The order of the elements in the cross product is important.
 * @param vectorA
 * @param vectorB
 * @returns Vector
 */
export const addTwoVectors = (vectorA: Vector, vectorB: Vector) => {
  return new Vector(
    vectorA.x + vectorB.x,
    vectorA.y + vectorB.y,
    vectorA.z + vectorB.z
  );
};

export const subtractTwoVectors = (vectorA: Vector, vectorB: Vector) => {
  return new Vector(
    vectorA.x - vectorB.x,
    vectorA.y - vectorB.y,
    vectorA.z - vectorB.z
  );
};

export function multiplyVectorByScalar(scalar: number, vector: Vector) {
  return new Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
}

/**
 * Second law of Newton, F=m*a
 * @param mass
 * @param acceleration
 * @returns Force
 */
export function computeForce(mass: number, acceleration: Vector) {
  return multiplyVectorByScalar(mass, acceleration);
}

export function multiplyMatrixAndVector(matrix: Matrix, vector: Vector) {
  const tmp = matrix.map((row) =>
    row.reduce(
      (sum: number, value: number, index: number) =>
        sum + value * vector.toArray()[index],
      0
    )
  );
  console.log({ tmp });
  return new Vector(tmp.get([0, 0]), tmp.get([0, 1]), tmp.get([0, 2]));
}

export function multiplyTwoQuaternions(
  quaternionA: Quaternion,
  quaternionB: Quaternion
) {
  return new Quaternion(
    quaternionA.r * quaternionB.k +
      quaternionA.k * quaternionB.r +
      quaternionA.i * quaternionB.j -
      quaternionA.j * quaternionB.i,
    quaternionA.i * quaternionB.k +
      quaternionA.k * quaternionB.i +
      quaternionA.j * quaternionB.r -
      quaternionA.r * quaternionB.j,
    quaternionA.j * quaternionB.k +
      quaternionA.k * quaternionB.j +
      quaternionA.r * quaternionB.i -
      quaternionA.i * quaternionB.r,
    quaternionA.k * quaternionB.k -
      quaternionA.r * quaternionB.r -
      quaternionA.i * quaternionB.i -
      quaternionA.j * quaternionB.j
  );
}

function matrixToQuaternion(m: Matrix) {
  let q = { r: 0, i: 0, j: 0, k: 0 };
  let tr = m.get([0, 0]) + m.get([1, 1]) + m.get([2, 2]);
  let s;

  if (tr >= 0) {
    s = Math.sqrt(tr + 1);
    q.r = 0.5 * s;
    s = 0.5 / s;
    q.i = (m.get([2, 1]) - m.get([1, 2])) * s;
    q.j = (m.get([0, 2]) - m.get([2, 0])) * s;
    q.k = (m.get([1, 0]) - m.get([0, 1])) * s;
  } else {
    let i = 0;
    if (m.get([1, 1]) > m.get([0, 0])) i = 1;
    if (m.get([2, 2]) > m.get([i, i])) i = 2;

    switch (i) {
      case 0:
        s = Math.sqrt(m.get([0, 0]) - (m.get([1, 1]) + m.get([2, 2])) + 1);
        q.i = 0.5 * s;
        s = 0.5 / s;
        q.j = (m.get([0, 1]) + m.get([1, 0])) * s;
        q.k = (m.get([2, 0]) + m.get([0, 2])) * s;
        q.r = (m.get([2, 1]) - m.get([1, 2])) * s;
        break;
      case 1:
        s = Math.sqrt(m.get([1, 1]) - (m.get([2, 2]) + m.get([0, 0])) + 1);
        q.j = 0.5 * s;
        s = 0.5 / s;
        q.k = (m.get([1, 2]) + m.get([2, 1])) * s;
        q.i = (m.get([0, 1]) + m.get([1, 0])) * s;
        q.r = (m.get([0, 2]) - m.get([2, 0])) * s;
        break;
      case 2:
        s = Math.sqrt(m.get([2, 2]) - (m.get([0, 0]) + m.get([1, 1])) + 1);
        q.k = 0.5 * s;
        s = 0.5 / s;
        q.i = (m.get([2, 0]) + m.get([0, 2])) * s;
        q.j = (m.get([1, 2]) + m.get([2, 1])) * s;
        q.r = (m.get([1, 0]) - m.get([0, 1])) * s;
        break;
    }
  }

  return new Quaternion(q.r, q.i, q.j, q.k);
}

export function updatesShapesFromArray(y: number[], shapes: Shape[]): void {
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].fromArray(y.slice(i * STATE_SIZE, (i + 1) * STATE_SIZE));
  }
}
