import { ForwardedRef, forwardRef, useState } from 'react';
import { Box, InputBaseProps, TextField, TextFieldProps } from '@mui/material';

import { InputMask } from './InputMask';

export type PhoneInputProps = {
  label?: string;
  name?: string;
  helperText?: string;
  initialValue?: string;
  onChange?(value: string): void;
  error?: boolean;
  handleChangeCountry?(newCountry: string): void;
  value?: string;
  variant?: TextFieldProps['variant'];
  autoFocus?: boolean;
  disabled?: boolean;
  inputProps?: InputBaseProps['inputProps'];
};

/**
 * Renders a phone input component with country selector and masking.
 */
function PhoneInputComponent(
  {
    name = 'phone',
    label,
    helperText,
    onChange,
    initialValue = '',
    error = false,
    value: valueProp,
    autoFocus = false,
    disabled = false,
    inputProps: _inputProps,
    ...rest
  }: Readonly<PhoneInputProps>,
  ref: ForwardedRef<HTMLInputElement>
) {
  /**
   * Represents the value of the phone input. Initially set to the initialValue passed in the props.
   */
  const [value, setValue] = useState<string>(initialValue);

  /**
   * Handles the change event of the phone input field.
   *
   * @param e - The change event object.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const targetValue = value.replace(/[^0-9+]/g, '');

    // set the value in component state, which controls the input field
    setValue(targetValue);

    // pass the value to the parent component to be handled there as well
    if (onChange) {
      onChange(targetValue);
    }
  };

  const inputProps: TextFieldProps = {
    inputRef: ref,
    autoFocus,
    name: '_' + name,
    label,
    helperText,
    error,
    autoComplete: 'tel',
    inputProps: {
      placeholder: 'Phone',
      inputMode: 'numeric',
      ..._inputProps,
    },
    fullWidth: true,
    ...rest,
  };

  return (
    <Box width='100%'>
      {/* Use arbitrary input since the text field will contain formatted values to display on UI */}
      <input name={name} value={value} readOnly hidden />
      <InputMask
        mask='+1 (999) 999-9999'
        maskPlaceholder={null}
        // if the value prop is passed, use it, otherwise use the value from component state
        // this allows the parent component to control the value of the input field
        value={valueProp ?? value}
        onChange={handleChange}
        disabled={disabled}
      >
        <TextField {...inputProps} />
      </InputMask>
    </Box>
  );
}

const PhoneInput = forwardRef(PhoneInputComponent);

export default PhoneInput;
