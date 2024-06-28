import { forwardRef, ReactNode, useState } from 'react';
import { IMask } from 'react-imask';
import { Box, InputProps, TextField, TextFieldProps } from '@mui/material';

import { formatDateDDMMYYYY } from '~/utils/date';
import { inputStyle } from '~/styles/input';

import { TextMaskCustom } from './TextMaskCustom';

const parseToValue = (str: string) => {
  const timestamp = new Date(Date.parse(str));
  timestamp.setUTCHours(12);
  return String(+timestamp);
};

type DateInputProps = {
  name?: string;
  value?: string;
  label?: ReactNode;
  error?: boolean;
  helperText?: string;
  onChange?(event: { name: string; target: { value: string } }): void;
  disabled?: boolean;
  allowFutureDates?: boolean;
  InputProps?: InputProps;
};

/**
 * The input with date format.
 * @constructor
 */
function DateInputComponent(
  {
    name,
    label = 'Date of Birth',
    value,
    error,
    helperText,
    onChange,
    disabled,
    allowFutureDates = true,
    InputProps,
  }: Readonly<DateInputProps>,
  ref: any
) {
  // Arbitrary value to format the timestamp into human-readable date.
  const [localValue, setLocalValue] = useState<string>(
    value ? formatDateDDMMYYYY(value) : ''
  );
  const nowDate = new Date();
  const minDate = 1;
  const minMonth = 1;
  const minYear = 1900;
  // Limit to the actual date when is not allowed future date.
  const maxDate = allowFutureDates ? 31 : nowDate.getDate();
  const maxMonth = allowFutureDates ? 12 : nowDate.getMonth() + 1;
  const maxYear = allowFutureDates ? 2200 : nowDate.getFullYear();

  const textFieldStyle: TextFieldProps = {
    ...inputStyle,
    name: name + '_facade',
    label,
    error,
    value: localValue,
    disabled,
    onChange: (e) => {
      const newValue = parseToValue(e.target.value);

      if (isNaN(newValue as any)) return;

      onChange?.({
        name: name || '',
        target: { value: newValue },
      });
      setLocalValue(e.target.value);
    },
    helperText,
    inputProps: {
      // Set the input mode to numeric.
      inputMode: 'numeric',
      // Tab index for each block.
      tabIndex: 0,
      // Use onComplete event.
      useOnComplete: false,
      // Mask type date.
      mask: Date,
      // Receive masked value on change.
      unmask: false,
      // make placeholder always visible.
      lazy: false,
      // Auto fix to the min/max boundaries.
      autofix: true,
      // Do not overwrite characters.
      overwrite: false,
      // Skip invalid characters.
      skipInvalid: true,
      // Set min date value.
      min: new Date(minYear, minMonth - 1, minDate, 0, 0, 0, 0),
      // Set max possible date, so it can create a boundary over it.
      max: new Date(maxYear, maxMonth - 1, maxDate, 23, 59, 59, 999),
      // Pattern structure defined by blocks.
      pattern: 'm/d/Y',
      // Blocks configuration for each pattern fragment.
      blocks: {
        d: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          length: 2,
        },
        m: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          length: 2,
        },
        Y: {
          mask: IMask.MaskedRange,
          from: 1900,
          to: maxYear,
        },
      },

      // Define the value format conversion.
      parse: (str: string) => {
        const timestamp = new Date(Date.parse(str));
        timestamp.setHours(12);
        return String(+timestamp);
      },

      // Define the display format conversion.
      format: formatDateDDMMYYYY,
    },
    InputProps: {
      ...InputProps,
      inputComponent: TextMaskCustom as any,
    },
    fullWidth: true,
  };

  return (
    <Box width='100%'>
      <input
        name={name}
        value={
          value || (localValue && !isNaN(parseToValue(localValue) as any))
            ? parseToValue(localValue)
            : ''
        }
        hidden
        readOnly
      />
      <TextField {...textFieldStyle} inputRef={ref} />
    </Box>
  );
}

export const DateInput = forwardRef(DateInputComponent);
