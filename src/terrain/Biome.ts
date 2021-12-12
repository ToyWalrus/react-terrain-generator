import { Color } from 'three';

enum Biome {
  Ocean = 'Ocean',
  Beach = 'Beach',
  Desert = 'Desert',
  TemperateDesert = 'Temperate Desert',
  ScorchedDesert = 'Scorched Desert',
  Grassland = 'Grassland',
  Shrubland = 'Shrubland',
  Crag = 'Crag',
  Lake = 'Lake',
  Marsh = 'Marsh',
  Plains = 'Plains',
  Forest = 'Forest',
  RainForest = 'Rain Forest',
  Taiga = 'Taiga',
  Tundra = 'Tundra',
  Snow = 'Snow',
}

export const biomeColor = (biome: Biome): Color => {
  let r = 0;
  let g = 0;
  let b = 0;
  switch (biome) {
    case Biome.Ocean:
      r = 0;
      g = 0;
      b = 140;
      break;
    case Biome.Beach:
      r = 252;
      g = 213;
      b = 106;
      break;
    case Biome.Desert:
      r = 255;
      g = 213;
      b = 89;
      break;
    case Biome.TemperateDesert:
      r = 186;
      g = 135;
      b = 68;
      break;
    case Biome.ScorchedDesert:
      r = 122;
      g = 60;
      b = 13;
      break;
    case Biome.Grassland:
      r = 100;
      g = 142;
      b = 4;
      break;
    case Biome.Shrubland:
      r = 123;
      g = 188;
      b = 49;
      break;
    case Biome.Crag:
      r = 94;
      g = 94;
      b = 94;
      break;
    case Biome.Lake:
      r = 28;
      g = 55;
      b = 175;
      break;
    case Biome.Marsh:
      r = 14;
      g = 79;
      b = 79;
      break;
    case Biome.Plains:
      r = 127;
      g = 160;
      b = 43;
      break;
    case Biome.Forest:
      r = 25;
      g = 117;
      b = 22;
      break;
    case Biome.RainForest:
      r = 4;
      g = 96;
      b = 44;
      break;
    case Biome.Taiga:
      r = 31;
      g = 137;
      b = 95;
      break;
    case Biome.Tundra:
      r = 19;
      g = 221;
      b = 188;
      break;
    case Biome.Snow:
      r = 215;
      g = 224;
      b = 222;
      break;
  }

  return new Color(`rgb(${r}, ${g}, ${b})`);
};

export default Biome;
