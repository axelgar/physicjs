import { Vector } from "./Vector";
import { Quaternion } from "./Quaternion";
import { inv, Matrix, multiply, transpose } from "mathjs";
import { multiplyMatrixAndVector, multiplyTwoQuaternions } from "./equations";

export abstract class Shape {
  // Constant quantities
  private mass: number;
  Ibody: Matrix; // body-space inertia tensor
  private Ibodyinv: Matrix; // inverse body-space inertia tensor

  // State variables
  private position: Vector;
  private q: Quaternion;
  private P: Vector;
  private L: Vector;

  // Derived quantities (auxiliary variables)
  Iinv!: Matrix;
  v!: Vector;
  omega!: Vector; // Angular velocity

  // Computed quantities
  force!: Vector;
  torque!: Vector;

  constructor(
    mass: number,
    Ibody: Matrix,
    position: Vector,
    q: Quaternion,
    P: Vector,
    L: Vector
  ) {
    this.q = q;
    this.P = P;
    this.L = L;
    this.mass = mass;
    this.Ibody = Ibody;
    this.position = position;
    this.Ibodyinv = inv(Ibody);
    this.derivateQuantities();
  }

  derivateQuantities() {
    // v(t) = P(t) / M
    const v = this.P.toArray().map((p) => p / this.mass);
    this.v = new Vector(v[0], v[1], v[2]);

    // I−1(t) = R(t) * Ibodyinv * Transpose(R(t))
    const R = this.q.getNormalized().toMatrix();
    this.Iinv = multiply(multiply(R, this.Ibodyinv), transpose(R));

    // ω(t) = I−1(t) * L(t)
    this.omega = multiplyMatrixAndVector(this.Iinv, this.L);
  }

  toArray() {
    let array = [];

    array.push(this.position.x);
    array.push(this.position.y);
    array.push(this.position.z);

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

    this.position.x = array[index++];
    this.position.y = array[index++];
    this.position.z = array[index++];

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

  ddtStateToArray(ydot: number[]) {
    // Copy d/dt x(t) = v(t) into ydot
    ydot.push(this.v.x);
    ydot.push(this.v.y);
    ydot.push(this.v.z);

    // Compute R˙(t) = ω(t) * R(t)
    const qDot = multiplyTwoQuaternions(
      new Quaternion(0, ...this.omega.toArray()),
      this.q
    );
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
  }
}
