import {
  AtomicCredentialSchema,
  InputFormatEnum,
} from '@verifiedinc/core-types';

import { when } from '~/utils/when';

import {
  defaultTextSchema,
  emailSchema,
  phoneSchema,
  SSNSchema,
  timestampSchema,
} from '~/features/request/validations/fragments/credentials';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';

/**
 * Checks the validity of the credential based on the schema input pattern.
 */
export const isValidInputCredential = (
  schemaProperty: AtomicCredentialSchema['properties'][string] | undefined,
  credentialDisplayInfo: CredentialDisplayInfo
) => {
  // Do need to validate composite credentials values since it will be empty.
  if (Array.isArray(credentialDisplayInfo.children)) return true;

  const stringValue = String(credentialDisplayInfo.value);

  // Do check by the pattern of schema.
  if (schemaProperty?.input?.pattern) {
    return new RegExp(schemaProperty.input.pattern).test(stringValue);
  }

  return when(schemaProperty?.input?.type, {
    // Do check validator for Date type.
    [InputFormatEnum.Date]: () =>
      timestampSchema.safeParse(credentialDisplayInfo.value).success,
    // Do check validator for Email type.
    [InputFormatEnum.Email]: () =>
      emailSchema.safeParse(credentialDisplayInfo.value).success,
    // Do check validator for Phone type.
    [InputFormatEnum.Phone]: () =>
      phoneSchema.safeParse(credentialDisplayInfo.value).success,
    // Do check with default pattern for SSN type.
    [InputFormatEnum.SSN]: () => SSNSchema.safeParse(stringValue).success,
    // Do check if field is empty
    else: () =>
      defaultTextSchema.safeParse(credentialDisplayInfo.value).success,
  });
};
