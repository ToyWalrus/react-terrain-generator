import { Vector3 } from 'three';
import Biome from './Biome';
import { getBiome } from '../util/MapInterpreter';

export interface TerrainPoint {
  point: Vector3;
  biome?: Biome;
}

export default class TerrainMap {
  map: TerrainPoint[][];

  constructor(elevationMap?: number[][], temperatureMap?: number[][], moistureMap?: number[][]) {
    this.map = [];

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
}
