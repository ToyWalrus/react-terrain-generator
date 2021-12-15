import React, { useEffect, useMemo, useRef } from 'react';
import { BufferGeometry, Camera, Line, LineBasicMaterial, Mesh, Scene, Vector3 } from 'three';
import TerrainMap from '../terrain/TerrainMap';
import MeshGenerator from '../util/MeshGenerator';
import CanvasRenderer from './CanvasRenderer';

interface IPlaneDrawerProps {
  scene: Scene;
  camera: Camera;
  terrainMap: TerrainMap;

  wireframeOnly: boolean;
  autoRotate: boolean;

  canvasWidth: number;
  canvasHeight: number;
}

const PlaneDrawer = (props: IPlaneDrawerProps) => {
  usePlaneDrawerContext(props);

  return (
    <div>
      <CanvasRenderer
        scene={props.scene}
        camera={props.camera}
        width={props.canvasWidth}
        height={props.canvasHeight}
        autoRotate={props.autoRotate}
        worldFocusPoint={MeshGenerator.meshCenterPoint}
      />
    </div>
  );
};

const usePlaneDrawerContext = ({ scene, terrainMap, wireframeOnly }: IPlaneDrawerProps) => {
  const genMeshForScene = () => {
    const result = MeshGenerator.generateMeshFor(terrainMap, wireframeOnly);
    if (wireframeOnly) {
      const lines = result as Line[];
      lines.forEach(line => scene.add(line));
    } else {
      scene.add(result as Mesh);
    }
  };

  useEffect(genMeshForScene, [terrainMap, wireframeOnly]);
};

export default PlaneDrawer;
