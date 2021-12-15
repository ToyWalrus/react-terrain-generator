import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Vector3,
} from 'three';
import { biomeColor } from '../terrain/Biome';
import TerrainMap from '../terrain/TerrainMap';
import * as THREE from 'three';

export interface IScaleSettings {
  scaleHeight: number;
  scaleLengthAndWidth: number;
}

export default class MeshGenerator {
  /**
   * @private
   */
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
    return wireframeOnly
      ? this._genWireframe(terrainMap, scaleSettings)
      : this._genQuads(terrainMap, scaleSettings);
  }

  /**
   * @private
   */
  static _genWireframe(terrainMap: TerrainMap, scaleSettings?: IScaleSettings): Line[] {
    const { width, height, map } = terrainMap;
    const frame = [];

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

      frame.push(rowVertices);
    }

    // Column lines
    for (let col = 0; col < width; ++col) {
      const colVertices: Vector3[] = [];

      for (let row = 0; row < height; ++row) {
        const point = this._scalePoint(map[row][col].point, scaleSettings);
        colVertices.push(point);
      }

      frame.push(colVertices);
    }

    const lines: Line[] = [];
    frame.forEach(vertices => {
      const geometry = new BufferGeometry().setFromPoints(vertices);
      const wireframeMaterial = new LineBasicMaterial({ color: this.wireframeColor });
      lines.push(new Line(geometry, wireframeMaterial));
    });

    return lines;
  }

  /**
   * @private
   */
  static _genQuads(terrainMap: TerrainMap, scaleSettings?: IScaleSettings): Mesh {
    const { width, height, map } = terrainMap;
    const geometry = new BufferGeometry();

    const vertices = [];
    const normals = [];
    const indices = [];
    const colors = [];

    for (let row = 0; row < height - 1; ++row) {
      for (let col = 0; col < width - 1; ++col) {
        const y1 = row;
        const y2 = row + 1;
        const x1 = col;
        const x2 = col + 1;

        const quadPoints = [
          this._scalePoint(map[x1][y1].point, scaleSettings), // bot left
          this._scalePoint(map[x1][y2].point, scaleSettings), // top left
          this._scalePoint(map[x2][y2].point, scaleSettings), // top right
          this._scalePoint(map[x2][y1].point, scaleSettings), // bot right
        ];

        const quadColors = [
          biomeColor(map[x1][y1].biome),
          biomeColor(map[x1][y2].biome),
          biomeColor(map[x2][y2].biome),
          biomeColor(map[x2][y1].biome),
        ];

        // Two triangles make up a quad
        const vl = vertices.length;
        indices.push(vl, vl + 1, vl + 3);
        indices.push(vl + 1, vl + 2, vl + 3);

        vertices.push(...quadPoints);
        normals.push(...quadPoints.map(p => p.normalize()));
        colors.push(...quadColors);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute(
      'position',
      new Float32BufferAttribute(
        vertices.flatMap(v => [v.x, v.y, v.z]),
        3,
      ),
    );
    geometry.setAttribute(
      'normal',
      new Float32BufferAttribute(
        normals.flatMap(n => [n.x, n.y, n.z]),
        3,
      ),
    );
    geometry.setAttribute(
      'color',
      new Float32BufferAttribute(
        colors.flatMap(c => [c.r, c.g, c.b]),
        3,
      ),
    );

    const mat = new MeshPhongMaterial({ side: DoubleSide, vertexColors: true });
    const mesh = new Mesh(geometry, mat);

    return mesh;
  }

  /**
   * @private
   */
  static _scalePoint(point: Vector3, scaleSettings?: IScaleSettings): Vector3 {
    if (!scaleSettings) return point;
    const p = new Vector3().copy(point);
    p.x *= scaleSettings.scaleLengthAndWidth;
    p.z *= scaleSettings.scaleLengthAndWidth;
    p.y *= scaleSettings.scaleHeight;
    return p;
  }
}
