import {
  CredentialDto,
  CredentialRequestDto,
  CredentialSchemaDto,
} from '@verifiedinc/core-types';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import {
  orderCredentialDisplayInfoByCredentialRequests,
  orderCredentialDisplayInfoBySchemas,
  filterRepeatedCredentials,
} from '~/features/request/CredentialsDisplay/utils';

/**
 * Orders credentials to be displayed
 * If there are credential requests, order the credentials based on the order of the requests
 * Otherwise, order the credentials based on the schema groupings
 */
export const getOrderedCredentialDisplayInfo = (
  credentials: CredentialDto[],
  schema: CredentialSchemaDto,
  credentialRequests?: CredentialRequestDto[],
  receiverName?: string
): CredentialDisplayInfo[] => {
  const credentialDisplayInfos = credentialRequests
    ? orderCredentialDisplayInfoByCredentialRequests(
        credentials,
        credentialRequests,
        schema,
        receiverName
      )
    : orderCredentialDisplayInfoBySchemas(credentials, schema);

  return filterRepeatedCredentials(credentialDisplayInfos);
};
