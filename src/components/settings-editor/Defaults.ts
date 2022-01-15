import PlaneDrawerSettings from '../../util/PlaneDrawerSettings';

export const defaultSettings: Partial<PlaneDrawerSettings> = {
  seed: 'This can be anything!',
  arrHeight: 50,
  arrWidth: 60,
  octaves: 7,
  persistance: 0.5,
  heightAmplify: 200,
  scaleSize: 2.5,
  wireframe: false,
  autoRotate: true,
};

export const defaultSeeds = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];
