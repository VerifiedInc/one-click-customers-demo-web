import { CredentialDisplayInfo } from '../types';
import { isRequiredCredentialDisplayInfo } from './isRequiredCredentialDisplayInfo';

export function hasSomeRequiredEmptyCredential(
  credentialDisplayInfo: CredentialDisplayInfo
): boolean {
  const isRequired = isRequiredCredentialDisplayInfo({
    required: credentialDisplayInfo.credentialRequest?.required,
    mandatory: credentialDisplayInfo.credentialRequest?.mandatory,
  });

  if (Array.isArray(credentialDisplayInfo.children)) {
    return credentialDisplayInfo.children.some(
      (credentialDisplayInfo: CredentialDisplayInfo) =>
        hasSomeRequiredEmptyCredential(credentialDisplayInfo)
    );
  }

  return isRequired && !credentialDisplayInfo.value.length;
}
