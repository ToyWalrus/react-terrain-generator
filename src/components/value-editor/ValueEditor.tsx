import React from 'react';
import './ValueEditor.css';

interface IValueEditorProps {
  value: any;
  onValueChanged: (val: any) => void;
  float?: boolean;
  step?: number;
  label?: string;
  maxValue?: number;
  minValue?: number;
  className?: string;
}

const ValueEditor = ({
  label,
  value,
  onValueChanged,
  float,
  className,
  maxValue,
  minValue,
  step,
}: IValueEditorProps) => {
  let inputType = 'text';
  if (typeof value === 'number') {
    inputType = 'number';
  } else if (typeof value === 'boolean') {
    inputType = 'checkbox';
  }

  return (
    <div className={'value-editor' + (className ? ` ${className}` : '')}>
      {label && <span className="value-label">{label}</span>}
      <input
        type={inputType}
        value={value}
        step={step}
        onChange={e => {
          let val: any = e.target.value;
          if (typeof value === 'number') {
            val = float ? Number.parseFloat(val) : Number.parseInt(e.target.value);

            if (minValue !== undefined && val < minValue) {
              val = minValue;
            }
            if (maxValue !== undefined && val > maxValue) {
              val = maxValue;
            }

            onValueChanged(val);
          } else if (inputType === 'checkbox') {
            onValueChanged(val === 'true');
          } else {
            onValueChanged(e.target.value);
          }
        }}
      />
    </div>
  );
};

ValueEditor.Checkbox = ({ label, value, onValueChanged, className }: IValueEditorProps) => {
  return (
    <div className={'value-editor checkbox-editor' + (className ? ` ${className}` : '')}>
      <div
        className={'checkbox ' + (!!value ? 'checked' : 'unchecked')}
        onClick={() => onValueChanged(!value)}
      />
      {label && <span className="value-label">{label}</span>}
    </div>
  );
};

export default ValueEditor;
