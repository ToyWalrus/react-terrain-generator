import React from 'react';
import './ValueEditor.css';

interface IValueEditorProps {
  value: number;
  onValueChanged: (val: number) => void;
  label?: string;
  className?: string;
}

const ValueEditor = ({ label, value, onValueChanged, className }: IValueEditorProps) => {
  return (
    <div className={'value-editor' + (className ? ` ${className}` : '')}>
      {label && <span className="value-label">{label}</span>}
      <input
        value={value}
        type="number"
        onChange={e => onValueChanged(Number.parseFloat(e.target.value))}
      />
    </div>
  );
};

export default ValueEditor;
