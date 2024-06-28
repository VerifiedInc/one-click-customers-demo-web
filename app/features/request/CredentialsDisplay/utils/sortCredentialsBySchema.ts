import { CredentialDto, CredentialSchemaDto } from '@verifiedinc/core-types';

import { extractTypesFromSchema } from '~/features/request/CredentialsDisplay/utils/extractTypesFromSchema';

export const sortCredentialsBySchema = (
  credential: CredentialDto,
  schema: CredentialSchemaDto
) => {
  return (a: CredentialDto, b: CredentialDto) => {
    const currentSchema = schema.schemas[credential.type] as any;
    const types: string[] = extractTypesFromSchema(currentSchema);
    return types.indexOf(a.type) - types.indexOf(b.type);
  };
};
