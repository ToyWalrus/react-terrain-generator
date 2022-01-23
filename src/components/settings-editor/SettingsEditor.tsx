import React, { useEffect, useState } from 'react';
import PlaneDrawerSettings from '../../util/PlaneDrawerSettings';
import ValueEditor from '../value-editor/ValueEditor';
import ArrowIcon from '@material-ui/icons/ChevronLeft';
import { defaultSettings } from './Defaults';
import { Drawer, IconButton } from '@material-ui/core';
import classnames from 'classnames';
import './SettingsEditor.scss';
import Spacer from '../spacer/Spacer';

export interface ICanvasSize {
  canvasHeight: number;
  canvasWidth: number;
}

interface ISettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ISettingsEditorProps {
  settings: PlaneDrawerSettings;
  onSubmitSettings: (newSettings: PlaneDrawerSettings, keepSeed: boolean) => void;
  onChangeCanvasSize: (newSize: ICanvasSize) => void;
  onToggleDetailDisplay: (visible: boolean) => void;
  className?: string;
}

type SettingsProps = ICanvasSize & ISettingsEditorProps & Partial<ISettingsDrawerProps>;

const SettingsEditor = (props: SettingsProps) => {
  const {
    settings,
    canvasWidth,
    canvasHeight,
    detailsVisible,
    setDetailsVisible,
    onCanvasWidthChanged,
    onCanvasHeightChanged,
    onSettingsChanged,
    onRerenderTerrain,
  } = useSettingsEditorContext(props);

  return (
    <div className={classnames('settings-editor', props.className)}>
      <div className="title-section">
        {props.onClose && (
          <IconButton onClick={props.onClose} className="close-button">
            <ArrowIcon fontSize="large" />
          </IconButton>
        )}
        <div className="settings-title">Settings</div>
      </div>
      <div className="canvas-edit-section settings-row">
        <ValueEditor
          step={20}
          minValue={100}
          value={canvasWidth}
          onValueChanged={onCanvasWidthChanged}
          label="Canvas Width"
        />
        <ValueEditor
          step={20}
          minValue={100}
          value={canvasHeight}
          onValueChanged={onCanvasHeightChanged}
          label="Canvas Height"
        />
      </div>
      <div className="general-settings-section">
        <div className="settings-row">
          <ValueEditor value={settings.seed} onValueChanged={v => onSettingsChanged({ seed: v })} label="Seed" />
        </div>
        <div className="settings-row">
          <ValueEditor
            value={settings.arrWidth}
            onValueChanged={v => onSettingsChanged({ arrWidth: v })}
            label="Horizontal Sections"
          />
          <ValueEditor
            value={settings.arrHeight}
            onValueChanged={v => onSettingsChanged({ arrHeight: v })}
            label="Vertical Sections"
          />
        </div>
        <div className="settings-row">
          <ValueEditor
            minValue={1}
            maxValue={10}
            value={settings.octaves}
            onValueChanged={v => onSettingsChanged({ octaves: v })}
            label="Octaves"
            tooltip="This setting affects the number of times the landscape is blended"
          />
          <ValueEditor
            float
            step={0.1}
            minValue={0.1}
            maxValue={1}
            value={settings.persistence}
            onValueChanged={v => onSettingsChanged({ persistence: v })}
            label="Persistence"
            tooltip='This setting affects the "smoothing" factor; a lower value is more smooth'
          />
        </div>
      </div>
      <div className="plane-drawer-edit-section">
        <div className="settings-row">
          <ValueEditor
            step={10}
            minValue={10}
            value={settings.heightAmplify}
            onValueChanged={v => onSettingsChanged({ heightAmplify: v })}
            label="Height Amplification"
            tooltip="For a cleaner look, reduce this value when lowering the Octave count, or raising Persistence"
          />
          <ValueEditor
            float
            step={0.1}
            minValue={0.1}
            value={settings.scaleSize}
            onValueChanged={v => onSettingsChanged({ scaleSize: v })}
            label="Scale"
            tooltip="Grow or shrink the terrain proportionally"
          />
        </div>
        <div className="settings-row">
          <ValueEditor.Checkbox
            value={settings.autoRotate}
            disabled={detailsVisible}
            onValueChanged={v => {
              onSettingsChanged({ autoRotate: v });
              props.onSubmitSettings(
                new PlaneDrawerSettings({
                  ...props.settings,
                  autoRotate: v,
                }),
                true,
              );
            }}
            label="Auto Rotate"
            inverseTooltipVisibility
            tooltip="Auto-rotate unavailable while displaying details"
          />
          <ValueEditor.Checkbox
            value={settings.wireframe}
            onValueChanged={v => {
              onSettingsChanged({ wireframe: v });
              props.onSubmitSettings(
                new PlaneDrawerSettings({
                  ...props.settings,
                  wireframe: v,
                }),
                true,
              );
            }}
            label="Wireframe Only"
          />
        </div>
        <div className="settings-row">
          <ValueEditor.Checkbox
            value={detailsVisible}
            onValueChanged={v => {
              setDetailsVisible(v);
              props.onToggleDetailDisplay(v);
              props.onSubmitSettings(
                new PlaneDrawerSettings({
                  ...props.settings,
                  autoRotate: v ? false : settings.autoRotate,
                }),
                true,
              );
            }}
            label="Display Details"
          />
        </div>
      </div>
      <Spacer />
      <div className="buttons">
        <input type="button" onClick={() => onRerenderTerrain(false)} value="Randomize Seed" />
        <Spacer />
        <input type="button" onClick={() => onSettingsChanged(defaultSettings)} value="Default Settings" />
        <input type="button" onClick={() => onRerenderTerrain(true)} value="Apply" />
      </div>
    </div>
  );
};

const SettingsDrawer = (props: SettingsProps) => {
  return (
    <Drawer variant="persistent" anchor="left" open={props.open} onClose={props.onClose} transitionDuration={300}>
      <SettingsEditor {...props} />
    </Drawer>
  );
};

const useSettingsEditorContext = (props: SettingsProps) => {
  const [settings, setSettings] = useState(props.settings);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(props.canvasHeight);
  const [canvasWidth, setCanvasWidth] = useState(props.canvasWidth);

  useEffect(() => {
    onSettingsChanged({ seed: props.settings.seed });
  }, [props.settings.seed]);

  const onCanvasHeightChanged = (newHeight: number) => {
    setCanvasHeight(newHeight);
    props.onChangeCanvasSize({ canvasHeight: newHeight, canvasWidth });
  };

  const onCanvasWidthChanged = (newWidth: number) => {
    setCanvasWidth(newWidth);
    props.onChangeCanvasSize({ canvasHeight, canvasWidth: newWidth });
  };

  const onSettingsChanged = (newSettings: Partial<PlaneDrawerSettings>) => {
    const updated = Object.assign({}, settings, newSettings);
    setSettings(updated);
  };

  const onRerenderTerrain = (keepSeed: boolean) => {
    if (!detailsVisible) {
      props.onSubmitSettings(settings, keepSeed);
    } else {
      props.onSubmitSettings(
        {
          ...settings,
          autoRotate: false,
        },
        keepSeed,
      );
    }
  };

  return {
    settings,
    canvasHeight,
    canvasWidth,
    detailsVisible,
    onRerenderTerrain,
    setDetailsVisible,
    onCanvasHeightChanged,
    onCanvasWidthChanged,
    onSettingsChanged,
  };
};

export default SettingsDrawer;
export { SettingsEditor };
