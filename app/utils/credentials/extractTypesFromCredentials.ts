import { CredentialDto } from '@verifiedinc/core-types';

/**
 * Extract the types from the credentials.
 * @param credentials
 */
export function extractTypesFromCredentials(credentials: CredentialDto[]) {
  // Create a recursion read to return all the types of the credential requests
  const iterateCredential = (credential: CredentialDto) => {
    const credentialTypes = [credential.type];

    // Extract credential type from source of credential dto.
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

  // Flatten the credentials after the map iterations.
  return credentials.flatMap((credential) => iterateCredential(credential));
}
