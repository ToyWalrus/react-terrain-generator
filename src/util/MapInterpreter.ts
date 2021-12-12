import Biome from '../terrain/Biome';
import Elevation from '../terrain/Elevation';
import Moisture from '../terrain/Moisture';
import Temperature from '../terrain/Temperature';

// All levels are from range 0.0f to 1.0f

// Elevation cut-offs
const SEA_LEVEL = 0.17;
const LOW_LEVEL = 0.25;
const VALLEY_LEVEL = 0.4;
const AVERAGE_LEVEL = 0.55;
const HILL_LEVEL = 0.7;
const MOUNTAIN_LEVEL = 0.9;

// Moisture cut-offs
const BARE = 0.15;
const DRY = 0.3;
const TEMPERATE = 0.55;
const MOIST = 0.7;
const HUMID = 0.85;

// Temperature cut-offs
const FREEZING = 0.1;
const COLD = 0.4;
const AVERAGE = 0.65;
const WARM = 0.75;
const HOT = 0.9;

const getElevation = (e: number): Elevation => {
  if (e < SEA_LEVEL) return Elevation.SeaLevel;
  if (e < LOW_LEVEL) return Elevation.Low;
  if (e < VALLEY_LEVEL) return Elevation.Valley;
  if (e < AVERAGE_LEVEL) return Elevation.Average;
  if (e < HILL_LEVEL) return Elevation.Hill;
  if (e < MOUNTAIN_LEVEL) return Elevation.Mountain;
  else return Elevation.Peak;
};

const getTemperature = (t: number): Temperature => {
  if (t < FREEZING) return Temperature.Freezing;
  if (t < COLD) return Temperature.Cold;
  if (t < AVERAGE) return Temperature.Average;
  if (t < WARM) return Temperature.Warm;
  if (t < HOT) return Temperature.Hot;
  else return Temperature.Scorched;
};

const getMoisture = (m: number): Moisture => {
  if (m < BARE) return Moisture.Bare;
  if (m < DRY) return Moisture.Dry;
  if (m < TEMPERATE) return Moisture.Average;
  if (m < MOIST) return Moisture.Moist;
  if (m < HUMID) return Moisture.Humid;
  else return Moisture.Wet;
};

const getBiome = (elevation: number, temperature: number, moisture: number): Biome => {
  switch (getElevation(elevation)) {
    case Elevation.SeaLevel:
      return Biome.Ocean;

    case Elevation.Low:
      switch (getTemperature(temperature)) {
        case Temperature.Freezing:
        case Temperature.Cold:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Tundra;
            default:
              return Biome.Beach;
          }
        default:
          return Biome.Beach;
      }

    case Elevation.Valley:
      switch (getTemperature(temperature)) {
        case Temperature.Freezing:
          return Biome.Tundra;
        case Temperature.Cold:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Tundra;
            default:
              return Biome.Taiga;
          }
        case Temperature.Average:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
              return Biome.Desert;
            case Moisture.Dry:
              return Biome.Plains;
            case Moisture.Average:
              return Biome.Grassland;
            case Moisture.Average:
              return Biome.Forest;
            default:
              return Biome.RainForest;
          }
        case Temperature.Warm:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Desert;
            case Moisture.Average:
            case Moisture.Average:
              return Biome.Forest;
            default:
              return Biome.RainForest;
          }
        case Temperature.Hot:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
              return Biome.ScorchedDesert;
            case Moisture.Dry:
              return Biome.Desert;
            case Moisture.Average:
              return Biome.TemperateDesert;
            case Moisture.Average:
              return Biome.Shrubland;
            default:
              return Biome.Marsh;
          }
        default:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.ScorchedDesert;
            default:
              return Biome.TemperateDesert;
          }
      }

    case Elevation.Average:
      switch (getTemperature(temperature)) {
        case Temperature.Freezing:
          return Biome.Tundra;
        case Temperature.Cold:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Tundra;
            case Moisture.Average:
              return Biome.Taiga;
            default:
              return Biome.Snow;
          }
        case Temperature.Average:
        case Temperature.Warm:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
              return Biome.Desert;
            case Moisture.Dry:
              return Biome.Plains;
            case Moisture.Average:
              return Biome.Grassland;
            case Moisture.Average:
              return Biome.Shrubland;
            default:
              return Biome.Marsh;
          }
        case Temperature.Hot:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
              return Biome.ScorchedDesert;
            case Moisture.Dry:
              return Biome.Desert;
            case Moisture.Average:
              return Biome.Grassland;
            case Moisture.Average:
              return Biome.Shrubland;
            default:
              return Biome.Marsh;
          }
        default:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.ScorchedDesert;
            default:
              return Biome.TemperateDesert;
          }
      }

    case Elevation.Hill:
      switch (getTemperature(temperature)) {
        case Temperature.Freezing:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
            case Moisture.Average:
              return Biome.Tundra;
            default:
              return Biome.Snow;
          }
        case Temperature.Cold:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Taiga;
            default:
              return Biome.Snow;
          }
        case Temperature.Average:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Grassland;
            default:
              return Biome.Forest;
          }
        case Temperature.Warm:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Desert;
            case Moisture.Average:
            case Moisture.Average:
              return Biome.Forest;
            default:
              return Biome.RainForest;
          }
        case Temperature.Hot:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.ScorchedDesert;
            case Moisture.Average:
              return Biome.Forest;
            default:
              return Biome.RainForest;
          }
        default:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Crag;
            default:
              return Biome.Forest;
          }
      }

    case Elevation.Mountain:
      switch (getTemperature(temperature)) {
        case Temperature.Freezing:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Tundra;
            default:
              return Biome.Snow;
          }
        case Temperature.Cold:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Taiga;
            default:
              return Biome.Snow;
          }
        default:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Crag;
            default:
              return Biome.Forest;
          }
      }

    case Elevation.Peak:
      switch (getTemperature(temperature)) {
        case Temperature.Freezing:
        case Temperature.Cold:
        case Temperature.Average:
          return Biome.Snow;
        default:
          switch (getMoisture(moisture)) {
            case Moisture.Bare:
            case Moisture.Dry:
              return Biome.Crag;
            default:
              return Biome.Forest;
          }
      }
  }
};

export { getBiome };
