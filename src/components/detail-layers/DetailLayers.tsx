import React, { useState } from 'react';
import { Vector2 } from 'three';
import NoiseMapRenderer, { canvasPointToMapPoint } from '../renderers/NoiseMapRenderer';
import TerrainMap from '../../terrain/TerrainMap';
import { getBiome, getElevation, getMoisture, getTemperature } from '../../util/MapInterpreter';
import Biome from '../../terrain/Biome';
import './DetailLayers.scss';

interface IDetailLayersProps {
  open: boolean;
  terrainMap: TerrainMap;
  scaleSize?: number;
}

const DetailLayers = (props: IDetailLayersProps) => {
  const { focusedPosition, setFocusedPosition, noiseMapSize, currentBiome } = useDetailLayersHook(props);

  return (
    <div id="DetailLayers">
      <NoiseMapRenderer
        noiseMap={props.terrainMap.elevationMap}
        mapTitle="Elevation"
        valueInterpreter={getElevation}
        updateCrosshairPosition={setFocusedPosition}
        crosshairPosition={focusedPosition}
        size={noiseMapSize}
      />
      {props.terrainMap.temperatureMap && (
        <NoiseMapRenderer
          noiseMap={props.terrainMap.temperatureMap}
          mapTitle="Temperature"
          valueInterpreter={getTemperature}
          updateCrosshairPosition={setFocusedPosition}
          crosshairPosition={focusedPosition}
          size={noiseMapSize}
        />
      )}
      {props.terrainMap.moistureMap && (
        <NoiseMapRenderer
          noiseMap={props.terrainMap.moistureMap}
          mapTitle="Moisture"
          valueInterpreter={getMoisture}
          updateCrosshairPosition={setFocusedPosition}
          crosshairPosition={focusedPosition}
          size={noiseMapSize}
        />
      )}
      <span className="current-biome">{currentBiome && `Biome: ${currentBiome}`}</span>
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

  let currentBiome: Biome | undefined;
  if (focusedPosition) {
    const { elevationMap, temperatureMap, moistureMap } = props.terrainMap;
    if (temperatureMap && moistureMap) {
      const { x, y } = canvasPointToMapPoint(focusedPosition, noiseMapSize, {
        width: elevationMap.length,
        height: elevationMap.length > 0 ? elevationMap[0].length : 0,
      });
      currentBiome = getBiome(elevationMap[x][y], temperatureMap[x][y], moistureMap[x][y]);
    }
  }

  return {
    focusedPosition,
    setFocusedPosition,
    noiseMapSize,
    currentBiome,
  };
};

export default DetailLayers;
