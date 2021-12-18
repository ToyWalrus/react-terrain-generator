import React, { useState } from 'react';
import PlaneDrawerSettings from '../../util/PlaneDrawerSettings';
import ValueEditor from '../value-editor/ValueEditor';

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
  const { canvasWidth, canvasHeight, onCanvasWidthChanged, onCanvasHeightChanged } =
    useSettingsEditorContext(props);

  return (
    <div id="Settings">
      <h2 className="settings-title">Settings</h2>
      <div className="canvas-edit-section">
        <ValueEditor
          value={canvasWidth}
          onValueChanged={onCanvasWidthChanged}
          label="Canvas Width"
        />
        <ValueEditor
          value={canvasHeight}
          onValueChanged={onCanvasHeightChanged}
          label="Canvas Height"
        />
      </div>
      <div className="general-settings-section"></div>
      <div className="plane-drawer-edit-section"></div>
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

  return { settings, canvasHeight, canvasWidth, onCanvasHeightChanged, onCanvasWidthChanged };
};

export default SettingsEditor;
