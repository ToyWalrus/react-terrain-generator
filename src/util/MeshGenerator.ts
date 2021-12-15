import { BufferGeometry, Color, Line, LineBasicMaterial, Vector3 } from 'three';
import TerrainMap from '../terrain/TerrainMap';

export interface IScaleSettings {
  scaleHeight: number;
  scaleLengthAndWidth: number;
}

export default class MeshGenerator {
  static _meshCenterPoint: Vector3 = new Vector3();
  static wireframeColor: Color = new Color(12, 12, 12);
  static get meshCenterPoint() {
    return this._meshCenterPoint;
  }

  static generateMeshFor(
    terrainMap: TerrainMap,
    wireframeOnly: boolean = false,
    scaleSettings?: IScaleSettings,
  ) {
    const wireframeMaterial = new LineBasicMaterial({ color: this.wireframeColor });
    const lines: Line[] = [];
    const wireframeVerts = this._genWireframe(terrainMap, scaleSettings);

    wireframeVerts.forEach(vertices => {
      const geometry = new BufferGeometry().setFromPoints(vertices);
      lines.push(new Line(geometry, wireframeMaterial));
    });

    return lines;
  }

  static _genWireframe(terrainMap: TerrainMap, scaleSettings?: IScaleSettings): Vector3[][] {
    const { width, height, map } = terrainMap;
    const mesh = [];

    // Row lines
    for (let row = 0; row < height; ++row) {
      const rowVertices: Vector3[] = [];

      for (let col = 0; col < width; ++col) {
        const point = this._scalePoint(map[row][col].point, scaleSettings);

        if (row === Math.floor(height / 2) && col === Math.floor(width / 2)) {
          MeshGenerator._meshCenterPoint = new Vector3().copy(point);
        }

        rowVertices.push(point);
      }

      mesh.push(rowVertices);
    }

    // Column lines
    for (let col = 0; col < width; ++col) {
      const colVertices: Vector3[] = [];

      for (let row = 0; row < height; ++row) {
        const point = this._scalePoint(map[row][col].point, scaleSettings);
        colVertices.push(point);
      }

      mesh.push(colVertices);
    }

    return mesh;
  }

  static _scalePoint(point: Vector3, scaleSettings?: IScaleSettings): Vector3 {
    if (!scaleSettings) return point;
    const p = new Vector3().copy(point);
    p.x *= scaleSettings.scaleLengthAndWidth;
    p.z *= scaleSettings.scaleLengthAndWidth;
    p.y *= scaleSettings.scaleHeight;
    return p;
  }
}
