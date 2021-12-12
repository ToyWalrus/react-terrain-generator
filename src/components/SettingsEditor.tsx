import React, { useState } from 'react';
import PlaneDrawerSettings from '../util/PlaneDrawerSettings';

interface ISettingsEditorProps {
  settings: PlaneDrawerSettings;
  onSubmitSettings: (newSettings: PlaneDrawerSettings) => void;
}

const SettingsEditor = (props: ISettingsEditorProps) => {
  const [settings, setSettings] = useState(props.settings);

  return <div />;
};

export default SettingsEditor;
