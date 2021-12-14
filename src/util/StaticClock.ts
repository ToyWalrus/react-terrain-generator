import { Clock } from 'three';

export default class StaticClock {
  clock: Clock;
  delta: number;

  constructor() {
    this.clock = new Clock();
    this.delta = 0;
    this.frame();
  }

  frame() {
    this.delta = this.clock.getDelta();
    requestAnimationFrame(this.frame.bind(this));
  }
}
