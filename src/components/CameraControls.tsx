import React, { useState, useMemo } from 'react';
import { Camera, PerspectiveCamera, Vector3 } from 'three';
import StaticClock from '../util/StaticClock';

const DEFAULT_SPEED = 5;
const UP = new Vector3(0, 1, 0);
const RIGHT = new Vector3(1, 0, 0);
const LEFT = new Vector3(-1, 0, 0);

interface ICameraControllerProps {
  children: (camera: Camera) => JSX.Element;
  canvasWidth: number;
  canvasHeight: number;
  clock: StaticClock;
  zoomSpeed?: number;
  translationSpeed?: number;
  rotationSpeed?: number;
}

type MouseButton = 'left' | 'right';

let prevMousePosition: { x: number; y: number } | undefined;

const CameraController = (props: ICameraControllerProps) => {
  const {
    camera,
    heldButton,
    setHeldButton,
    moveHorizontal,
    moveVertical,
    zoomCamera,
    rotateCamera,
  } = useCameraControllerContext(props);

  const mouseWheelEvent = (e: React.WheelEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    zoomCamera(Math.sign(e.nativeEvent.deltaY), props.clock.delta);
  };

  const mouseUpEvent = () => {
    setHeldButton(undefined);
    prevMousePosition = undefined;
  };

  const mouseDownEvent = (e: React.MouseEvent) => {
    switch (e.button) {
      case 0:
        setHeldButton('left');
        break;
      case 2:
        setHeldButton('right');
        break;
      default:
        return;
    }
  };

  const mouseMoveEvent = (e: React.MouseEvent) => {
    const delta = props.clock.delta;
    if (heldButton && prevMousePosition) {
      const xDiff = e.clientX - prevMousePosition.x;
      const yDiff = prevMousePosition.y - e.clientY;

      if (heldButton === 'left') {
        if (xDiff !== 0) {
          moveHorizontal(xDiff, delta);
        }

        if (yDiff !== 0) {
          moveVertical(yDiff, delta);
        }
      } else {
        const axis = new Vector3(xDiff, yDiff).cross(camera.getWorldDirection(new Vector3()));
        rotateCamera(axis, delta);
      }
    }
    prevMousePosition = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      id="camera-controller"
      onContextMenu={e => e.preventDefault()}
      onMouseUp={mouseUpEvent}
      onMouseMove={mouseMoveEvent}
      onWheel={mouseWheelEvent}
    >
      {/* We only allow camera modifications to start within the canvas */}
      <div onMouseDown={mouseDownEvent}>{props.children(camera)}</div>
    </div>
  );
};

const useCameraControllerContext = ({
  canvasWidth,
  canvasHeight,
  zoomSpeed = DEFAULT_SPEED * 10,
  translationSpeed = DEFAULT_SPEED,
  rotationSpeed = DEFAULT_SPEED,
}: ICameraControllerProps) => {
  const createNewCamera = () => {
    const cam = new PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    cam.position.set(0, 40, -25);
    cam.lookAt(0, 0, 0);

    return cam;
  };

  const camera = useMemo(createNewCamera, []);
  const [heldButton, setHeldButton] = useState(undefined as MouseButton | undefined);

  // =========
  // Functions
  // =========
  const getFacingDir = () => camera.getWorldDirection(new Vector3());

  const rotateCamera = (axis: Vector3, delta: number) => {
    camera.rotateOnWorldAxis(axis.normalize(), (delta * rotationSpeed * Math.PI) / 180);
  };

  const zoomCamera = (amount: number, delta: number) => {
    // Need to divide by translation speed to negate
    // the multiplication happening in translateCamera

    amount *= zoomSpeed / translationSpeed;
    const dir = getFacingDir();
    translateCamera(new Vector3(dir.x * amount, dir.y * amount, dir.z * amount), delta);
  };

  const moveHorizontal = (amount: number, delta: number) => {
    const forward = getFacingDir();
    const right = forward.normalize().cross(UP);
    translateCamera(new Vector3(right.x * amount, right.y * amount, right.z * amount), delta);
  };

  const moveVertical = (amount: number, delta: number) => {
    const forward = getFacingDir();
    const up = forward.normalize().cross(LEFT);
    translateCamera(new Vector3(up.x * amount, up.y * amount, up.z * amount), delta);
  };

  const translateCamera = ({ x = 0, y = 0, z = 0 }: Partial<Vector3>, delta: number) => {
    delta *= translationSpeed;
    camera
      .translateX(x * delta)
      .translateY(y * delta)
      .translateZ(z * delta);
  };

  return {
    camera,
    heldButton,
    setHeldButton,
    rotateCamera,
    moveHorizontal,
    moveVertical,
    zoomCamera,
  };
};

export default CameraController;
