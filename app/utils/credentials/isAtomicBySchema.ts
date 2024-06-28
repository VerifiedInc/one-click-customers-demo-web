import {
  AtomicCredentialSchema,
  CredentialSchemaDto,
} from '@verifiedinc/core-types';

// Infer a schema as atomic one.
export const isAtomicBySchema = (
  schema: CredentialSchemaDto['schemas'][string] | undefined
): schema is AtomicCredentialSchema =>
  Object.prototype.hasOwnProperty.call(schema || {}, 'properties');
