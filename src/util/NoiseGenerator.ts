import Random from 'random';
import Settings from './Settings';
import { interpolate } from './MathUtil';
import seedrandom from 'seedrandom';

export interface Dimension {
  width: number;
  height: number;
}

export default class NoiseGenerator {
  settings: Settings;
  whiteNoise: number[][];

  /**
   * NoiseGenerator constructor.
   * @param seed The seed desired to be used for the random noise generation.
   * @param width The desired width of the array.
   * @param height The desired height of the array.
   */
  constructor(generatorSettings: Settings) {
    this.settings = new Settings(generatorSettings);
    this.whiteNoise = this._generateWhiteNoise();
  }

  /**
   * Sets a new seed and updates the noise accordingly.
   * @param seed The new seed to use.
   */
  set seed(val: string) {
    this.settings.seed = val;
    this.whiteNoise = this._generateWhiteNoise();
  }

  get seed(): string {
    return this.settings.seed;
  }

  /**
   * Sets new dimensions and updates the noise accordingly.
   * @param width The new width to use.
   * @param height The new height to use.
   */
  set dimensions({ width, height }: Dimension) {
    this.settings.arrWidth = width;
    this.settings.arrHeight = height;
    this.whiteNoise = this._generateWhiteNoise();
  }

  get dimensions(): Dimension {
    return { width: this.settings.arrWidth, height: this.settings.arrHeight };
  }

  changeSettings(settings: Settings) {
    this.settings = settings;
    this.whiteNoise = this._generateWhiteNoise();
  }

  /**
   * The function to create the base noise array.
   * @return An array filled with values between 0.0 and 1.0
   */
  _generateWhiteNoise(): number[][] {
    const { width, height } = this.dimensions;
    const rand = this.seed !== undefined ? Random.clone(seedrandom(this.seed)).uniform() : Random.uniform();
    const noise: number[][] = [];

    for (let x = 0; x < width; ++x) {
      noise.push([]);
      for (let y = 0; y < height; ++y) {
        noise[x].push(rand());
      }
    }

    return noise;
  }

  /**
   * The function to generate a new array for each repetition for blending purposes.
   * @param octave The Kth iteration.
   * @return An array of values blended to the given octave.
   */
  _generateSmoothNoise(octave: number): number[][] {
    const { width, height } = this.dimensions;
    const smoothNoise: number[][] = [];

    const period = 1 << octave; // 2^octave
    const frequency = 1 / period;

    for (let x = 0; x < width; ++x) {
      smoothNoise.push([]);

      // Horizontal indices
      const hor1 = Math.floor(x / period) * period;
      const hor2 = (hor1 + period) % width; // Wrap by the width
      const horizontalBlend = (x - hor1) * frequency;

      for (let y = 0; y < height; ++y) {
        // Vertical indices
        const vert1 = Math.floor(y / period) * period;
        const vert2 = (vert1 + period) % height;
        const verticalBlend = (y - vert1) * frequency;

        // Blend top and bottom two corners
        const top = interpolate(this.whiteNoise[hor1][vert1], this.whiteNoise[hor2][vert1], horizontalBlend);
        const bottom = interpolate(this.whiteNoise[hor1][vert2], this.whiteNoise[hor2][vert2], horizontalBlend);

        // Final blend
        smoothNoise[x].push(interpolate(top, bottom, verticalBlend));
      }
    }

    return smoothNoise;
  }

  /**
   * The function to produce Perlin Noise.
   * @param octaveCount The number of iterations to use.
   * @return An array representing Perlin Noise.
   */
  generatePerlinNoise(octaveCount: number): number[][] {
    /*
     * To make the final array, you add weighted values of all the smooth noise arrays together. The weight used for each octave is called the amplitude.
     * Any values can be used for the amplitudes, with different effects.
     * A good starting point is to use a weight of 0.5 for the first octave, 0.25 for the next octave, and so on, multiplying the amplitude with 0.5 in each step.
     * After you have added all the noise values, you should normalise it by dividing it by the sum of all the amplitudes, so that all noise values lie between 0 and 1.
     */
    const { width, height } = this.dimensions;

    const smoothNoise: number[][][] = [];
    const persistance = this.settings.persistence;

    // Generate the smooth noise for each octave
    for (let i = 0; i < octaveCount; ++i) {
      smoothNoise.push(this._generateSmoothNoise(i));
    }

    const perlinNoise: number[][] = [];
    let amplitude = 1;
    let totalAmplitude = 0;

    // Blend noise together
    for (let octave = octaveCount - 1; octave >= 0; --octave) {
      amplitude *= persistance;
      totalAmplitude += amplitude;

      for (let x = 0; x < width; ++x) {
        if (x === perlinNoise.length) {
          perlinNoise.push([]);
        }

        for (let y = 0; y < height; ++y) {
          if (y === perlinNoise[x].length) {
            perlinNoise[x].push(0);
          }

          perlinNoise[x][y] += smoothNoise[octave][x][y] * amplitude;
        }
      }
    }

    // Normalize by total amplitude
    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; y++) {
        perlinNoise[x][y] /= totalAmplitude;
      }
    }

    return perlinNoise;
  }
}
