import { Box } from '@mui/material';

import { useCredentialsDisplayItemValid } from '~/features/request/CredentialsDisplay/hooks';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { DateInput } from '~/features/request/shared/DateInput';

/**
 * This component manages the input of type Date.
 * @constructor
 */
export function DataFieldDateInput() {
  const { credentialDisplayInfo, handleChangeValueCredential } =
    useCredentialsDisplayItem();
  const { isValid, errorMessage } = useCredentialsDisplayItemValid();

  return (
    <Box width='100%'>
      <DateInput
        label={<DataFieldLabelText />}
        value={credentialDisplayInfo.value}
        error={!isValid}
        allowFutureDates={
          credentialDisplayInfo.credentialRequest?.type !==
          'BirthDateCredential'
        }
        helperText={
          isValid
            ? credentialDisplayInfo.credentialRequest?.description
            : errorMessage
        }
        onChange={(e) => handleChangeValueCredential(e.target.value)}
      />
    </Box>
  );
}
