import { useEffect, useMemo } from 'react';

import { findCorrectSchemaProperty } from '~/features/request/CredentialsDisplay/utils';
import { isValidInputCredential } from '~/features/request/CredentialsDisplay/utils/isValidInputCredential';
import { useCredentialsDisplay } from '~/features/request/CredentialsDisplay/CredentialsDisplayContext';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

/**
 * Custom React hook for managing the display and validation of credentials.
 */
export function useDataFieldValidator() {
  const { schema } = useCredentialsDisplay();
  const {
    credentialDisplayInfo,
    parentCredentialDisplayInfo,
    handleChangeValidationCredential,
  } = useCredentialsDisplayItem();

  const schemaProperty = findCorrectSchemaProperty(
    credentialDisplayInfo.schema,
    schema.schemas,
    parentCredentialDisplayInfo
  );

  const credentialDisplayInfoValue = useMemo(
    () => credentialDisplayInfo.value,
    [credentialDisplayInfo.value]
  );

  // Check validation against the credential value and the pattern.
  const isValid = useMemo(
    () => isValidInputCredential(schemaProperty!, credentialDisplayInfo),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [credentialDisplayInfoValue]
  );

  const isEditMode = useMemo(
    () => credentialDisplayInfo.uiState.isEditMode,
    [credentialDisplayInfo.uiState.isEditMode]
  );

  // Updates the credential display info's valid state.
  useEffect(() => {
    handleChangeValidationCredential(!!isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, isEditMode]);
}
