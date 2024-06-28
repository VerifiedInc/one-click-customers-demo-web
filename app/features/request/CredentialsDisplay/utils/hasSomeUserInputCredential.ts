import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';

/**
 * Checks if the credential display info has some user input credential
 * @param credentialDisplayInfo The credential display info to check
 * @returns True if the credential display info has some user input credential, false otherwise
 */
export function hasSomeUserInputCredential(
  credentialDisplayInfo: CredentialDisplayInfo
) {
  if (Array.isArray(credentialDisplayInfo.children)) {
    return credentialDisplayInfo.children.some(hasSomeUserInputCredential);
  }

  return credentialDisplayInfo.credentialRequest?.allowUserInput;
}
