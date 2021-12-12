/**
 * The closer alpha is to 0, the closer the resulting value will be to num1,
 * the closer alpha is to 1, the closer the resulting value will be to num2.
 * For gradient purposes.
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

export { interpolate, clamp };
