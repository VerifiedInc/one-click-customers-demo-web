import { CredentialRequestDto, MandatoryEnum } from '@verifiedinc/core-types';

// Check if the credential is required by looking at the credential request or when a composite one, it's children.
export const isRequiredCredentialRequest = (
  credentialRequest: CredentialRequestDto
) =>
  credentialRequest.allowUserInput
    ? false
    : credentialRequest.required ||
      credentialRequest.mandatory === MandatoryEnum.YES ||
      credentialRequest.children?.some(isRequiredCredentialRequest);
