import { Vector3 } from 'three';
import Biome from './Biome';
import { getBiome } from '../util/MapInterpreter';

export interface TerrainPoint {
  point: Vector3;
  biome?: Biome;
}

export default class TerrainMap {
  map: TerrainPoint[];
  height: number;
  width: number;

  constructor(elevationMap?: number[][], temperatureMap?: number[][], moistureMap?: number[][]) {
    this.map = [];
    this.width = elevationMap ? elevationMap.length : 0;
    this.height = elevationMap && elevationMap.length > 0 ? elevationMap[0].length : 0;

    const halfH = this.height / 2;
    const halfW = this.width / 2;

    if (
      elevationMap &&
      temperatureMap &&
      moistureMap &&
      (this.width !== temperatureMap.length ||
        this.width !== moistureMap.length ||
        this.height !== temperatureMap[0].length ||
        this.height !== moistureMap[0].length)
    ) {
      throw new Error('Given arrays must be of same dimensions for Terrain map');
    }

    if (elevationMap) {
      for (let col = 0; col < this.width; ++col) {
        for (let row = 0; row < this.height; ++row) {
          const x = col - halfW;
          const y = elevationMap[col][row];
          const z = row - halfH;

          const point: Vector3 = new Vector3(x, y, z);
          let biome: Biome | undefined;

          if (temperatureMap && moistureMap) {
            biome = getBiome(y, temperatureMap[col][row], moistureMap[col][row]);
          }

          this.map.push({ point, biome });
        }
      }
    }
  }

  getPoint(x: number, y: number): TerrainPoint {
    return this.map[x * this.width + y];
  }
}
