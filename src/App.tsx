import React, { useEffect, useState, useMemo } from 'react';
import { PerspectiveCamera, Scene } from 'three';
import { defaultSeeds, defaultSettings } from './components/settings-editor/Defaults';
import NoiseGenerator from './util/NoiseGenerator';
import PlaneDrawerSettings from './util/PlaneDrawerSettings';
import PlaneDrawer from './components/drawers/PlaneDrawer';
import SettingsEditor from './components/settings-editor/SettingsEditor';
import TerrainMap from './terrain/TerrainMap';

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
  } = useAppHook();

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

const useAppHook = () => {
  const createNewCamera = () => {
    const cam = new PerspectiveCamera(50, canvasWidth / canvasHeight);
    cam.position.set(0, 200, -100);
    return cam;
  };
  const createNewScene = () => {
    const scene = new Scene();
    return scene;
  };

  const [randomSeeds, setRandomSeeds] = useState([] as string[]);
  const [canvasWidth, setCanvasWidth] = useState(650);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [renderCount, setRenderCount] = useState(0);
  const scene = useMemo(createNewScene, []);
  const camera = useMemo(createNewCamera, []);

  const [keepSeed, setKeepSeed] = useState(true);
  const [settings, updateSettings] = useState(new PlaneDrawerSettings(defaultSettings));

  const [elevationMap, setElevationMap] = useState([] as number[][]);
  const [temperatureMap, setTemperatureMap] = useState([] as number[][]);
  const [moistureMap, setMoistureMap] = useState([] as number[][]);

  const [terrainMap, setTerrainMap] = useState(new TerrainMap());

  useEffect(() => {
    if (!keepSeed) {
      settings.seed = `${randomSeeds[0]} ${randomSeeds[1]}`;
      setRandomSeeds(randomSeeds.slice(2));
      setKeepSeed(true);
    }

    const generator = new NoiseGenerator(settings);
    const seed = settings.seed;

    generator.seed = 'elevation-' + seed;
    setElevationMap(generator.generatePerlinNoise(settings.octaves));

    generator.seed = 'temperature-' + seed;
    setTemperatureMap(generator.generatePerlinNoise(settings.octaves));

    generator.seed = 'moisture-' + seed;
    setMoistureMap(generator.generatePerlinNoise(settings.octaves));
  }, [settings, renderCount]);

  useEffect(() => {
    if (elevationMap.length && temperatureMap.length && moistureMap.length) {
      console.log('resetting terrain');
      setTerrainMap(new TerrainMap(elevationMap, temperatureMap, moistureMap));
    }
  }, [elevationMap, temperatureMap, moistureMap]);

  useEffect(() => {
    const getWords = async () => {
      try {
        const pairCount = 10;

        const [nounResponse, adjectiveResponse] = await Promise.all([
          fetch(`https://random-word-form.herokuapp.com/random/noun?count=${pairCount}`),
          fetch(`https://random-word-form.herokuapp.com/random/adjective?count=${pairCount}`),
        ]);

        const [nouns, adjectives] = await Promise.all([
          nounResponse.json(),
          adjectiveResponse.json(),
        ]);

        const pairs = [];
        for (let i = 0; i < pairCount; ++i) {
          pairs.push(adjectives.shift(), nouns.shift());
        }

        setRandomSeeds(pairs);
      } catch (e) {
        console.info(e);
        setRandomSeeds(defaultSeeds);
      }
    };

    if (randomSeeds.length === 0) {
      getWords();
    }
  }, [randomSeeds]);

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
