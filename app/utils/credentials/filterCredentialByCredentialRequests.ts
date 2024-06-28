import { CredentialDto, CredentialRequestDto } from '@verifiedinc/core-types';
import { checkMatchingRequiredCredentials } from './checkMatchingRequiredCredentials';

/**
 * Filters the credentials to return only what is being requested by credential request list,
 * for composite credentials, only what is inside the children's type.
 * @param credentialRequests
 * @param credentials
 */
export function filterCredentialByCredentialRequests({
  credentialRequests,
  credentials,
}: {
  credentialRequests: CredentialRequestDto[];
  credentials: CredentialDto[];
}): CredentialDto[] {
  const filteredCredentials: CredentialDto[] = [];

  for (const credentialRequest of credentialRequests) {
    const credentialsFilter = credentials.filter(
      (c) => c.type === credentialRequest.type
    );

    for (const credential of credentialsFilter) {
      // Check if the credential is a composite credential and if the credential request has children.
      if (
        Array.isArray(credentialRequest.children) &&
        Array.isArray(credential.data)
      ) {
        // Get the filtered children credentials recursively.
        const hasMatchingCredential = checkMatchingRequiredCredentials({
          credentials: credential.data,
          credentialRequests: credentialRequest.children,
        });

        if (!hasMatchingCredential.match) {
          continue;
        }

        const filteredChildrenCredentials =
          filterCredentialByCredentialRequests({
            credentialRequests: credentialRequest.children,
            credentials: credential.data,
          });

        filteredCredentials.push({
          ...credential,
          data: filteredChildrenCredentials,
        });
        continue;
      }
      filteredCredentials.push(credential);
    }
  }

  return filteredCredentials;
}
