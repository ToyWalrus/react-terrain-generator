import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasRenderer from './components/CanvasRenderer';
import { PerspectiveCamera, Scene, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import NoiseGenerator from './util/NoiseGenerator';
import Random from 'random';
import PlaneDrawerSettings from './util/PlaneDrawerSettings';
import PlaneDrawer from './components/PlaneDrawer';
import SettingsEditor from './components/SettingsEditor';
import TerrainMap from './terrain/TerrainMap';

const App = () => {
  const {
    settings,
    cam,
    scene,
    terrainMap,
    updateSettings,
    canvasHeight,
    canvasWidth,
    setCanvasHeight,
    setCanvasWidth,
    setKeepSeed,
  } = useAppContext();

  return (
    <div className="App">
      <SettingsEditor
        settings={settings}
        onSubmitSettings={settings => {
          setKeepSeed(true);
          updateSettings(settings);
        }}
      />

      <PlaneDrawer
        camera={cam}
        scene={scene}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        terrainMap={terrainMap}
        wireframeOnly={settings.wireframe}
        autoRotate={settings.autoRotate}
      />
    </div>
  );
};

const useAppContext = () => {
  const getRandomSeed = () => Random.integer(1000000, 1000000000);

  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [keepSeed, setKeepSeed] = useState(false);

  const [scene] = useState(new Scene());
  const [cam] = useState(new PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000));

  const [settings, updateSettings] = useState(new PlaneDrawerSettings({ arrHeight: 50, arrWidth: 50 }));

  const [elevationSeed, setElevationSeed] = useState(getRandomSeed());
  const [temperatureSeed, setTemperatureSeed] = useState(getRandomSeed());
  const [moistureSeed, setMoistureSeed] = useState(getRandomSeed());

  const [elevationMap, setElevationMap] = useState([] as number[][]);
  const [temperatureMap, setTemperatureMap] = useState([] as number[][]);
  const [moistureMap, setMoistureMap] = useState([] as number[][]);

  const [terrainMap, setTerrainMap] = useState(new TerrainMap());

  useEffect(() => {
    const generator = new NoiseGenerator(settings.seed || 0, settings.arrWidth, settings.arrHeight);

    if (!keepSeed) {
      setElevationSeed(getRandomSeed());
      setTemperatureSeed(getRandomSeed());
      setMoistureSeed(getRandomSeed());
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
  }, [settings]);

  useEffect(() => {
    if (elevationMap.length && temperatureMap.length && moistureMap.length) {
      setTerrainMap(new TerrainMap(elevationMap, temperatureMap, moistureMap));
    }
  }, [elevationMap, temperatureMap, moistureMap]);

  return {
    cam,
    scene,
    terrainMap,
    settings,
    updateSettings,
    canvasHeight,
    canvasWidth,
    setCanvasHeight,
    setCanvasWidth,
    setKeepSeed,
  };
};

export default App;
