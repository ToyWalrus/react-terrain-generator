import React from 'react';
import { Camera, Scene, WebGLRenderer } from 'three';

interface ICanvasRendererProps {
  scene?: Scene;
  camera?: Camera;
  width: number;
  height: number;
}

export default class CanvasRenderer extends React.Component<ICanvasRendererProps> {
  renderer: WebGLRenderer;
  mount?: HTMLElement;
  animCancelValue?: number;

  constructor(props: ICanvasRendererProps) {
    super(props);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(props.width, props.height);
  }

  componentDidMount() {
    this.mount?.appendChild(this.renderer.domElement);
    this._startAnimation(this.props.scene, this.props.camera);
  }

  componentDidUpdate(oldProps: Readonly<ICanvasRendererProps>) {
    if (
      oldProps.width !== this.props.width ||
      oldProps.height !== this.props.height ||
      oldProps.camera !== this.props.camera ||
      oldProps.scene !== this.props.scene
    ) {
      console.log('restarting aimation');
      cancelAnimationFrame(this.animCancelValue!);
      this.renderer.setSize(this.props.width, this.props.height);
      this._startAnimation(this.props.scene, this.props.camera);
    }
  }

  _startAnimation(scene?: Scene, cam?: Camera) {
    if (scene && cam) {
      const animate = () => {
        this.animCancelValue = requestAnimationFrame(animate);
        this.renderer.render(scene, cam);
      };
      animate();
    }
  }

  render() {
    return (
      <div
        className="canvas-renderer"
        ref={el => {
          if (el) {
            this.mount = el;
          }
        }}
      />
    );
  }
}
