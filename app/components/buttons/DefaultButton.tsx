import { Button, ButtonProps } from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';

/**
 * A wrapper around the MUI Button component to encapsulate some common defaults.
 * Primarily intended for use creating more specific Button components rather than for direct use.
 *
 * @param size
 * @param variant
 * @param {ButtonProps} props DefaultButton takes the same props as the MUI Button component
 * It sets default values for size ('large') and variant ('contained')
 * @param ref
 */
const DefaultButtonComponent = (
  { size = 'large', variant = 'contained', ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  return <Button ref={ref} size={size} variant={variant} {...props} />;
};
const DefaultButton = forwardRef(DefaultButtonComponent);

export default DefaultButton;
