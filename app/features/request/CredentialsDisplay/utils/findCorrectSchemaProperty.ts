import _ from 'lodash';
import {
  CredentialSchemaDto,
  AtomicCredentialSchema,
  CredentialSchemaProperties,
} from '@verifiedinc/core-types';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import { isAtomicBySchema, isCompositeBySchema } from '~/utils/credentials';

/**
 * Returns the correct schema property based on the values for the related credential.
 * @param schema
 * @param credentialDisplayInfo
 */
export const findCorrectSchemaProperty = (
  schema: CredentialSchemaDto['schemas'][string] | undefined,
  schemas: CredentialSchemaDto['schemas'],
  credentialDisplayInfo?: CredentialDisplayInfo
): AtomicCredentialSchema['properties'][string] | undefined => {
  let matchProperty: CredentialSchemaProperties['properties'] | undefined;

  if (isAtomicBySchema(schema) && schema.if) {
    // Get the related property name to look for in schemas.
    const fieldName = Object.keys(schema.if?.properties)[0];
    const fieldValue = schema.if?.properties[fieldName].const;

    // Find in schemas the one that contains properties and fieldName variable.
    const credentialName = _.chain(_.toArray(schemas))
      .find((schema) => {
        if (isCompositeBySchema(schema)) {
          return !!_.find([schema.anyOf, schema.oneOf], (item) =>
            _.find(item, (i) => _.get(i, `properties.${fieldName}`))
          );
        }

        return !!_.get(schema, `properties.${fieldName}`);
      })
      .get('$id')
      .value();

    const lookUpCredential = (
      matcher: string,
      credentialDisplayInfo?: CredentialDisplayInfo
    ): CredentialDisplayInfo | undefined => {
      if (!credentialDisplayInfo) return;

      // Lookup for the credential that may be in the children.
      if (Array.isArray(credentialDisplayInfo.children)) {
        return credentialDisplayInfo.children.find((c) =>
          lookUpCredential(matcher, c)
        );
      }

      return credentialDisplayInfo?.credentialRequest?.type === matcher
        ? credentialDisplayInfo
        : undefined;
    };

    const matchCredential = lookUpCredential(
      credentialName,
      credentialDisplayInfo
    );

    if (matchCredential?.value === fieldValue) {
      matchProperty = schema.then.properties;
    }
  }

  if (isCompositeBySchema(schema)) {
    // Find the atomic schema properties from the composite schema.
    matchProperty = _.chain(schema.anyOf || schema.oneOf)
      .find((o: any) => o?.allOf === undefined)
      .get('properties')
      .value();

    // When there are no match property it means the credential is only composite.
    if (!matchProperty) {
      return;
    }
  }

  // When there are no match from the composite find, we presume it is an atomic.
  if (!matchProperty && isAtomicBySchema(schema)) {
    matchProperty = schema.properties;
  }

  // This should never happen, once the properties must be captured from composite or atomic schema.
  if (!matchProperty) throw new Error('Schema is not defined.');

  return Object.values(matchProperty)[0];
};
