import { useState } from 'react';
import { Box, TextField, TextFieldProps } from '@mui/material';

import { usePrevious } from '~/hooks/usePrevious';
import { inputStyle } from '~/styles/input';

import {
  ChangeEvent,
  TextMaskCustom,
} from '~/features/request/shared/TextMaskCustom';
import { useCredentialsDisplayItemValid } from '~/features/request/CredentialsDisplay/hooks';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { DataFieldClearAdornment } from '~/features/request/DataField/DataFieldClearAdornment';

type TextStyles = Omit<TextFieldProps, 'onChange'> & { onChange: any };

/**
 * This component manages the input of type SSN.
 * @constructor
 */
export function DataFieldSSNInput(props?: TextFieldProps) {
  const { credentialDisplayInfo, handleChangeValueCredential } =
    useCredentialsDisplayItem();
  const { isValid, errorMessage } = useCredentialsDisplayItemValid();

  // Arbitrary states to allow to empty input field.
  const [value, setValue] = useState<string | undefined>(
    credentialDisplayInfo.value
  );
  const previousValue = usePrevious(value);

  const textFieldStyle: TextStyles = {
    ...inputStyle,
    label: <DataFieldLabelText />,
    error: !isValid,
    value,
    onChange: ((e, nativeEvent) => {
      if (!nativeEvent) return;
      handleChangeValueCredential(e.target.value);
      setValue(e.target.value);
    }) as ChangeEvent,
    helperText: isValid
      ? credentialDisplayInfo.credentialRequest?.description
      : errorMessage,
    inputProps: {
      onFocus: () => {
        setValue('');
      },
      onBlur: () => {
        if (value?.length) return;
        setValue(previousValue ?? '');
      },

      // Use onChange event.
      useOnComplete: false,
      // Use unmasked value.
      unmask: true,
      // Mask in the pattern of SSN.
      mask: 'XXX-XX-0000',

      definitions: {
        X: {
          mask: '0',
          displayChar: '•',
        },
      },

      // Set input mode to numeric, so mobile virtual keyboards just show numeric keys.
      inputMode: 'numeric',

      overwrite: false,
      // Tab index for each block.
      tabIndex: 0,
    },
    InputProps: {
      inputComponent: TextMaskCustom as any,
      // prevent this element from being recorded by Sentry
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // 'data-sentry-mask':
      // appContext.config.env.env === 'production' || undefined,
      endAdornment: (
        <DataFieldClearAdornment
          onClick={() => {
            setValue(undefined);
          }}
        />
      ),
    },
    fullWidth: true,
    ...props,
  };

  return (
    <Box width='100%'>
      <TextField {...textFieldStyle} />
    </Box>
  );
}
