import { CredentialSchemaDto } from '@verifiedinc/core-types';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';

/**
 * Sorts the credentials by the schema
 * @param parentType Parent type of the schema
 * @param schema The schema to sort by
 * @returns
 */
export const sortChildBySchema = (
  parentType: string,
  schema: CredentialSchemaDto
) => {
  const selectedSchema: any = schema.schemas[parentType];
  const typesOrder: Record<string, number> = {};
  let list = (selectedSchema?.anyOf || selectedSchema?.allOf || []).find(
    (schema: any) => schema?.anyOf || schema?.allOf
  );
  list = list?.anyOf || list?.allOf;

  if (Array.isArray(list)) {
    for (const [index, schemaItem] of Object.entries(list)) {
      typesOrder[schemaItem?.$id || schemaItem?.$ref || 'unknown'] =
        Number(index);
    }
  }

  return (a: CredentialDisplayInfo, b: CredentialDisplayInfo): number => {
    const rest =
      typesOrder[a.credentialRequest?.type as string] -
      typesOrder[b.credentialRequest?.type as string];
    return isNaN(rest) ? 0 : rest;
  };
};
