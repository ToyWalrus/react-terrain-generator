import React from 'react';
import * as THREE from 'three';
import { Camera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ICanvasRendererProps {
  width: number;
  height: number;
  scene?: Scene;
  camera?: Camera;
  autoRotate?: boolean;
}

export default class CanvasRenderer extends React.Component<ICanvasRendererProps> {
  renderer: WebGLRenderer;
  controls?: OrbitControls;
  htmlEl?: HTMLElement;
  animCancelValue?: number;

  constructor(props: ICanvasRendererProps) {
    super(props);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(props.width, props.height);
    this.renderer.setClearColor(0x202227);

    if (props.camera) {
      this._initOrbitControls(props.camera);
    }
  }

  componentDidMount() {
    this.htmlEl?.appendChild(this.renderer.domElement);
    this._startAnimation(this.props.scene, this.props.camera);
  }

  componentDidUpdate(oldProps: Readonly<ICanvasRendererProps>) {
    if (this.props.camera && !this.controls) {
      this._initOrbitControls(this.props.camera);
    }

    if (oldProps.width !== this.props.width || oldProps.height !== this.props.height) {
      this.renderer.setSize(this.props.width, this.props.height);
    }

    if (this.controls && oldProps.autoRotate !== this.props.autoRotate) {
      this.controls.autoRotate = !!this.props.autoRotate;
    }
  }

  _startAnimation(scene?: Scene, cam?: Camera) {
    if (scene && cam) {
      const animate = () => {
        this.animCancelValue = requestAnimationFrame(animate);
        if (this.controls) {
          if (this.controls.autoRotate) {
            this.controls.target = new Vector3();
          }
          this.controls.update();
        }
        this.renderer.render(scene, cam);
      };
      animate();
    }
  }

  _initOrbitControls(cam: Camera) {
    // https://threejs.org/examples/#misc_controls_orbit
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const controls = new OrbitControls(cam, this.renderer.domElement);
    controls.listenToKeyEvents(window as any);

    // Some of these could probably become editable settings too
    controls.screenSpacePanning = false;
    controls.autoRotate = !!this.props.autoRotate;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.panSpeed = 0.75;
    controls.rotateSpeed = 0.2;
    controls.maxDistance = 500;
    controls.autoRotateSpeed = 1.2;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.05;

    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };

    this.controls = controls;
    cam.lookAt(controls.target);
  }

  render() {
    return (
      <div
        className="canvas-renderer"
        ref={el => {
          if (el) {
            this.htmlEl = el;
          }
        }}
      />
    );
  }
}
