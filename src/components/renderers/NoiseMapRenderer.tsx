import React, { useEffect, useMemo, useRef } from 'react';
import { Color, Vector2 } from 'three';

interface INoiseMapRendererProps {
  noiseMap: number[][];
  updateCrosshairPosition: (p: Vector2 | undefined) => void;
  crosshairPosition: Vector2 | undefined;
  mapTitle: string;
  valueInterpreter: (val: number) => string;
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
    onMouseMove,
    getFocusedValue,
    getInterpretation,
  } = useNoiseMapRendererHook(props);

  const hasFocusedValue = props.crosshairPosition !== undefined;

  return (
    <div className="noise-map">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={onMouseMove}
        onMouseOut={() => props.updateCrosshairPosition(undefined)}
      >
        <p>Browser does not support this feature</p>
      </canvas>
      <div className="noise-map-details">
        <span className="map-title">{props.mapTitle}</span>
        <span className="focused-value">{hasFocusedValue && `Value: ${getFocusedValue()}`}</span>
        <span className="focused-value">{hasFocusedValue && `Interpretation: ${getInterpretation()}`}</span>
      </div>
    </div>
  );
};

const useNoiseMapRendererHook = (props: INoiseMapRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvas = useMemo(() => {
    console.log('create canvas');
    return document.createElement('canvas');
  }, []);

  const canvasSize = props.size || {
    width: props.noiseMap.length,
    height: props.noiseMap.length > 0 ? props.noiseMap[0].length : 0,
  };
  const mapSize = {
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

  const getColorForValue = (val: number): Color => {
    const c = new Color();
    c.lerpColors(gradient.low, gradient.high, val);
    return c;
  };

  const getCanvasPointColor = (xIndex: number, yIndex: number): string => {
    let colorHexVal: string | undefined;
    if (!colorHexVal) {
      const pt = canvasPointToMapPoint(new Vector2(xIndex, yIndex), canvasSize, mapSize);
      colorHexVal = getColorForValue(props.noiseMap[pt.x][pt.y]).getHexString();
    }
    return '#' + colorHexVal;
  };

  const drawCrosshairs = () => {
    if (canvasRef?.current && offscreenCanvas) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(offscreenCanvas, 0, 0);

        if (props.crosshairPosition) {
          const { x, y } = props.crosshairPosition;
          const xMin = Math.max(x - crosshairSize, 0);
          const xMax = Math.min(x + crosshairSize, canvasSize.width);
          const yMin = Math.max(y - crosshairSize, 0);
          const yMax = Math.min(y + crosshairSize, canvasSize.height);

          ctx.strokeStyle = '#' + crosshairColor;
          ctx.lineWidth = crosshairThickness / 2;

          ctx.beginPath();
          ctx.moveTo(xMin, y);
          ctx.lineTo(xMax, y);
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x, yMin);
          ctx.lineTo(x, yMax);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  };

  // Draw noise map
  useEffect(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return;

    offscreenCanvas.width = canvasSize.width;
    offscreenCanvas.height = canvasSize.height;
    const ctx = offscreenCanvas.getContext('2d');

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

    drawCrosshairs();
  }, [canvasSize.width, canvasSize.height, props.noiseMap, props.gradientColors]);

  // Draw crosshairs
  useEffect(drawCrosshairs, [props.crosshairPosition]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      props.updateCrosshairPosition(new Vector2(x, y));
    }
  };

  const getFocusedValue = () => {
    if (!props.crosshairPosition) return '-';
    const { x, y } = canvasPointToMapPoint(props.crosshairPosition, canvasSize, mapSize);
    return props.noiseMap[x][y].toFixed(3);
  };

  const getInterpretation = () => {
    const val = getFocusedValue();
    if (val === '-') return '-';
    return props.valueInterpreter(Number.parseFloat(val));
  };

  return { canvasRef, size: canvasSize, onMouseMove, getFocusedValue, getInterpretation };
};

interface Size {
  width: number;
  height: number;
}

export const canvasPointToMapPoint = (canvasPoint: Vector2, canvasSize: Size, mapSize: Size): Vector2 => {
  const w = canvasSize.width > 0 ? mapSize.width / canvasSize.width : 0;
  const h = canvasSize.height > 0 ? mapSize.height / canvasSize.height : 0;
  return new Vector2(
    Math.max(Math.min(Math.round(canvasPoint.x * w), mapSize.width - 1), 0),
    Math.max(Math.min(Math.round(canvasPoint.y * h), mapSize.height - 1), 0),
  );
};

export default NoiseMapRenderer;
