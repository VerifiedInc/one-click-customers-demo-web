import type {
  CredentialDto,
  CredentialRequestDto,
} from '@verifiedinc/core-types';

import { isRequiredCredentialRequest } from '~/utils/credentials/isRequiredCredentialRequest';

/**
 * Check all required credentials have matching credentials.
 * @param credentialRequests
 * @param credentials
 */
export function checkMatchingRequiredCredentials({
  credentialRequests,
  credentials,
}: {
  credentialRequests: CredentialRequestDto[];
  credentials: CredentialDto[];
}) {
  // get only the required credential requests
  const requiredCredentialRequests = credentialRequests.filter(
    isRequiredCredentialRequest
  );

  // create a map of the credentials by type for O(1) lookup
  const credentialTypeMap = new Map<string, CredentialDto[]>();
  for (const credential of credentials) {
    if (credentialTypeMap.has(credential.type)) {
      // we already have a credential of this type; need to add to the credential array
      const credentialArray: CredentialDto[] = credentialTypeMap.get(
        credential.type
      ) as CredentialDto[];
      credentialArray.push(credential);
      credentialTypeMap.set(credential.type, credentialArray);
    } else {
      // we don't have a credential of this type; need to create a new credential array
      credentialTypeMap.set(credential.type, [credential]);
    }
  }

  const requiredMatchingCredentials = new Set(); // add the required credentialRequest type to a set to avoid duplicates
  let hasMatchingCredential = false; // flag to indicate if we have a matching credential

  for (const credentialRequest of credentialRequests) {
    // check if the credentialTypeMap has the credentialRequest type
    if (credentialTypeMap.has(credentialRequest.type)) {
      // we have a credential of this type; need to check if the issuers match
      const credentialArray: CredentialDto[] = credentialTypeMap.get(
        credentialRequest.type
      ) as CredentialDto[];

      // create a set of the credentialRequest issuers for O(1) lookup
      const credentialRequestIssuers = new Set(credentialRequest.issuers);

      // find all credentials in the credentialArray that issuer is in the credentialRequest.issuers
      // if the credentialRequest.issuers is empty, then return all credentials in the credentialArray
      const matchingCredentials =
        credentialRequestIssuers.size > 0
          ? credentialArray.filter((credential) =>
              credentialRequestIssuers.has(credential.issuerUuid)
            )
          : credentialArray;

      // if there are any credentials left after filtering, then we have a match
      if (matchingCredentials.length > 0) {
        // if matchingCredentials[].children is not empty, then we need to recursively check if the children have a match
        for (const matchingCredential of matchingCredentials) {
          // if credentialRequest.children is not empty, then we need to recursively check if the children have a match
          if (
            credentialRequest.children &&
            credentialRequest.children.length > 0
          ) {
            // if the matchingCredential.data exists and is not empty, then we need to recursively check if the children have a match
            if (
              Array.isArray(matchingCredential.data) &&
              matchingCredential.data.length > 0
            ) {
              // recursively check if the children have a match
              const { match } = checkMatchingRequiredCredentials({
                credentialRequests: credentialRequest.children,
                credentials: matchingCredential.data,
              });

              // if the children don't match, then we don't have a match for this credential, so skip it
              if (!match && !credentialRequest.allowUserInput) {
                continue;
              }
            }
          }
        }

        // if the credentialRequest is required, then add the credentialRequest type to the requiredMatchingCredentials set
        if (isRequiredCredentialRequest(credentialRequest)) {
          requiredMatchingCredentials.add(credentialRequest.type);
        }
        hasMatchingCredential = true;
      }
    } else if (credentialRequest.allowUserInput) {
      if (isRequiredCredentialRequest(credentialRequest)) {
        requiredMatchingCredentials.add(credentialRequest.type);
      }
      hasMatchingCredential = true;
    }
  }

  // match if we have a valid credential for each required credentialRequest
  const match =
    requiredMatchingCredentials.size === requiredCredentialRequests.length &&
    hasMatchingCredential;

  return { match };
}
