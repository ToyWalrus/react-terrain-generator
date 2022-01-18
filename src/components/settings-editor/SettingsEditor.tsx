import React, { useEffect, useState } from 'react';
import PlaneDrawerSettings from '../../util/PlaneDrawerSettings';
import ValueEditor from '../value-editor/ValueEditor';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import { defaultSettings } from './Defaults';
import './SettingsEditor.scss';
import { IconButton } from '@material-ui/core';
import classnames from 'classnames';

interface ICanvasSize {
  canvasHeight: number;
  canvasWidth: number;
}

interface ISettingsEditorProps {
  settings: PlaneDrawerSettings;
  onSubmitSettings: (newSettings: PlaneDrawerSettings, keepSeed: boolean) => void;
  onChangeCanvasSize: (newSize: ICanvasSize) => void;
  onHideSettings?: () => void;
  className?: string;
}

const SettingsEditor = (props: ISettingsEditorProps & ICanvasSize) => {
  const { settings, canvasWidth, canvasHeight, onCanvasWidthChanged, onCanvasHeightChanged, onSettingsChanged } =
    useSettingsEditorContext(props);

  return (
    <div className={classnames('settings-editor', props.className)}>
      <div className="title-section">
        <h2 className="settings-title">Settings</h2>
        <div className="icon-buttons">
          <IconButton onClick={() => props.onHideSettings && props.onHideSettings()}>
            <ArrowIcon fontSize="large" />
          </IconButton>
        </div>
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
            step={0.2}
            minValue={0.1}
            maxValue={1}
            value={settings.persistance}
            onValueChanged={v => onSettingsChanged({ persistance: v })}
            label="Persistance"
            tooltip='This setting affects the "smoothing" factor'
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
          />
          <ValueEditor
            float
            step={0.1}
            minValue={0.1}
            value={settings.scaleSize}
            onValueChanged={v => onSettingsChanged({ scaleSize: v })}
            label="Scale"
          />
        </div>
        <div className="settings-row">
          <ValueEditor.Checkbox
            value={settings.autoRotate}
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
      </div>
      <div className="buttons">
        <input type="button" onClick={() => props.onSubmitSettings(settings, false)} value="Randomize Seed" />
        <span className="spacer" />
        <input type="button" onClick={() => onSettingsChanged(defaultSettings)} value="Default Settings" />
        <input type="button" onClick={() => props.onSubmitSettings(settings, true)} value="Save" />
      </div>
    </div>
  );
};

const useSettingsEditorContext = (props: ISettingsEditorProps & ICanvasSize) => {
  const [settings, setSettings] = useState(props.settings);
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

  return {
    settings,
    canvasHeight,
    canvasWidth,
    onCanvasHeightChanged,
    onCanvasWidthChanged,
    onSettingsChanged,
  };
};

export default SettingsEditor;
