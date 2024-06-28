import {
  CredentialSchemaDto,
  CredentialSchemaProperty,
} from '@verifiedinc/core-types';

import { CredentialTypeDisplayInfo } from '../types';

import { stringUtils } from '~/utils/string';
import { isAtomicBySchema, isCompositeBySchema } from '~/utils/credentials';

/**
 * Gets credential type display info from the schema
 * @param {SchemaPresentationDto} schema the schema to get the display info from
 * @param {string} type the credential type to get the display info for
 * @returns {CredentialTypeDisplayInfo} the display info for the credential type
 */
export const getCredentialTypeDisplayInfo = (
  schema: CredentialSchemaDto,
  type: string
): CredentialTypeDisplayInfo => {
  // for now, we can assume that the schema will always have a schemas property
  if (!schema.schemas) {
    const message = 'schema must have a schemas property';
    console.error(message);
    throw new Error(message);
  }

  // find the credential schema that matches the type
  const [_, schemaMatch] = Object.entries(schema.schemas).find(
    ([key]: any) => key === type
  ) as unknown as any;

  // for now, assume there will always be a matching schema
  if (!schemaMatch) {
    const message = `Schema for ${type} not found`;
    console.error(message);
    throw new Error(message);
  }

  let property: CredentialSchemaProperty | undefined;

  if (isAtomicBySchema(schemaMatch)) {
    property = Object.values(schemaMatch.properties)[0];
  }
  if (isCompositeBySchema(schemaMatch)) {
    const matchProperty = (
      (schemaMatch as any).allOf ||
      schemaMatch.anyOf ||
      []
    ).find((schema: any) => schema?.properties !== undefined);

    // Composite credentials have no title nor display format and type, so it have to create the data.
    property = {
      ...(Object.values(matchProperty?.properties ?? {})[0] as any),
      title: stringUtils.prettifyCamelCase(
        schemaMatch.$id.replace('Credential', '')
      ),
    };
  }

  return {
    label: property?.title as string,
    displayFormat: property?.displayFormat,
    heading: schemaMatch.heading,
    type,
    schema: schemaMatch,
  };
};
