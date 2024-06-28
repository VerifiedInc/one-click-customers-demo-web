import { useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Box } from '@mui/material';

import { useCredentialsDisplayItemValid } from '~/features/request/CredentialsDisplay/hooks';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { DataFieldClearAdornment } from '~/features/request/DataField/DataFieldClearAdornment';
import PhoneInput from '~/components/PhoneInput';
import { inputStyle } from '~/styles/input';

/**
 * This component manages the input of type Phone.
 * @constructor
 */
export function DataFieldPhoneInput() {
  const { credentialDisplayInfo, handleChangeValueCredential } =
    useCredentialsDisplayItem();
  const { isValid, errorMessage } = useCredentialsDisplayItemValid();
  const [searchParams] = useSearchParams();
  const phoneParam = searchParams.get('phone');

  const handleChangeCountry = (_value: string) => {
    handleChangeValueCredential('');
  };

  // Autofill phone number if it is passed as a query param.
  useEffect(() => {
    if (phoneParam) {
      handleChangeValueCredential(phoneParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneParam]);

  const handleChange = (newValue: string) => {
    console.log({ newValue });
    handleChangeValueCredential(newValue);
  };

  const helperText = isValid
    ? credentialDisplayInfo.credentialRequest?.description
    : errorMessage;

  return (
    <Box width='100%'>
      <PhoneInput
        {...inputStyle}
        label='Phone'
        onChange={handleChange}
        helperText={helperText}
        error={!isValid}
        handleChangeCountry={handleChangeCountry}
        value={credentialDisplayInfo.value}
        InputProps={{ endAdornment: <DataFieldClearAdornment /> }}
      />
    </Box>
  );
}
