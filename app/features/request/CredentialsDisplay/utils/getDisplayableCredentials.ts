import { CredentialDto } from '@verifiedinc/core-types';

import { isDisplayableCredential } from '~/features/request/CredentialsDisplay/utils';

/**
 * Gets the displayable credentials from a list of credentials
 * @param {CredentialDto[]} credentials the credentials to filter
 * @returns {CredentialDto[]} the displayable credentials
 */
export const getDisplayableCredentials = (credentials: CredentialDto[]) =>
  credentials.filter((credential) => isDisplayableCredential(credential));
