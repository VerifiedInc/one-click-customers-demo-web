import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';

/**
 * Checks the validity of the credential based on the schema input pattern.
 */
export const isUIValidCredential = (
  credentialDisplayInfo: CredentialDisplayInfo
): boolean => {
  if (!credentialDisplayInfo.children) {
    return credentialDisplayInfo.uiState.isValid;
  }

  return credentialDisplayInfo.children.every((child) =>
    isUIValidCredential(child)
  );
};
