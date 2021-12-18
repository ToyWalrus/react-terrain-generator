import React from 'react';
import { Camera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

interface ICanvasRendererProps {
  width: number;
  height: number;
  scene?: Scene;
  camera?: Camera;
  autoRotate?: boolean;
  worldFocusPoint?: Vector3;
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
    let didChangeSomething = false;

    if (this.props.camera && !this.controls) {
      this._initOrbitControls(this.props.camera);
      didChangeSomething = true;
    }

    if (oldProps.width !== this.props.width || oldProps.height !== this.props.height) {
      this.renderer.setSize(this.props.width, this.props.height);
      didChangeSomething = true;
    }

    if (this.controls) {
      if (oldProps.autoRotate !== this.props.autoRotate) {
        this.controls.autoRotate = !!this.props.autoRotate;
        didChangeSomething = true;
      }

      if (oldProps.worldFocusPoint !== this.props.worldFocusPoint) {
        this.controls.target = this.props.worldFocusPoint || new Vector3();
        this.props.camera?.lookAt(this.controls.target);
        didChangeSomething = true;
      }
    }

    if (didChangeSomething) {
      if (this.animCancelValue) {
        console.log('restarting aimation');
        cancelAnimationFrame(this.animCancelValue);
      }
      this._startAnimation(this.props.scene, this.props.camera);
    }
  }

  _startAnimation(scene?: Scene, cam?: Camera) {
    if (scene && cam) {
      const animate = () => {
        this.animCancelValue = requestAnimationFrame(animate);
        if (this.controls) {
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
    controls.target = this.props.worldFocusPoint || new Vector3();
    controls.autoRotate = !!this.props.autoRotate;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.panSpeed = 0.8;
    controls.rotateSpeed = 0.2;
    controls.autoRotateSpeed = 1.25;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.05;

    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };

    this.controls = controls;
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
