import { ForwardedRef, forwardRef, useState } from 'react';
import { Box, InputBaseProps, TextField, TextFieldProps } from '@mui/material';

import { IMaskInput } from '~/components/IMaskInput';

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
    const targetValue = e.target.value;

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
    // if the value prop is passed, use it, otherwise use the value from component state
    // this allows the parent component to control the value of the input field
    value: valueProp ?? value,
    error,
    onChange: handleChange,
    autoComplete: 'tel',
    disabled,
    inputProps: {
      placeholder: 'Phone',
      // Receive unmasked value on change.
      unmask: true,
      // Make placeholder always visible
      lazy: true,
      mask: '{+1} (000) 000-0000',
      inputMode: 'numeric',
      ..._inputProps,
    },
    InputProps: {
      inputComponent: IMaskInput as any,
    },
    fullWidth: true,
    ...rest,
  };

  return (
    <Box width='100%'>
      {/* Use arbitrary input since the text field will contain formatted values to display on UI */}
      <input
        name={name}
        value={value.replace(/[^0-9+]/m, '')}
        readOnly
        hidden
      />
      <TextField {...inputProps} />
    </Box>
  );
}

const PhoneInput = forwardRef(PhoneInputComponent);

export default PhoneInput;
