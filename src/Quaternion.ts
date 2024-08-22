export class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public multiply(scalar: number) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
    this.z = this.z * scalar;
    this.w = this.w * scalar;
  }

  public toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  public toMatrix() {
    return [
      [
        1 - 2 * (this.y * this.y + this.z * this.z),
        2 * (this.x * this.y - this.z * this.w),
        2 * (this.x * this.z + this.y * this.w),
      ],
      [
        2 * (this.x * this.y + this.z * this.w),
        1 - 2 * (this.x * this.x + this.z * this.z),
        2 * (this.y * this.z - this.x * this.w),
      ],
      [
        2 * (this.x * this.z - this.y * this.w),
        2 * (this.y * this.z + this.x * this.w),
        1 - 2 * (this.x * this.x + this.y * this.y),
      ],
    ];
  }

  public getNormalized() {
    const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
    const normalized = this.toArray().map((value) => value / magnitude);
    return new Quaternion(normalized[0], normalized[1], normalized[2], normalized[3]);
  }
}
