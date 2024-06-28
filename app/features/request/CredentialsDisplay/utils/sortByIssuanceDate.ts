import { CredentialDto } from '@verifiedinc/core-types';

/**
 * Sort function to order credentials by issuance date.
 * @param a
 * @param b
 */
export const sortByIssuanceDate = (a: CredentialDto, b: CredentialDto) =>
  b.issuanceDate.localeCompare(a.issuanceDate);
