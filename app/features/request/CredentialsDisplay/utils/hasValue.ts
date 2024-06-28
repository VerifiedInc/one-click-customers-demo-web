import { CredentialDisplayInfo } from '../types';

/**
 * Checks whether the credential display info has a value
 * @param credentialDisplayInfo  The credential display info to check
 * @returns  Whether the credential display info has a value
 */
export function hasValue(credentialDisplayInfo: CredentialDisplayInfo) {
  const { value, children } = credentialDisplayInfo;

  if (Array.isArray(children)) {
    return children.some(hasValue);
  }

  return value.length > 0;
}
