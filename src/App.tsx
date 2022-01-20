import React, { useEffect, useMemo, useState } from 'react';
import { PerspectiveCamera, Scene } from 'three';
import { defaultSeeds, defaultSettings } from './components/settings-editor/Defaults';
import MenuIcon from '@material-ui/icons/Menu';
import NoiseGenerator from './util/NoiseGenerator';
import PlaneDrawerSettings from './util/PlaneDrawerSettings';
import PlaneRenderer from './components/renderers/PlaneRenderer';
import SettingsEditor from './components/settings-editor/SettingsEditor';
import TerrainMap from './terrain/TerrainMap';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import { IconButton } from '@material-ui/core';
import './App.scss';

const App = () => {
  const {
    scene,
    settings,
    terrainMap,
    settingsVisible,
    setSettingsVisible,
    updateSettings,
    canvasHeight,
    canvasWidth,
    setCanvasHeight,
    setCanvasWidth,
    setKeepSeed,
    camera,
  } = useAppHook();

  return (
    <div id="App">
      <main
        className={classnames({
          'settings-visible': settingsVisible,
        })}
      >
        <div className="title-row">
          <IconButton className="settings-button" onClick={() => setSettingsVisible(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <div className="spacer" />
          <div className="app-title">Procedural Terrain Generator</div>
          <div className="spacer" />
        </div>
        <div className="spacer" />
        <div id="ProceduralTerrainGenerator" onContextMenu={e => e.preventDefault()}>
          <PlaneRenderer
            camera={camera}
            scene={scene}
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
            terrainMap={terrainMap}
            settings={settings}
          />
        </div>
        <div className="spacer double" />
      </main>
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
        open={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
      <ReactTooltip className="tooltip-popup" backgroundColor="#282c34" border={true} multiline={true} />
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
    return new Scene();
  };

  const [randomSeeds, setRandomSeeds] = useState([] as string[]);
  const [canvasWidth, setCanvasWidth] = useState(650);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [renderCount, setRenderCount] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(true);
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

        const [nouns, adjectives] = await Promise.all([nounResponse.json(), adjectiveResponse.json()]);

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
    settingsVisible,
    setSettingsVisible,
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
