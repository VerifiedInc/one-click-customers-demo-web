import { CredentialRequestDto } from '@verifiedinc/core-types';

/**
 * Extract the types from the credential requests.
 * @param credentialRequests
 */
export function extractTypesFromCredentialRequests(
  credentialRequests: CredentialRequestDto[]
) {
  // Create a recursion read to return all the types of the credential requests
  const iterateCredential = (credential: CredentialRequestDto) => {
    const credentialTypes = [credential.type];

    // Extract credential type from source of credential request dto.
    if ('children' in credential) {
      if (Array.isArray(credential.children)) {
        // Composed credentials may have atomic or composted credentials, iterate over it.
        for (const children of credential.children) {
          credentialTypes.push(...iterateCredential(children));
        }
      }
    }

    return credentialTypes;
  };

  // Flatten the credential requests after the map iterations.
  return credentialRequests.flatMap((credentialRequest) =>
    iterateCredential(credentialRequest)
  );
}
