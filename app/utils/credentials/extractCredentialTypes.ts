import { CredentialDto, CredentialRequestDto } from '@verifiedinc/core-types';

/**
 * Extracts the types of the atomic or composed credentials in a flat list.
 * @param credentials
 * @param credentialRequests
 */
export function extractCredentialTypes(
  credentials: CredentialDto[],
  credentialRequests?: CredentialRequestDto[]
) {
  const iterateCredential = (
    credential: CredentialDto | CredentialRequestDto
  ) => {
    const credentialTypes = [credential.type];

    // Extract credential type from source of credential request dto.
    if ('children' in credential) {
      if (Array.isArray(credential.children)) {
        // Composed credentials may have atomic or composted credentials, iterate over it.
        credential.children.forEach((children: CredentialRequestDto) =>
          credentialTypes.push(...iterateCredential(children))
        );
      }
    }

    // Extract credential type from source of credential dto.
    if ('data' in credential) {
      if (Array.isArray(credential.data)) {
        // Composed credentials may have atomic or composted credentials, iterate over it.
        credential.data.forEach((children: CredentialDto) =>
          credentialTypes.push(...iterateCredential(children))
        );
      }
    }

    return credentialTypes;
  };

  // Flatten the credentials after the map iterations.
  const flatListCredentials = credentials.flatMap((credential) =>
    iterateCredential(credential)
  );

  // Flatten the credential requests after the map iterations.
  const flatListCredentialRequests = (credentialRequests || []).flatMap(
    (credentialRequest) => iterateCredential(credentialRequest)
  );

  // Return unique credentials
  return [...new Set([...flatListCredentials, ...flatListCredentialRequests])];
}
