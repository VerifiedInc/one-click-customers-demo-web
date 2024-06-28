import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import { getCredentialValues } from '~/features/request/CredentialsDisplay/utils/getCredentialValues';

/**
 * Returns true if all the values in the credential display info are empty.
 * @param credentialDisplayInfo
 */
export function isNewCredentialValues(
  credentialDisplayInfo: CredentialDisplayInfo
) {
  const values = getCredentialValues(credentialDisplayInfo);
  return values.every((value) => !value);
}
