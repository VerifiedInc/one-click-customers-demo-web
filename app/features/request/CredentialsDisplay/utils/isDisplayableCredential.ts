import { CredentialDto } from '@verifiedinc/core-types';

/**
 * Determines if a credential is displayable
 * i.e. if it's not an IdentityCredential
 * @param {CredentialDto} credential the credential to check
 * @returns {boolean} true if the credential is displayable, false otherwise
 */
export const isDisplayableCredential = (credential: CredentialDto): boolean =>
  credential.type !== 'IdentityCredential';
