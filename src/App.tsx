import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasRenderer from './components/CanvasRenderer';
import { PerspectiveCamera, Scene, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

function App() {
  const canvasWidth = 600;
  const canvasHeight = canvasWidth;

  const cam = useRef(new PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000));
  const scene = useRef(new Scene());

  useEffect(() => {
    setTimeout(() => {
      var geometry = new BoxGeometry(1, 1, 1);
      var material = new MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new Mesh(geometry, material);
      scene.current.add(cube);
      cam.current.position.setZ(10);
    }, 2000);
  }, []);

  return (
    <div className="App">
      <CanvasRenderer camera={cam.current} scene={scene.current} width={canvasWidth} height={canvasHeight} />
    </div>
  );
}

export default App;
