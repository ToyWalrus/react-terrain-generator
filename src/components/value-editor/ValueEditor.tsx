import React from 'react';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import classnames from 'classnames';
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
  disabled?: boolean;
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
  disabled,
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
      {label && <Label label={label} disabled={disabled} tooltip={tooltip} />}
      <input
        type={inputType}
        value={value}
        step={step}
        onSubmit={onChange}
        onChange={onChange}
        onBlur={() => validateInput(value)}
        disabled={disabled}
      />
    </div>
  );
};

ValueEditor.Checkbox = ({
  label,
  value,
  onValueChanged,
  className,
  tooltip,
  disabled,
  inverseTooltipVisibility,
}: IValueEditorProps & { inverseTooltipVisibility?: boolean }) => {
  return (
    <div className={classnames('value-editor checkbox-editor', className)}>
      <div
        className={classnames('checkbox', {
          checked: !!value,
          unchecked: !value,
          disabled,
        })}
        onClick={() => {
          if (!disabled) {
            onValueChanged(!value);
          }
        }}
      />
      {label && (
        <Label
          label={label}
          disabled={disabled}
          tooltip={tooltip}
          inverseTooltipVisibility={inverseTooltipVisibility}
        />
      )}
    </div>
  );
};

interface ILabelProps {
  disabled: boolean | undefined;
  label: string | undefined;
  tooltip: string | undefined;
  inverseTooltipVisibility?: boolean;
}

const Label = ({ disabled, label, tooltip, inverseTooltipVisibility }: ILabelProps) => {
  return (
    <div className={classnames('value-label', { disabled })}>
      <span className="label">{label}</span>
      {tooltip && (
        <InfoIcon
          className={classnames('info-icon', { visible: inverseTooltipVisibility ? disabled : !disabled })}
          fontSize="small"
          data-tip={tooltip}
        />
      )}
    </div>
  );
};

export default ValueEditor;
