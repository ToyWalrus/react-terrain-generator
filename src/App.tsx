import React, { useEffect, useState, useMemo } from 'react';
import { PerspectiveCamera, Scene } from 'three';
import NoiseGenerator from './util/NoiseGenerator';
import PlaneDrawerSettings from './util/PlaneDrawerSettings';
import PlaneDrawer from './components/drawers/PlaneDrawer';
import SettingsEditor from './components/settings-editor/SettingsEditor';
import TerrainMap from './terrain/TerrainMap';
import Random from 'random';

import './App.css';

const App = () => {
  const {
    settings,
    scene,
    terrainMap,
    updateSettings,
    canvasHeight,
    canvasWidth,
    setCanvasHeight,
    setCanvasWidth,
    setKeepSeed,
    camera,
  } = useAppContext();

  return (
    <div id="App" onContextMenu={e => e.preventDefault()}>
      <SettingsEditor
        settings={settings}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        onChangeCanvasSize={newSize => {
          setCanvasHeight(newSize.canvasHeight);
          setCanvasWidth(newSize.canvasWidth);
        }}
        onSubmitSettings={(settings, keepSeed) => {
          setKeepSeed(keepSeed);
          updateSettings(settings);
        }}
      />
      <PlaneDrawer
        camera={camera}
        scene={scene}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        terrainMap={terrainMap}
        settings={settings}
      />
    </div>
  );
};

const useAppContext = () => {
  const getRandomSeed = () => Random.integer(1000000, 1000000000);
  const createNewCamera = () => {
    const cam = new PerspectiveCamera(50, canvasWidth / canvasHeight);
    cam.position.set(0, 200, -100);
    return cam;
  };
  const createNewScene = () => {
    const scene = new Scene();
    return scene;
  };

  const [canvasWidth, setCanvasWidth] = useState(650);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [renderCount, setRenderCount] = useState(0);
  const scene = useMemo(createNewScene, []);
  const camera = useMemo(createNewCamera, []);

  const [keepSeed, setKeepSeed] = useState(true);
  const [settings, updateSettings] = useState(
    new PlaneDrawerSettings({
      arrHeight: 50,
      arrWidth: 50,
      heightAmplify: 300,
      wireframe: false,
      autoRotate: true,
    }),
  );

  const [elevationSeed, setElevationSeed] = useState(settings.seed);
  const [temperatureSeed, setTemperatureSeed] = useState(settings.seed + 1);
  const [moistureSeed, setMoistureSeed] = useState(settings.seed + 2);

  const [elevationMap, setElevationMap] = useState([] as number[][]);
  const [temperatureMap, setTemperatureMap] = useState([] as number[][]);
  const [moistureMap, setMoistureMap] = useState([] as number[][]);

  const [terrainMap, setTerrainMap] = useState(new TerrainMap());

  useEffect(() => {
    const generator = new NoiseGenerator(settings.seed || 0, settings.arrWidth, settings.arrHeight);

    if (!keepSeed) {
      settings.seed = getRandomSeed();
      setElevationSeed(settings.seed);
      setTemperatureSeed(settings.seed + 1);
      setMoistureSeed(settings.seed + 2);
      setKeepSeed(true);
    }

    settings.seed = elevationSeed;
    generator.changeSettings(settings);
    setElevationMap(generator.generatePerlinNoise(settings.octaves));

    settings.seed = temperatureSeed;
    generator.changeSettings(settings);
    setTemperatureMap(generator.generatePerlinNoise(settings.octaves));

    settings.seed = moistureSeed;
    generator.changeSettings(settings);
    setMoistureMap(generator.generatePerlinNoise(settings.octaves));
  }, [settings, renderCount]);

  useEffect(() => {
    if (elevationMap.length && temperatureMap.length && moistureMap.length) {
      setTerrainMap(new TerrainMap(elevationMap, temperatureMap, moistureMap));
    }
  }, [elevationMap, temperatureMap, moistureMap]);

  return {
    scene,
    camera,
    terrainMap,
    settings,
    updateSettings: (settings: PlaneDrawerSettings) => {
      updateSettings(settings);
      setRenderCount(renderCount + 1);
    },
    canvasHeight,
    canvasWidth,
    setCanvasHeight,
    setCanvasWidth,
    setKeepSeed,
  };
};

export default App;
