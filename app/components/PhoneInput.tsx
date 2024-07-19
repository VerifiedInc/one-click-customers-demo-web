import { ForwardedRef, forwardRef, useState } from 'react';
import { Box, InputBaseProps, TextField, TextFieldProps } from '@mui/material';

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

  const normalizeValue = (value: string) => {
    // Step 1: Remove all non-digit characters
    let digits = value.replace(/\D/g, '');

    // Step 2: Ensure it starts with '1' for the country code if not already
    if (!digits.startsWith('1')) {
      digits = '1' + digits;
    }

    // Step 3: Format the string to '+1 (123) 456-7890'
    // Note: This assumes the country code '1' is always present and correct
    const match = digits.match(/(1)(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    } else {
      // If the format does not match, return the original modified digits with +1
      return `+1 ${digits.substring(1)}`;
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
      <TextField
        type='tel'
        autoComplete='tel'
        {...inputProps}
        inputProps={{ ...inputProps?.inputProps, maxLength: 17 }}
        value={normalizeValue(value || '')}
        onChange={handleChange}
        disabled={disabled}
      />
    </Box>
  );
}

const PhoneInput = forwardRef(PhoneInputComponent);

export default PhoneInput;
