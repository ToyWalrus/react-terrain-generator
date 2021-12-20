import React, { useState } from 'react';
import PlaneDrawerSettings from '../../util/PlaneDrawerSettings';
import ValueEditor from '../value-editor/ValueEditor';
import './SettingsEditor.css';

interface ICanvasSize {
  canvasHeight: number;
  canvasWidth: number;
}

interface ISettingsEditorProps {
  settings: PlaneDrawerSettings;
  onSubmitSettings: (newSettings: PlaneDrawerSettings) => void;
  onChangeCanvasSize: (newSize: ICanvasSize) => void;
}

const SettingsEditor = (props: ISettingsEditorProps & ICanvasSize) => {
  const {
    settings,
    canvasWidth,
    canvasHeight,
    onCanvasWidthChanged,
    onCanvasHeightChanged,
    onSettingsChanged,
  } = useSettingsEditorContext(props);

  return (
    <div className="settings-editor">
      <h2 className="settings-title">Settings</h2>
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
          <ValueEditor
            value={settings.seed}
            onValueChanged={v => onSettingsChanged({ seed: v })}
            label="Seed"
          />
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
          />
          <ValueEditor
            float
            step={0.2}
            minValue={0.1}
            maxValue={1}
            value={settings.persistance}
            onValueChanged={v => onSettingsChanged({ persistance: v })}
            label="Persistance"
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
              onSettingsChanged({ autoRotate: v})
              props.onSubmitSettings(
                new PlaneDrawerSettings({
                  ...props.settings,
                  autoRotate: v,
                }),
              );
            }}
            label="Auto Rotate"
          />
          <ValueEditor.Checkbox
            value={settings.wireframe}
            onValueChanged={v => {
              onSettingsChanged({ wireframe: v})
              props.onSubmitSettings(
                new PlaneDrawerSettings({
                  ...props.settings,
                  wireframe: v,
                }),
              );
            }}
            label="Wireframe Only"
          />
        </div>
      </div>
      <div className="buttons">
        <input
          type="button"
          onClick={() => onSettingsChanged(props.settings)}
          value="Reset Settings"
        />
        <input type="button" onClick={() => props.onSubmitSettings(settings)} value="Save" />
      </div>
    </div>
  );
};

const useSettingsEditorContext = (props: ISettingsEditorProps & ICanvasSize) => {
  const [settings, setSettings] = useState(props.settings);
  const [canvasHeight, setCanvasHeight] = useState(props.canvasHeight);
  const [canvasWidth, setCanvasWidth] = useState(props.canvasWidth);

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
