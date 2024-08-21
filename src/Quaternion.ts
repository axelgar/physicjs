export class Quaternion {
  r: number;
  i: number;
  j: number;
  k: number;

  constructor(r: number, i: number, j: number, k: number) {
    this.r = r;
    this.i = i;
    this.j = j;
    this.k = k;
  }

  public multiply(scalar: number) {
    this.r = this.r * scalar;
    this.i = this.i * scalar;
    this.j = this.j * scalar;
    this.k = this.k * scalar;
  }

  public toArray(): [number, number, number, number] {
    return [this.r, this.i, this.j, this.k];
  }

  public toMatrix() {
    return [
      [
        1 - 2 * (this.i * this.i + this.j * this.j),
        2 * (this.r * this.i - this.j * this.k),
        2 * (this.r * this.j + this.i * this.k),
      ],
      [
        2 * (this.r * this.i + this.j * this.k),
        1 - 2 * (this.r * this.r + this.j * this.j),
        2 * (this.i * this.j - this.r * this.k),
      ],
      [
        2 * (this.r * this.j - this.i * this.k),
        2 * (this.i * this.j + this.r * this.k),
        1 - 2 * (this.r * this.r + this.i * this.i),
      ],
    ];
  }

  public getNormalized() {
    const magnitude = Math.sqrt(
      this.r ** 2 + this.i ** 2 + this.j ** 2 + this.k ** 2
    );
    const normalized = this.toArray().map((value) => value / magnitude);
    return new Quaternion(
      normalized[0],
      normalized[1],
      normalized[2],
      normalized[3]
    );
  }
}
