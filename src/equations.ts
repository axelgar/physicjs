import { Body } from './Body';
import { Vector } from './Vector';
import { STATE_SIZE } from './constants';
import { Quaternion } from './Quaternion';

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
export function addTwoVectors(vectorA: Vector, vectorB: Vector) {
  return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z);
}

export function subtractTwoVectors(vectorA: Vector, vectorB: Vector) {
  return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y, vectorA.z - vectorB.z);
}

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

export function multiplyTwoQuaternions(quaternionA: Quaternion, quaternionB: Quaternion) {
  return new Quaternion(
    quaternionA.x * quaternionB.w +
      quaternionA.w * quaternionB.x +
      quaternionA.y * quaternionB.z -
      quaternionA.z * quaternionB.y,
    quaternionA.y * quaternionB.w +
      quaternionA.w * quaternionB.y +
      quaternionA.z * quaternionB.x -
      quaternionA.x * quaternionB.z,
    quaternionA.z * quaternionB.w +
      quaternionA.w * quaternionB.z +
      quaternionA.x * quaternionB.y -
      quaternionA.y * quaternionB.x,
    quaternionA.w * quaternionB.w -
      quaternionA.x * quaternionB.x -
      quaternionA.y * quaternionB.y -
      quaternionA.z * quaternionB.z
  );
}

export function updatesShapesFromArray(y: number[], shapes: Body[]): void {
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].fromArray(y.slice(i * STATE_SIZE, (i + 1) * STATE_SIZE));
  }
}

/**
 * The RK4 method is a commonly used technique to solve ODEs numerically.
 * The basic idea is to approximate the solution by evaluating the derivative
 * at several points within the time step and then taking a weighted average.
 * @param y0 Initial state array
 * @param yfinal Final state array to be updated
 * @param size Size of the state array
 * @param t Current time
 * @param tNext Next time point
 * @param dydt Function to compute the derivative
 */
export function ode(
  y0: number[],
  yfinal: number[],
  size: number,
  t: number,
  tNext: number,
  dydt: (t: number, y: number[], ydot: number[]) => void
): void {
  const dt = tNext - t; // Time step

  const k1 = new Array(size).fill(0);
  const k2 = new Array(size).fill(0);
  const k3 = new Array(size).fill(0);
  const k4 = new Array(size).fill(0);
  const tempState = new Array(size).fill(0);

  // k1 = dt * f(t, y)
  dydt(t, y0, k1);
  for (let i = 0; i < size; i++) {
    k1[i] *= dt;
    tempState[i] = y0[i] + 0.5 * k1[i];
  }

  // k2 = dt * f(t + dt/2, y + k1/2)
  dydt(t + dt / 2, tempState, k2);
  for (let i = 0; i < size; i++) {
    k2[i] *= dt;
    tempState[i] = y0[i] + 0.5 * k2[i];
  }

  // k3 = dt * f(t + dt/2, y + k2/2)
  dydt(t + dt / 2, tempState, k3);
  for (let i = 0; i < size; i++) {
    k3[i] *= dt;
    tempState[i] = y0[i] + k3[i];
  }

  // k4 = dt * f(t + dt, y + k3)
  dydt(t + dt, tempState, k4);
  for (let i = 0; i < size; i++) {
    k4[i] *= dt;
  }

  // Update yfinal with the weighted sum of the slopes
  for (let i = 0; i < size; i++) {
    yfinal[i] = y0[i] + (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6;
  }
}
