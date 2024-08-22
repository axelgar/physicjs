import { Vector } from './Vector';
import * as THREE from 'three';
import { Quaternion } from './Quaternion';
import { multiplyTwoQuaternions } from './equations';
import { flatten, inv, Matrix, multiply, transpose } from 'mathjs';

type BodyParams = {
  P: Vector;
  L: Vector;
  x: Vector;
  mass: number;
  Ibody: Matrix;
  q: Quaternion;
  force: Vector;
  torque: Vector;
  shape: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
};

export abstract class Body {
  // Constant quantities
  Ibody; // body-space inertia tensor
  private mass;
  private Ibodyinv; // inverse body-space inertia tensor

  // State variables
  x; // Location of the center of mass in world space
  private q; // Orientation
  private P; // Linear momentum
  private L; // Total angular momentum

  // Derived quantities (auxiliary variables)
  Iinv; // Inverse Inertia Tensor
  v; // Velocity vector
  omega; // Angular velocity

  // Computed quantities
  force;
  torque;

  // Renderer
  shape;

  constructor({ mass, Ibody, torque, force, x, q, P, L, shape }: BodyParams) {
    this.q = q;
    this.P = P;
    this.L = L;
    this.x = x;
    this.mass = mass;
    this.Ibody = Ibody;
    this.shape = shape;
    this.force = force;
    this.torque = torque;
    this.Ibodyinv = inv(Ibody);

    // v(t) = P(t) / M
    const v = this.P.toArray().map((p) => p / this.mass);
    this.v = new Vector(v[0], v[1], v[2]);

    // I−1(t) = R(t) * Ibodyinv * Transpose(R(t))
    const R = this.q.getNormalized().toMatrix();
    this.Iinv = multiply(multiply(R, this.Ibodyinv), transpose(R));

    // ω(t) = I−1(t) * L(t)
    const oneDimensionMatrix = flatten(multiply(this.Iinv, this.L.toArray()));
    this.omega = Vector.fromArray(oneDimensionMatrix.toArray() as [number, number, number]);
  }

  derivateQuantities() {
    // v(t) = P(t) / M
    const v = this.P.toArray().map((p) => p / this.mass);
    this.v = new Vector(v[0], v[1], v[2]);

    // I−1(t) = R(t) * Ibodyinv * Transpose(R(t))
    const R = this.q.getNormalized().toMatrix();
    this.Iinv = multiply(multiply(R, this.Ibodyinv), transpose(R));

    // ω(t) = I−1(t) * L(t)
    const oneDimensionMatrix = flatten(multiply(this.Iinv, this.L.toArray()));
    this.omega = Vector.fromArray(oneDimensionMatrix.toArray() as [number, number, number]);

    this.shape.rotation.x = this.omega.x;
    this.shape.rotation.y = this.omega.y;
    this.shape.rotation.z = this.omega.z;
    this.shape.position.x = this.x.x;
    this.shape.position.y = this.x.y;
    this.shape.position.z = this.x.z;
  }

  toArray() {
    let array = [];

    array.push(this.x.x);
    array.push(this.x.y);
    array.push(this.x.z);

    array.push(this.q.r);
    array.push(this.q.i);
    array.push(this.q.j);
    array.push(this.q.k);

    array.push(this.P.x);
    array.push(this.P.y);
    array.push(this.P.z);

    array.push(this.L.x);
    array.push(this.L.y);
    array.push(this.L.z);

    return array;
  }

  fromArray(array: number[]) {
    let index = 0;

    this.x.x = array[index++];
    this.x.y = array[index++];
    this.x.z = array[index++];

    this.q.r = array[index++];
    this.q.i = array[index++];
    this.q.j = array[index++];
    this.q.k = array[index++];

    this.P.x = array[index++];
    this.P.y = array[index++];
    this.P.z = array[index++];

    this.L.x = array[index++];
    this.L.y = array[index++];
    this.L.z = array[index++];

    this.derivateQuantities();
  }

  ddtStateToArray() {
    const ydot = [];
    // Copy d/dt x(t) = v(t) into ydot
    ydot.push(this.v.x);
    ydot.push(this.v.y);
    ydot.push(this.v.z);

    // Compute q˙(t) = ω(t) * q(t)
    const qDot = multiplyTwoQuaternions(new Quaternion(0, ...this.omega.toArray()), this.q);
    qDot.multiply(0.5);

    ydot.push(qDot.r);
    ydot.push(qDot.i);
    ydot.push(qDot.j);
    ydot.push(qDot.k);

    // Copy d/dt P(t) = F(t) into ydot
    ydot.push(this.force.x);
    ydot.push(this.force.y);
    ydot.push(this.force.z);

    // Copy d/dt L(t) = τ(t) into ydot
    ydot.push(this.torque.x);
    ydot.push(this.torque.y);
    ydot.push(this.torque.z);

    return ydot;
  }
}
