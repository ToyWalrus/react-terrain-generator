import { Vector3 } from 'three';
import Biome from './Biome';
import { getBiome } from '../util/MapInterpreter';

export interface TerrainPoint {
  point: Vector3;
  biome?: Biome;
}

export default class TerrainMap {
  map: TerrainPoint[][];
  highestPoint: number;
  lowestPoint: number;

  elevationMap: number[][];
  temperatureMap?: number[][];
  moistureMap?: number[][];

  constructor(elevationMap?: number[][], temperatureMap?: number[][], moistureMap?: number[][]) {
    this.map = [];
    this.highestPoint = Number.NEGATIVE_INFINITY;
    this.lowestPoint = Number.POSITIVE_INFINITY;

    const width = elevationMap ? elevationMap.length : 0;
    const height = elevationMap && elevationMap.length > 0 ? elevationMap[0].length : 0;

    const halfH = height / 2;
    const halfW = width / 2;

    if (
      elevationMap &&
      temperatureMap &&
      moistureMap &&
      (width !== temperatureMap.length ||
        width !== moistureMap.length ||
        height !== temperatureMap[0].length ||
        height !== moistureMap[0].length)
    ) {
      throw new Error('Given arrays must be of same dimensions for Terrain map');
    }

    this.elevationMap = elevationMap || [];
    this.temperatureMap = temperatureMap;
    this.moistureMap = moistureMap;

    if (elevationMap) {
      for (let col = 0; col < width; ++col) {
        this.map.push([]);
        for (let row = 0; row < height; ++row) {
          const x = col - halfW;
          const y = elevationMap[col][row];
          const z = row - halfH;

          const point: Vector3 = new Vector3(x, y, z);
          let biome: Biome | undefined;

          if (temperatureMap && moistureMap) {
            biome = getBiome(y, temperatureMap[col][row], moistureMap[col][row]);
          }

          this.map[col].push({ point, biome });

          this._updateHighestLowestPoints(y);
        }
      }
    }
  }

  get height() {
    return this.map.length > 0 ? this.map[0].length : 0;
  }

  get width() {
    return this.map.length;
  }

  /**
   * @private
   */
  _updateHighestLowestPoints(y: number) {
    if (y > this.highestPoint) {
      this.highestPoint = y;
    }
    if (y < this.lowestPoint) {
      this.lowestPoint = y;
    }
  }
}
