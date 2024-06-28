import _ from 'lodash';
import { CredentialDto } from '@verifiedinc/core-types';

// Compare credentials based on the data property, if they are equal, they will return true.
export const compareCredentialData = (
  a: CredentialDto,
  b: CredentialDto
): boolean => {
  // Map credential in any depth of data to return just the data value.
  const mapData = (credential: CredentialDto): any => {
    if (Array.isArray(credential.data)) {
      return credential.data.map(mapData);
    }
    return Object.values(credential.data)[0];
  };

  const aCredential = mapData(a);
  const bCredential = mapData(b);

  return _.isEqual(aCredential, bCredential);
};
