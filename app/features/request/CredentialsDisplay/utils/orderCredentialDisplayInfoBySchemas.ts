import cloneDeep from 'lodash/cloneDeep';
import {
  CredentialDto,
  CredentialSchemaDto,
  MandatoryEnum,
} from '@verifiedinc/core-types';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import {
  getCredentialTypeDisplayInfo,
  sortChildBySchema,
} from '~/features/request/CredentialsDisplay/utils';

/**
 * Orders credentials by the schema groupings.
 * Used for displaying credentials when we don't have credential requests, i.e. on the Card Details page
 * @param {CredentialDto[]} credentials the credentials to order
 * @param {SchemaPresentationDto} schema the schema to use to get the display info for each credential
 * @returns {CredentialDisplayInfo[]} the ordered credential display info
 */
export const orderCredentialDisplayInfoBySchemas = (
  credentials: CredentialDto[],
  schema: CredentialSchemaDto
): CredentialDisplayInfo[] => {
  // for now, we can assume that the schema will always have a schemas property
  if (!schema.schemas) {
    const message = 'schema must have a schemas property';
    console.error(message);
    throw new Error(message);
  }

  return credentials.map((credential) => {
    // get display info for the credential
    const credentialTypeDisplayInfo = getCredentialTypeDisplayInfo(
      schema,
      credential.type
    );

    // for now, assume there will always be matching display info from the schema
    if (!credentialTypeDisplayInfo) {
      const message = `display info not found for ${credential.type}`;
      console.error(message);
      throw new Error(message);
    }

    // Composed credential contains data of array type.
    const isComposed = Array.isArray(credential.data);

    // assemble the credential display info and add it to the groupedCredentialInfo object
    const credentialDisplayInfo: CredentialDisplayInfo = {
      id: credential.id,
      label: credentialTypeDisplayInfo.label,
      value: isComposed ? '' : Object.values(credential.data)[0],
      isNewCredential: false,
      schema: credentialTypeDisplayInfo.schema,
      displayFormat: credentialTypeDisplayInfo.displayFormat,
      children: isComposed
        ? orderCredentialDisplayInfoBySchemas(
            credential.data as CredentialDto[],
            schema
          ).sort(
            sortChildBySchema(credentialTypeDisplayInfo.schema.$id, schema)
          )
        : undefined,
      credentialRequest: {
        type: credentialTypeDisplayInfo.schema.$id,
        required: false,
        mandatory: MandatoryEnum.NO,
        allowUserInput: false,
      },
      instances: [],
      originalInstance: null,
      uiState: {
        isEditMode: false,
        isChecked: false,
        isValid: false,
        isDirty: false,
        errorMessage: null,
      },
    };
    const copiedCredentialDisplayInfo = cloneDeep(credentialDisplayInfo);
    credentialDisplayInfo.instances.push(copiedCredentialDisplayInfo);

    return credentialDisplayInfo;
  });
};
