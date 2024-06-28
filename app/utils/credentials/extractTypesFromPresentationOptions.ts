import { PresentationCredentialOption } from '@verifiedinc/core-types';

/**
 * Extract the types from the credential display info.
 * @param options
 */
export function extractTypesFromPresentationOptions(
  options: PresentationCredentialOption
) {
  // Create a recursion read to return all the types of the credential requests
  const iterateCredential = (option: PresentationCredentialOption[number]) => {
    const credentialTypes = [option?.type];

    // Extract credential type from source of credential request dto.
    if ('children' in option) {
      if (Array.isArray(option.children)) {
        // Composed credentials may have atomic or composted credentials, iterate over it.
        for (const children of option.children) {
          credentialTypes.push(...iterateCredential(children));
        }
      }
    }

    return credentialTypes;
  };

  // Flatten the credential requests after the map iterations.
  return options.flatMap((option) => iterateCredential(option));
}
