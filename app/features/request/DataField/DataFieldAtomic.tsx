import { Box, Stack, SxProps } from '@mui/material';
import { DisplayFormatEnum, InputFormatEnum } from '@verifiedinc/core-types';

import { when } from '~/utils/when';

import { When } from '~/components/When';
import { findCorrectSchemaProperty } from '~/features/request/CredentialsDisplay/utils';
import { useCredentialsDisplay } from '~/features/request/CredentialsDisplay/CredentialsDisplayContext';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { useDataFieldValidator } from '~/features/request/DataField/hooks';
import { DataFieldLeftSide } from '~/features/request/DataField/DataFieldLeftSide';
import { DataFieldHeader } from '~/features/request/DataField/DataFieldHeader';
import {
  DataFieldImage,
  DataFieldInputAddress,
  DataFieldInputText,
} from '~/features/request/DataField/formats';
import {
  DataFieldSelectInput,
  DataFieldTextInput,
  DataFieldPhoneInput,
  DataFieldDateInput,
  DataFieldSSNInput,
  DataFieldImageInput,
} from '~/features/request/DataField/inputs';
import { DataFieldInputSelect } from '~/features/request/DataField/formats/DataFieldInputSelect';
import { DataFieldInputModeHeader } from '~/features/request/DataField/DataFieldInputModeHeader';
import { DataFieldLegend } from '~/features/request/DataField/DataFieldLegend';

/**
 * This component renders an atomic level credential, it displays the component by displayFormat.
 * @constructor
 */
export function DataFieldAtomic() {
  useDataFieldValidator();

  const { schema } = useCredentialsDisplay();
  const { credentialDisplayInfo, parentCredentialDisplayInfo } =
    useCredentialsDisplayItem();
  const hasMultipleInstances = credentialDisplayInfo.instances.length > 1;
  const allowUserInput =
    credentialDisplayInfo.credentialRequest?.allowUserInput;
  const canEdit = allowUserInput;
  const isRoot = !parentCredentialDisplayInfo;
  const isEditMode = credentialDisplayInfo.uiState.isEditMode;

  // HACK alert:
  // This calculation subtracts left side component and right side component to fit in.
  const stackStyle: SxProps = { width: 'calc(100%)' };

  // Render data field as input mode.
  const renderInputField = () => {
    const schemaProperty = findCorrectSchemaProperty(
      credentialDisplayInfo.schema,
      schema.schemas,
      parentCredentialDisplayInfo
    );
    return when(schemaProperty?.input?.type, {
      [InputFormatEnum.Date]: () => <DataFieldDateInput />,
      [InputFormatEnum.Phone]: () => <DataFieldPhoneInput />,
      [InputFormatEnum.SSN]: () => <DataFieldSSNInput />,
      [InputFormatEnum.Select]: () => <DataFieldSelectInput />,
      [InputFormatEnum.Image]: () => <DataFieldImageInput />,
      else: () => <DataFieldTextInput />,
    });
  };

  // Render data field as read only.
  const renderReadOnlyField = () => {
    const props = { hasMultipleInstances };
    const schemaProperty = findCorrectSchemaProperty(
      credentialDisplayInfo.schema,
      schema.schemas,
      parentCredentialDisplayInfo
    );

    const readOnly = when(schemaProperty?.input?.type, {
      // Prefer input of type select over any other displayFormat.
      Select: () => <DataFieldInputSelect {...props} />,
      else: () => null,
    });

    if (readOnly) return readOnly;

    return when(credentialDisplayInfo?.displayFormat, {
      [DisplayFormatEnum.Image]: () => <DataFieldImage {...props} />,
      [DisplayFormatEnum.Address]: () => <DataFieldInputAddress {...props} />,
      else: () => <DataFieldInputText {...props} />,
    });
  };

  // Render the given credential, being input mode or display mode.
  const renderField = () => {
    if (canEdit && isEditMode) {
      return renderInputField();
    }

    return renderReadOnlyField();
  };

  return (
    <Stack
      direction='row'
      alignItems='center'
      data-testid='data-field-atomic'
      data-credentialid={credentialDisplayInfo.id}
      sx={{ width: '100%' }}
    >
      <DataFieldLeftSide />
      <Stack direction='column' sx={stackStyle}>
        {/* When is root data field, display the header. */}
        <When value={isRoot && !isEditMode}>
          <Box sx={{ mb: 0.5 }}>
            <DataFieldHeader block />
          </Box>
        </When>
        {/* When is root and edit mode, display the input mode header. */}
        <When value={isRoot && isEditMode}>
          <DataFieldInputModeHeader sx={{ mb: 0.5 }} />
        </When>
        {/* Display data field when */}
        {/* - is root and is not edit mode */}
        {/* - is not root */}
        <When value={(isRoot && isEditMode) || !isRoot}>{renderField()}</When>
        <When
          value={
            isRoot &&
            !isEditMode &&
            credentialDisplayInfo.credentialRequest?.description
          }
        >
          {(description) => (
            <Box sx={{ mx: 1.75 }}>
              <DataFieldLegend sx={{ mt: 0 }}>{description}</DataFieldLegend>
            </Box>
          )}
        </When>
      </Stack>
    </Stack>
  );
}
