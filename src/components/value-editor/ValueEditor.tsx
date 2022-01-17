import React from 'react';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import './ValueEditor.scss';

interface IValueEditorProps {
  value: any;
  onValueChanged: (val: any) => void;
  float?: boolean;
  step?: number;
  label?: string;
  maxValue?: number;
  minValue?: number;
  className?: string;
  tooltip?: string;
}

const ValueEditor = ({
  label,
  value,
  onValueChanged,
  float,
  className,
  tooltip,
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: any = e.target.value;
    if (typeof value === 'number') {
      val = float ? Number.parseFloat(val) : Number.parseInt(e.target.value);
      onValueChanged(val);
    } else {
      onValueChanged(val);
    }
  };

  const validateInput = (val: any) => {
    if (typeof val !== 'number') {
      if (inputType === 'checkbox') {
        onValueChanged(val === 'true');
      } else {
        onValueChanged(val);
      }
    } else {
      if (minValue !== undefined && val < minValue) {
        val = minValue;
      }
      if (maxValue !== undefined && val > maxValue) {
        val = maxValue;
      }

      onValueChanged(val);
    }
  };

  return (
    <div className={'value-editor' + (className ? ` ${className}` : '')}>
      {label && (
        <div className="value-label">
          {label}
          {tooltip && <InfoIcon className="info-icon" fontSize="small" data-tip={tooltip} />}
        </div>
      )}
      <input
        type={inputType}
        value={value}
        step={step}
        onSubmit={onChange}
        onChange={onChange}
        onBlur={() => validateInput(value)}
      />
    </div>
  );
};

ValueEditor.Checkbox = ({ label, value, onValueChanged, className }: IValueEditorProps) => {
  return (
    <div className={'value-editor checkbox-editor' + (className ? ` ${className}` : '')}>
      <div className={'checkbox ' + (!!value ? 'checked' : 'unchecked')} onClick={() => onValueChanged(!value)} />
      {label && <span className="value-label">{label}</span>}
    </div>
  );
};

export default ValueEditor;
