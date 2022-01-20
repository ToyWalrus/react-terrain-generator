import Random from 'random';
import { Color } from 'three';

export default class Settings {
  arrWidth: number;
  arrHeight: number;
  seed: string;
  octaves: number;
  persistence: number;
  gradientStart: Color;
  gradientEnd: Color;

  constructor(other?: Partial<Settings>) {
    this.seed = other?.seed || Random.integer(1000000, 1000000000).toString();
    this.arrWidth = other?.arrWidth || 0;
    this.arrHeight = other?.arrHeight || 0;
    this.octaves = other?.octaves || 8;
    this.persistence = other?.persistence || 0.5;
    this.gradientStart = other?.gradientStart || new Color(0xfff);
    this.gradientEnd = other?.gradientEnd || new Color(0);
  }
}
