import {
  CompositeCredentialSchema,
  CredentialSchemaDto,
} from '@verifiedinc/core-types';

// Infer a schema as composite one.
export const isCompositeBySchema = (
  schema: CredentialSchemaDto['schemas'][string] | undefined
): schema is CompositeCredentialSchema =>
  Object.prototype.hasOwnProperty.call(schema || {}, 'anyOf') ||
  Object.prototype.hasOwnProperty.call(schema || {}, 'allOf');
