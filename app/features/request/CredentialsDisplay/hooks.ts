import { useMemo } from 'react';

import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

/**
 * Hook to get validity for the given credential.
 */
export function useCredentialsDisplayItemValid() {
  const { credentialDisplayInfo } = useCredentialsDisplayItem();

  // Check validation against the credential value and the pattern.
  const isValid = useMemo(() => {
    return credentialDisplayInfo.uiState.isValid;
  }, [credentialDisplayInfo.uiState.isValid]);

  const errorMessage = useMemo(() => {
    if (isValid) return '';
    if (credentialDisplayInfo.uiState.errorMessage) {
      return credentialDisplayInfo.uiState.errorMessage;
    }
    return `${credentialDisplayInfo.label} is not valid`;
  }, [isValid, credentialDisplayInfo.uiState, credentialDisplayInfo.label]);

  return {
    isValid,
    errorMessage,
  };
}
