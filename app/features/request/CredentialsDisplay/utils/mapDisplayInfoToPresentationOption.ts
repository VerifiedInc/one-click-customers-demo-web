import { PresentationCredentialOption } from '@verifiedinc/core-types';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import { isNewCredentialAgainstInstance } from '~/features/request/CredentialsDisplay/utils/isNewCredentialAgainstInstance';

/**
 * Map credential display info type to presentation credential option type.
 * @param credentialDisplayInfo
 */
export const mapDisplayInfoToPresentationOption = (
  credentialDisplayInfoList: CredentialDisplayInfo[]
): PresentationCredentialOption => {
  const mapCascade = (
    credentialDisplayInfo: CredentialDisplayInfo
  ): PresentationCredentialOption[number] => {
    const presentationCredentialOption: PresentationCredentialOption[number] = {
      id: credentialDisplayInfo.id,
      type: credentialDisplayInfo.credentialRequest?.type,
      value: credentialDisplayInfo.value,
      // Credential is new when the existing credential has changed its value.
      isNewCredential: isNewCredentialAgainstInstance(credentialDisplayInfo),
      providedBy: credentialDisplayInfo.providedBy,
      verificationMethod: credentialDisplayInfo.verificationMethod,
    } as PresentationCredentialOption[number];

    // Do not include atomic credentials that are new but not prompted by the user.
    if (
      !credentialDisplayInfo.value.length &&
      !Array.isArray(credentialDisplayInfo.children)
    )
      return undefined as never;

    if (credentialDisplayInfo.children?.length) {
      const children = credentialDisplayInfo.children
        .map(mapCascade)
        .filter(Boolean);

      // Do not include composite credentials that does not have any of its sub credentials defined.
      if (!children.length) {
        return undefined as never;
      }

      presentationCredentialOption.children = children;
    }

    return presentationCredentialOption;
  };

  return credentialDisplayInfoList.map(mapCascade).filter(Boolean);
};
