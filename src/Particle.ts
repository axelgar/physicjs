import { Vector } from "./Vector";

export class Particle {
  private mass;
  private position;
  private velocity;

  constructor(mass: number, position: Vector, velocity: Vector) {
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
  }

  public getMass() {
    return this.mass;
  }

  public getVelocity() {
    return this.velocity;
  }

  public getPosition() {
    return this.position;
  }

  public updateVelocity(acceleration: Vector) {
    this.velocity.add(acceleration);
  }

  public updatePosition(velocity: Vector) {
    this.position.add(velocity);
  }
}
