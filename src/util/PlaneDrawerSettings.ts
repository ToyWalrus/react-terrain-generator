import Settings from './Settings';

export default class PlaneDrawerSettings extends Settings {
  scaleSize: number;
  heightAmplify: number;
  wireframe: boolean;
  autoRotate: boolean;

  constructor(settings?: Partial<PlaneDrawerSettings>) {
    super(settings);

    this.scaleSize = settings?.scaleSize || 3;
    this.heightAmplify = settings?.heightAmplify || 100;
    this.wireframe = settings?.wireframe === undefined ? true : settings.wireframe;
    this.autoRotate = settings?.autoRotate === undefined ? true : settings.autoRotate;
  }
}
