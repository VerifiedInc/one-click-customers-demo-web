import { ButtonProps } from '@mui/material';
import DefaultButton from './DefaultButton';

/**
 * A button indicating the primary action for a user to perform
 * on a given screen/section, i.e. submitting a form
 *
 * PrimaryButton is an abstraction over the MUI Button component
 * encapsulating props shared by buttons of this type.
 * See the Button component docs for props, options, etc. https://mui.com/components/buttons/
 *
 * @param {ButtonProps} props PrimaryButton takes the same props as the MUI Button component
 * and always uses a color of 'primary'
 */
const PrimaryButton = ({
  children,
  type = 'submit',
  ...props
}: ButtonProps) => {
  return (
    <DefaultButton type={type} color='primary' {...props}>
      {children}
    </DefaultButton>
  );
};

export default PrimaryButton;
