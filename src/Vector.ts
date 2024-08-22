import { norm } from 'mathjs';

export class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static fromArray(array: [number, number, number]) {
    return new Vector(...array);
  }

  public getLength() {
    return norm([this.x, this.y, this.z]);
  }

  public getNorm() {
    return norm([this.x, this.y, this.z]);
  }

  public add(vector: Vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
    this.z = this.z + vector.z;
  }

  public subtract(vector: Vector) {
    this.x = this.x - vector.x;
    this.y = this.y - vector.y;
    this.z = this.z - vector.z;
  }

  public multiply(scalar: number) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
    this.z = this.z * scalar;
  }

  public dotProduct(vector: Vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  public toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}
