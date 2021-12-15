import React, { useEffect, useMemo, useRef } from 'react';
import { BufferGeometry, Camera, Line, LineBasicMaterial, Scene, Vector3 } from 'three';
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
        worldFocusPoint={new Vector3()}
      />
    </div>
  );
};

let isFirstRender = true;

const usePlaneDrawerContext = ({ scene, terrainMap }: IPlaneDrawerProps) => {
  // const wireframe = useRef(new Line());
  const geometry = useMemo(() => new BufferGeometry(), []);
  const getTerrainPoints = () => terrainMap.map.flatMap(points => points.map(({ point }) => point));

  useEffect(() => {
    isFirstRender = true;
    // const wireframeMat = new LineBasicMaterial({ color: 0x3c4c5c });
    // const planeGeometry = geometry.setFromPoints(getTerrainPoints());

    // wireframe.current = new Line(planeGeometry, wireframeMat);
    const lines = MeshGenerator.generateMeshFor(terrainMap);
    lines.forEach(line => {
      scene.add(line);
    });
  });

  // useEffect(() => {
  //   if (!isFirstRender) {
  //     const { geometry } = wireframe.current;
  //     const terrainPoints = getTerrainPoints();

  //     geometry.setDrawRange(0, terrainPoints.length * 3);
  //     geometry.setFromPoints(terrainPoints);

  //     geometry.computeBoundingBox();
  //     geometry.computeBoundingSphere();
  //     geometry.attributes.position.needsUpdate = true;
  //   }
  //   isFirstRender = false;
  // }, [terrainMap]);
};

export default PlaneDrawer;
