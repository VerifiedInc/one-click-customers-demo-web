import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';

/**
 * Checks if a given credential display info or its children are new credentials.
 *
 * @param credentialDisplayInfo - The CredentialDisplayInfo object to check.
 * @returns `true` if the credential or any of its children are new, `false` otherwise.
 */
export function isNewCredential(
  credentialDisplayInfo: CredentialDisplayInfo
): boolean {
  if (!Array.isArray(credentialDisplayInfo.children)) {
    // If children is not an array, check if the value is truthy (new credential).
    return !credentialDisplayInfo.value;
  }

  // If children is an array, recursively check if any of the children are new credentials.
  return credentialDisplayInfo.children.every(isNewCredential);
}
