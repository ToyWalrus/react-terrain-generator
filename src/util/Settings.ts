import { Color } from 'three';

export default class Settings {
  arrWidth: number;
  arrHeight: number;
  seed?: number;
  octaves: number;
  persistance: number;
  gradientStart: Color;
  gradientEnd: Color;

  constructor(other?: Partial<Settings>) {
    this.seed = other?.seed;
    this.arrWidth = other?.arrWidth || 0;
    this.arrHeight = other?.arrHeight || 0;
    this.octaves = other?.octaves || 8;
    this.persistance = other?.persistance || 0.5;
    this.gradientStart = other?.gradientStart || new Color(0xfff);
    this.gradientEnd = other?.gradientEnd || new Color(0);
  }
}
