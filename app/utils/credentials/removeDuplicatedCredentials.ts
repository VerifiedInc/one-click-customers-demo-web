import { CredentialDto } from '@verifiedinc/core-types';

/**
 * Remove duplications of credentials keeping them inside the only composted credential if any.
 * @param credentials {CredentialDto[]}
 */
export function removeDuplicatedCredentials(credentials: CredentialDto[]) {
  // Get all children ids, so we can know what to remove from the root list.
  const getChildrenIds = (credential: CredentialDto): string[] => {
    const credentialId = [credential.id];
    if (Array.isArray(credential.data)) {
      return credential.data.map(getChildrenIds).flat().concat(credentialId);
    }
    return credentialId;
  };

  // Iterate recursively to get the children ids and return nested children in a flat list.
  const childrenIds = credentials
    .map((credential) =>
      Array.isArray(credential.data) ? credential.data.map(getChildrenIds) : []
    )
    .flat(Infinity);

  // Remove all credentials that are children of other credentials.
  return credentials.filter(
    (credential) => !childrenIds.includes(credential.id)
  );
}
