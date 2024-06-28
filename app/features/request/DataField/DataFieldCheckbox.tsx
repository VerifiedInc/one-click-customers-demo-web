import { useMemo } from 'react';
import { Checkbox } from '@mui/material';

import { isRequiredCredentialDisplayInfo } from '~/features/request/CredentialsDisplay/utils';
import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

/**
 * This component renders and manages the check for atomic and composite level,
 * when composite, it controls the children also by selecting/deselecting them.
 * @constructor
 */
export function DataFieldCheckbox() {
  const { credentialDisplayInfo, handleSelectCredential } =
    useCredentialsDisplayItem();

  const isChecked = credentialDisplayInfo.uiState?.isChecked;

  const isAllChecked = useMemo(() => {
    const cascadeCheck = (
      credentialDisplayInfo: CredentialDisplayInfo
    ): boolean => {
      if (credentialDisplayInfo.children?.length)
        return credentialDisplayInfo.children.every(cascadeCheck);
      return credentialDisplayInfo.uiState?.isChecked || false;
    };
    return cascadeCheck(credentialDisplayInfo);
  }, [credentialDisplayInfo]);

  const isRequired = isRequiredCredentialDisplayInfo({
    required: credentialDisplayInfo.credentialRequest?.required,
    mandatory: credentialDisplayInfo.credentialRequest?.mandatory,
  });

  return (
    <Checkbox
      sx={{ mr: 1 }}
      checked={isChecked}
      indeterminate={isChecked && !isAllChecked}
      onChange={() => handleSelectCredential(!isChecked)}
      disabled={isRequired}
      inputProps={{
        tabIndex: -1,
      }}
    />
  );
}
