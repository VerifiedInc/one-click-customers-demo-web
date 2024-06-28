import { Box, TextField } from '@mui/material';

import { formatCredentialValue } from '~/utils/formatCredentialValue';

import { inputStyle, readOnlyInputStyle } from '~/styles/input';

import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { When } from '~/components/When';
import { DataFieldLegend } from '~/features/request/DataField';

type DataFieldInputAddressProps = {
  hasMultipleInstances: boolean;
};

/**
 * This component renders and manages display format Address.
 * @constructor
 */
export function DataFieldInputAddress(props: DataFieldInputAddressProps) {
  const { credentialDisplayInfo } = useCredentialsDisplayItem();
  const formattedValue = formatCredentialValue(
    credentialDisplayInfo.value,
    credentialDisplayInfo.displayFormat
  );
  const lines = formattedValue.split('\n');

  if (props.hasMultipleInstances) {
    return (
      <When value={credentialDisplayInfo.credentialRequest?.description}>
        <Box width='100%'>
          <DataFieldLegend sx={{ mt: -0.5 }}>
            {credentialDisplayInfo.credentialRequest?.description}
          </DataFieldLegend>
        </Box>
      </When>
    );
  }

  return (
    <Box width='100%'>
      <TextField
        {...inputStyle}
        {...readOnlyInputStyle}
        label={<DataFieldLabelText />}
        value={formattedValue}
        multiline
        rows={lines.length}
        helperText={credentialDisplayInfo.credentialRequest?.description}
        InputProps={{
          readOnly: true,
          // prevent this element from being recorded by Sentry
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // 'data-sentry-mask':
          //   appContext.config.env.env === 'production' || undefined,
        }}
        fullWidth
      />
    </Box>
  );
}
