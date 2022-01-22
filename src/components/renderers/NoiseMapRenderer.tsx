import React, { useEffect, useRef } from 'react';
import { Color, Vector2 } from 'three';

interface INoiseMapRendererProps {
  noiseMap: number[][];
  updateCrosshairPosition: (p: Vector2 | undefined) => void;
  crosshairPosition: Vector2 | undefined;
  crosshairSize?: number;
  crosshairThickness?: number;
  crosshairColor?: Color;
  gradientColors?: {
    low: Color;
    high: Color;
  };
  size?: {
    width: number;
    height: number;
  };
}

const NoiseMapRenderer = (props: INoiseMapRendererProps) => {
  const {
    canvasRef,
    size: { width, height },
  } = useNoiseMapRendererHook(props);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      props.updateCrosshairPosition(new Vector2(x, y));
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      onMouseOut={() => props.updateCrosshairPosition(undefined)}
    >
      <p>Browser does not support this feature</p>
    </canvas>
  );
};

const useNoiseMapRendererHook = (props: INoiseMapRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = props.size || {
    width: props.noiseMap.length,
    height: props.noiseMap.length > 0 ? props.noiseMap[0].length : 0,
  };
  const gradient = props.gradientColors || {
    low: new Color(0, 0, 0),
    high: new Color(1, 1, 1),
  };

  const crosshairSize = props.crosshairSize === undefined ? 5 : props.crosshairSize;
  const crosshairThickness = props.crosshairThickness === undefined ? 1 : props.crosshairThickness;
  const crosshairColor = props.crosshairColor?.getHexString() || 'e62020';

  const w = canvasSize.width > 0 ? props.noiseMap.length / canvasSize.width : 0;
  const h = canvasSize.height > 0 && props.noiseMap.length > 0 ? props.noiseMap[0].length / canvasSize.height : 0;

  const clamp = (val: number, max: number) => {
    return Math.min(val, max);
  };

  const getCanvasPoint = (xIndex: number, yIndex: number): Vector2 => {
    const xMax = props.noiseMap.length;
    const yMax = xMax > 0 ? props.noiseMap[0].length : 1;
    return new Vector2(clamp(Math.round(xIndex * w), xMax - 1), clamp(Math.round(yIndex * h), yMax - 1));
  };

  const getColorForValue = (val: number): Color => {
    const c = new Color();
    c.lerpColors(gradient.low, gradient.high, val);
    return c;
  };

  const getCanvasPointColor = (xIndex: number, yIndex: number): string => {
    let colorHexVal: string | undefined;
    if (props.crosshairPosition) {
      const { x, y } = props.crosshairPosition;
      if (
        xIndex < x + crosshairThickness &&
        xIndex > x - crosshairThickness &&
        yIndex < y + crosshairSize &&
        yIndex > y - crosshairSize
      ) {
        colorHexVal = crosshairColor;
      } else if (
        yIndex < y + crosshairThickness &&
        yIndex > y - crosshairThickness &&
        xIndex < x + crosshairSize &&
        xIndex > x - crosshairSize
      ) {
        colorHexVal = crosshairColor;
      }
    }

    if (!colorHexVal) {
      const pt = getCanvasPoint(xIndex, yIndex);
      colorHexVal = getColorForValue(props.noiseMap[pt.x][pt.y]).getHexString();
    }
    return '#' + colorHexVal;
  };

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        if (props.noiseMap.length && props.noiseMap[0].length) {
          for (let x = 0; x < canvasSize.width; ++x) {
            for (let y = 0; y < canvasSize.height; ++y) {
              ctx.fillStyle = getCanvasPointColor(x, y);
              ctx.fillRect(x, y, 1, 1);
            }
          }
        } else {
          ctx.fillStyle = 'rgb(20, 20, 20)';
          ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        }
      }
    }
  }, [canvasRef, canvasSize.width, canvasSize.height, props.noiseMap, props.crosshairPosition]);

  return { canvasRef, size: canvasSize };
};

export default NoiseMapRenderer;
