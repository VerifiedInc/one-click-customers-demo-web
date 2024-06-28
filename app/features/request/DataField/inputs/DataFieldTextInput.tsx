import { useRef, useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Box, TextField, TextFieldProps } from '@mui/material';

import { inputStyle } from '~/styles/input';

import { useCredentialsDisplayItemValid } from '~/features/request/CredentialsDisplay/hooks';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { useDataFieldInputExtra } from '~/features/request/DataField/hooks';
import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { DataFieldClearAdornment } from '~/features/request/DataField/DataFieldClearAdornment';

/**
 * This component manages the input of type Text.
 * @constructor
 */
export function DataFieldTextInput(props?: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const credentialsDisplayItem = useCredentialsDisplayItem();
  useDataFieldInputExtra({ credentialsDisplayItem, inputRef });

  const { isValid, errorMessage } = useCredentialsDisplayItemValid();
  const { credentialDisplayInfo, handleChangeValueCredential } =
    credentialsDisplayItem;
  const [searchParams] = useSearchParams();

  // Autofill phone number if it is passed as a query param.
  useEffect(() => {
    const email = searchParams.get('email');

    if (
      email &&
      credentialDisplayInfo.credentialRequest?.type === 'EmailCredential'
    ) {
      handleChangeValueCredential(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const textFieldStyle: TextFieldProps = {
    inputRef,
    ...inputStyle,
    label: <DataFieldLabelText />,
    error: !isValid,
    value: credentialDisplayInfo.value || '',
    onChange: (e) => handleChangeValueCredential(e.target.value),
    helperText: isValid
      ? credentialDisplayInfo.credentialRequest?.description
      : errorMessage,
    InputProps: {
      // prevent this element from being recorded by Sentry
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // 'data-sentry-mask':
      //   appContext.config.env.env === 'production' || undefined,
      // The placeholder must be empty in order to not display the one from google places API.
      placeholder: '',
      endAdornment: <DataFieldClearAdornment />,
    },
    inputProps: {
      // Tab index for each block.
      tabIndex: 0,
      autoCorrect: 'off',
      autoCapitalize: 'off',
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
