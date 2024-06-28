import { useMemo } from 'react';
import { Box, TextField, TextFieldProps } from '@mui/material';

import { When } from '~/components/When';
import { useCredentialsDisplay } from '~/features/request/CredentialsDisplay/CredentialsDisplayContext';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { findCorrectSchemaProperty } from '~/features/request/CredentialsDisplay/utils';
import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { DataFieldLegend } from '~/features/request/DataField';
import { inputStyle, readOnlyInputStyle } from '~/styles/input';

type DataFieldInputSelectProps = {
  hasMultipleInstances?: boolean;
};

/**
 * This component manages the input of type Select.
 * @constructor
 */
export function DataFieldInputSelect(props: DataFieldInputSelectProps) {
  const { schema } = useCredentialsDisplay();
  const { credentialDisplayInfo, parentCredentialDisplayInfo } =
    useCredentialsDisplayItem();

  const schemaProperty = findCorrectSchemaProperty(
    credentialDisplayInfo.schema,
    schema.schemas,
    parentCredentialDisplayInfo
  );

  // Format the options in label/value keypair.
  const options = useMemo(() => {
    return (schemaProperty?.input?.options || []).map((option) => {
      if (typeof option === 'string') return { label: option, value: option };
      return option;
    });
  }, [schemaProperty?.input?.options]);

  const value = useMemo(() => {
    const option = options.find((o) => o.value === credentialDisplayInfo.value);
    return option?.value || undefined;
  }, [credentialDisplayInfo, options]);

  const textFieldStyle: TextFieldProps = {
    ...inputStyle,
    ...readOnlyInputStyle,
    select: false,
    label: <DataFieldLabelText />,
    value,
    helperText: credentialDisplayInfo.credentialRequest?.description,
    InputProps: {
      readOnly: true,
      // prevent this element from being recorded by Sentry
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // 'data-sentry-mask':
      //   appContext.config.env.env === 'production' || undefined,
    },
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
