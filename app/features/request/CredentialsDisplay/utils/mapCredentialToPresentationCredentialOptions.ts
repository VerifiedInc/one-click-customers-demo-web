import {
  CredentialDto,
  PresentationCredentialOption,
} from '@verifiedinc/core-types';

/**
 * Map credential to presentation credential options.
 */
export function mapCredentialToPresentationCredentialOptions(
  credentials: CredentialDto[]
): PresentationCredentialOption {
  return credentials.map((credential) => {
    const { id, type, data } = credential;
    const option: PresentationCredentialOption[number] = {
      id,
      type,
    };

    if (Array.isArray(data)) {
      option.children = mapCredentialToPresentationCredentialOptions(
        data as CredentialDto[]
      );
    }

    return option;
  });
}
