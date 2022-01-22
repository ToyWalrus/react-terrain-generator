import React, { useState } from 'react';
import TerrainMap from '../../terrain/TerrainMap';
import './DetailLayers.scss';
import { Vector2 } from 'three';
import NoiseMapRenderer from '../renderers/NoiseMapRenderer';

interface IDetailLayersProps {
  open: boolean;
  terrainMap: TerrainMap;
}

const DetailLayers = (props: IDetailLayersProps) => {
  const { focusedPosition, setFocusedPosition } = useDetailLayersHook(props);

  return (
    <div id="DetailLayers">
      <NoiseMapRenderer
        noiseMap={props.terrainMap.elevationMap}
        updateCrosshairPosition={setFocusedPosition}
        crosshairPosition={focusedPosition}
        size={{
          width: props.terrainMap.elevationMap.length * 2,
          height: props.terrainMap.elevationMap.length > 0 ? props.terrainMap.elevationMap[0].length * 2 : 0,
        }}
      />
    </div>
  );
};

const useDetailLayersHook = (props: IDetailLayersProps) => {
  const [focusedPosition, setFocusedPosition] = useState<Vector2 | undefined>(undefined);

  return {
    focusedPosition,
    setFocusedPosition,
  };
};

export default DetailLayers;
