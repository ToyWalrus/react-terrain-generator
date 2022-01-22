import React, { useState } from 'react';
import TerrainMap from '../../terrain/TerrainMap';
import './DetailLayers.scss';
import { Vector2 } from 'three';
import NoiseMapRenderer from '../renderers/NoiseMapRenderer';

interface IDetailLayersProps {
  open: boolean;
  terrainMap: TerrainMap;
  scaleSize?: number;
}

const DetailLayers = (props: IDetailLayersProps) => {
  const { focusedPosition, setFocusedPosition, noiseMapSize } = useDetailLayersHook(props);

  return (
    <div id="DetailLayers">
      <NoiseMapRenderer
        noiseMap={props.terrainMap.elevationMap}
        mapTitle="Elevation"
        updateCrosshairPosition={setFocusedPosition}
        crosshairPosition={focusedPosition}
        size={noiseMapSize}
      />
      {props.terrainMap.temperatureMap && (
        <NoiseMapRenderer
          noiseMap={props.terrainMap.temperatureMap}
          mapTitle="Temperature"
          updateCrosshairPosition={setFocusedPosition}
          crosshairPosition={focusedPosition}
          size={noiseMapSize}
        />
      )}
      {props.terrainMap.moistureMap && (
        <NoiseMapRenderer
          noiseMap={props.terrainMap.moistureMap}
          mapTitle="Moisture"
          updateCrosshairPosition={setFocusedPosition}
          crosshairPosition={focusedPosition}
          size={noiseMapSize}
        />
      )}
    </div>
  );
};

const useDetailLayersHook = (props: IDetailLayersProps) => {
  const [focusedPosition, setFocusedPosition] = useState<Vector2 | undefined>(undefined);
  const scale = props.scaleSize || 2.5;

  const noiseMapSize = {
    width: props.terrainMap.elevationMap.length * scale,
    height: props.terrainMap.elevationMap.length > 0 ? props.terrainMap.elevationMap[0].length * scale : 0,
  };

  return {
    focusedPosition,
    setFocusedPosition,
    noiseMapSize,
  };
};

export default DetailLayers;
