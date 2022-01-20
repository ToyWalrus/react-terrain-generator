import { useEffect } from 'react';
import { Camera, HemisphereLight, Scene } from 'three';
import TerrainMap from '../../terrain/TerrainMap';
import MeshGenerator from '../../util/MeshGenerator';
import PlaneDrawerSettings from '../../util/PlaneDrawerSettings';
import CanvasRenderer from './CanvasRenderer';

interface IPlaneRendererProps {
  scene: Scene;
  camera: Camera;
  terrainMap: TerrainMap;
  settings: PlaneDrawerSettings;
  canvasWidth: number;
  canvasHeight: number;
}

const PlaneRenderer = (props: IPlaneRendererProps) => {
  usePlaneDrawerContext(props);

  return (
    <div>
      <CanvasRenderer
        scene={props.scene}
        camera={props.camera}
        width={props.canvasWidth}
        height={props.canvasHeight}
        autoRotate={props.settings.autoRotate}
      />
    </div>
  );
};

const usePlaneDrawerContext = ({ scene, terrainMap, settings }: IPlaneRendererProps) => {
  useEffect(() => {
    scene.clear();

    scene.add(new HemisphereLight());

    const { wireframe, mesh } = MeshGenerator.generateMeshFor(terrainMap, {
      scaleHeight: settings.heightAmplify,
      scaleLengthAndWidth: settings.scaleSize,
    });

    wireframe.forEach(line => scene.add(line));

    if (!settings.wireframe) {
      scene.add(mesh);
    }
  }, [terrainMap, settings, MeshGenerator.wireframeColor]);
};

export default PlaneRenderer;
