import { Color } from 'three';

/**
 * @return A cosine interpolation between num1 and num2.
 */
const interpolate = (num1: number, num2: number, alpha: number): number => {
  const angle = alpha * Math.PI;
  const prc = (1 - Math.cos(angle)) * 0.5;
  return num1 * (1.0 - prc) + prc * num2;
};

const clamp = (toClamp: number, min: number, max: number) => {
  return Math.min(Math.max(toClamp, min), max);
};

const getGradientMap = (perlinNoise: number[][], gradientStart: Color, gradientEnd: Color): Color[][] => {
  const width = perlinNoise.length;
  const height = perlinNoise[0].length;
  const img: Color[][] = [];

  for (let x = 0; x < width; ++x) {
    img.push([]);
    for (let y = 0; y < height; ++y) {
      img[x].push(_getGradientColor(gradientStart, gradientEnd, perlinNoise[x][y]));
    }
  }

  return img;
};

const getColorMap = (perlinNoise: number[][], colors: Color[], cutoffs: number[]): Color[][] | undefined => {
  const width = perlinNoise.length;
  const height = perlinNoise[0].length;
  if (colors.length === 0) return;

  const img: Color[][] = [];

  for (let x = 0; x < width; ++x) {
    img.push([]);
    for (let y = 0; y < height; ++y) {
      img[x].push(_getMapColor(colors, cutoffs, perlinNoise[x][y]));
    }
  }

  return img;
};

const _getGradientColor = (gradientStart: Color, gradientEnd: Color, val: number): Color => {
  const inverse = 1 - val;
  const r = gradientStart.r * val + gradientEnd.r * inverse;
  const g = gradientStart.g * val + gradientEnd.g * inverse;
  const b = gradientStart.b * val + gradientEnd.b * inverse;
  return new Color(r, g, b);
};

const _getMapColor = (colors: Color[], cutoffs: number[], val: number): Color => {
  for (let x = 0; x < cutoffs.length; ++x) {
    if (x == 0) {
      if (val < cutoffs[0] && val >= 0) return colors[x];
    } else if (x == cutoffs.length - 1) {
      if (val < 1 && val >= cutoffs[x]) return colors[x];
    } else {
      if (val < cutoffs[x] && val >= cutoffs[x - 1]) return colors[x];
    }
  }

  return colors[0];
};

export { interpolate, clamp, getGradientMap, getColorMap };
