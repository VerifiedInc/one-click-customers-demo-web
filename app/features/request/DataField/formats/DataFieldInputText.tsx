import { Box, TextField, TextFieldProps } from '@mui/material';

import { formatCredentialValue } from '~/utils/formatCredentialValue';

import { When } from '~/components/When';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { DataFieldLegend } from '~/features/request/DataField';
import { inputStyle, readOnlyInputStyle } from '~/styles/input';

type DataFieldInputTextProps = {
  hasMultipleInstances?: boolean;
};

/**
 * This component renders and manages the input value for display format Text or to strings.
 * @constructor
 */
export function DataFieldInputText(props: DataFieldInputTextProps) {
  const { credentialDisplayInfo } = useCredentialsDisplayItem();
  const formattedValue = formatCredentialValue(
    credentialDisplayInfo.value,
    credentialDisplayInfo.displayFormat
  );

  const inputProps = {
    readOnly: true,
    // prevent this element from being recorded by Sentry
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // 'data-sentry-mask': appContext.config.env.env === 'production' || undefined,
  };

  const textFieldStyle: TextFieldProps = {
    ...inputStyle,
    ...readOnlyInputStyle,
    label: <DataFieldLabelText />,
    value: formattedValue,
    helperText: credentialDisplayInfo.credentialRequest?.description,
    InputProps: inputProps,
    fullWidth: true,
  };

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
      <TextField {...textFieldStyle} />
    </Box>
  );
}
