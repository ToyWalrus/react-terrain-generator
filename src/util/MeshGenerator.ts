import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  Vector3,
} from 'three';
import { biomeColor } from '../terrain/Biome';
import TerrainMap from '../terrain/TerrainMap';

export interface IScaleSettings {
  scaleHeight: number;
  scaleLengthAndWidth: number;
}

export default class MeshGenerator {
  /**
   * @private
   */
  static _meshCenterPoint: Vector3 = new Vector3();
  static wireframeColor: Color = new Color(0xababab);
  static get meshCenterPoint() {
    return this._meshCenterPoint;
  }

  static generateMeshFor(terrainMap: TerrainMap, scaleSettings?: IScaleSettings) {
    return {
      wireframe: this._genWireframe(terrainMap, scaleSettings),
      mesh: this._genQuads(terrainMap, scaleSettings),
    };
  }

  /**
   * @private
   */
  static _genWireframe(terrainMap: TerrainMap, scaleSettings?: IScaleSettings): Line[] {
    const { width, height, map } = terrainMap;
    const frame = [];
    const heightOffset = this._getHeightOffset(terrainMap, scaleSettings?.scaleHeight);

    // Row lines
    for (let y = 0; y < height; ++y) {
      const rowVertices: Vector3[] = [];

      for (let x = 0; x < width; ++x) {
        const point = this._scalePoint(map[x][y].point, scaleSettings);

        if (y === Math.floor(height / 2) && x === Math.floor(width / 2)) {
          MeshGenerator._meshCenterPoint = new Vector3().copy(point);
        }

        rowVertices.push(point);
      }

      frame.push(rowVertices);
    }

    // Column lines
    for (let x = 0; x < width; ++x) {
      const colVertices: Vector3[] = [];

      for (let y = 0; y < height; ++y) {
        const point = this._scalePoint(map[x][y].point, scaleSettings);
        colVertices.push(point);
      }

      frame.push(colVertices);
    }

    const lines: Line[] = [];
    frame.forEach(vertices => {
      const geometry = new BufferGeometry().setFromPoints(
        vertices.map(v => this._translatePoint(v, heightOffset)),
      );
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
    const heightOffset = this._getHeightOffset(terrainMap, scaleSettings?.scaleHeight);

    const vertices = [];
    const normals = [];
    const indices = [];
    const colors = [];

    for (let y = 0; y < height - 1; ++y) {
      for (let x = 0; x < width - 1; ++x) {
        const botLeft = map[x][y];
        const botRight = map[x + 1][y];
        const topRight = map[x + 1][y + 1];
        const topLeft = map[x][y + 1];

        const quadPoints = [
          this._scalePoint(botLeft.point, scaleSettings),
          this._scalePoint(botRight.point, scaleSettings),
          this._scalePoint(topRight.point, scaleSettings),
          this._scalePoint(topLeft.point, scaleSettings),
        ];

        const quadColors = [
          biomeColor(botLeft.biome),
          biomeColor(botRight.biome),
          biomeColor(topRight.biome),
          biomeColor(topLeft.biome),
        ];

        // Two triangles make up a quad
        const vl = vertices.length;
        indices.push(vl, vl + 1, vl + 3);
        indices.push(vl + 1, vl + 2, vl + 3);

        vertices.push(...quadPoints);
        normals.push(...quadPoints.map(p => new Vector3(0, 1, 0)));
        colors.push(...quadColors);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute(
      'position',
      new Float32BufferAttribute(
        vertices.map(v => this._translatePoint(v, heightOffset)).flatMap(v => [v.x, v.y, v.z]),
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

  /**
   * @private
   */
  static _getHeightOffset({ highestPoint, lowestPoint }: TerrainMap, scaleHeight?: number) {
    const heightScale = scaleHeight || 1;
    return (highestPoint * heightScale - lowestPoint * heightScale) / 2;
  }

  /**
   * @private
   */
  static _translatePoint({ x, y, z }: Vector3, amount: number): Vector3 {
    return new Vector3(x, y - amount, z);
  }
}
