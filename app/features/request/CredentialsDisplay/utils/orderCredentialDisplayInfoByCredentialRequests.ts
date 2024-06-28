import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  CredentialDto,
  CredentialRequestDto,
  CredentialSchemaDto,
  MandatoryEnum,
} from '@verifiedinc/core-types';

import {
  CredentialDisplayInfo,
  CredentialDtoDomain,
} from '~/features/request/CredentialsDisplay/types';
import {
  getCredentialTypeDisplayInfo,
  getReferencedSchemaNames,
  sortByIssuanceDate,
  sortCredentialsBySchema,
} from '~/features/request/CredentialsDisplay/utils';
import {
  compareCredentialData,
  isCompositeBySchema,
} from '~/utils/credentials';

/**
 * Orders credentials by the order from the list of credential requests.
 * Used for displaying credentials on the Request page
 * @param {CredentialDto[]} credentials the credentials to order
 * @param {CredentialRequestDto[]} credentialRequests the credential requests to order by
 * @param {CredentialSchemaDto} schema the schema to use to get the display info for each credential
 * @param receiverName the Receiver name
 * @param options Attributes or properties to cascade down to children
 * @returns {CredentialDisplayInfo[]} the ordered credential display info
 */
export const orderCredentialDisplayInfoByCredentialRequests = (
  credentials: CredentialDto[],
  credentialRequests: CredentialRequestDto[],
  schema: CredentialSchemaDto,
  receiverName?: string,
  options?: {
    allowUserInput?: boolean;
    mandatory?: MandatoryEnum;
    required?: boolean;
  }
): CredentialDisplayInfo[] => {
  // Root display info does not contain options.
  const isRoot = !options;

  // Build the display info type.
  const buildCredentialDisplayInfo = (
    credential: CredentialDtoDomain,
    credentialRequest: CredentialRequestDto,
    schema: CredentialSchemaDto,
    receiverName?: string
  ): CredentialDisplayInfo => {
    // get the display info for the credential type
    const credentialTypeDisplayInfo = getCredentialTypeDisplayInfo(
      schema,
      credential.type
    );

    // Retrieve credential value to know if it is composite or atomic.
    const isComposed = Array.isArray(credential.data);

    // Build description along with the receiverName.
    const description = credentialRequest.description || '';

    const credentialData = Object.values(credential.data ?? {})?.[0];

    const mapCredentialRequestDto = (credentialDto: CredentialDto) => ({
      type: credentialDto.type,
      required: credentialRequest.required,
      mandatory: credentialRequest.mandatory,
      allowUserInput: (options || credentialRequest)?.allowUserInput,
      issuers: credentialRequest.issuers || [],
    });

    // Make CredentialRequestDto list from children or from credentials.
    const makeCredentialRequestDtoList = (): CredentialRequestDto[] => {
      if (credentialRequest.children) return credentialRequest.children;

      // Make CredentialRequestDto from CredentialDto and sort by schema.
      return credential.data
        .slice(0)
        .sort(sortCredentialsBySchema(credential, schema))
        .map(mapCredentialRequestDto);
    };

    return {
      id: credential.id,
      label: credentialTypeDisplayInfo.label,
      // We do not need to assign any value for the composed credential, as its value will be the data array of atomic credentials.
      value: isComposed ? '' : credentialData,
      // Setup new credential later in the upper function.
      isNewCredential: false,
      // Reference the data provider for the credential.
      providedBy: credential.providedBy,
      verificationMethod: credential.verificationMethod,
      displayFormat: credentialTypeDisplayInfo.displayFormat,
      // Assign the children from the credential and credential requests child nodes.
      children: isComposed
        ? orderCredentialDisplayInfoByCredentialRequests(
            credential.data as CredentialDto[],
            makeCredentialRequestDtoList(),
            schema,
            receiverName,
            options || {
              allowUserInput: credentialRequest.allowUserInput,
              mandatory: credentialRequest.mandatory,
              required: credentialRequest.required,
            }
          )
        : undefined,
      credentialRequest: {
        ...credentialRequest,
        required: credentialRequest.required ?? options?.required ?? false,
        mandatory:
          credentialRequest.mandatory ?? options?.mandatory ?? MandatoryEnum.NO,
        allowUserInput:
          credentialRequest.allowUserInput ?? options?.allowUserInput,
        description,
      },
      schema: credentialTypeDisplayInfo.schema,
      // Have multi value instances.
      instances: [],
      // Set original Instance for value comparison between the current data and here.
      originalInstance: null,
      // This state will control the UI and also will let us better manipulate the data structure.
      uiState: {
        isEditMode: false,
        isChecked: true,
        // Default valid state should be true to readonly and false to editable.
        isValid: !credentialRequest?.allowUserInput,
        isDirty: false,
        errorMessage: null,
      },
    };
  };

  // Retrieve the instances of the same type of the credential request dto,
  // the instances gathered are checked from root level only.
  const buildInstances = (
    credentials: CredentialDto[],
    credentialRequest: CredentialRequestDto
  ): CredentialDisplayInfo[] => {
    return (
      _.chain(credentials)
        // Filter to return only credentials of exact same structure of types.
        .filter((credential) => credential.type === credentialRequest.type)
        // Sort by issuance date, newest ones on the top
        .sort(sortByIssuanceDate)
        // Remove duplicated credentials by value.
        .uniqWith(compareCredentialData)
        // Map the credentials to be in display info type.
        .map((credential) =>
          buildCredentialDisplayInfo(
            credential,
            credentialRequest,
            schema,
            receiverName
          )
        )
        // Return the value from the chain.
        .value()
    );
  };

  // Build credential DTO mock for the empty state.
  const buildCredential = ({ type }: { type: string }): CredentialDto => {
    // Find the schema property key from credential request type.
    const selectedSchema = schema.schemas[type];
    let schemaProperty;
    let credentialData: any;

    if (isCompositeBySchema(selectedSchema)) {
      // Construct credential data using schema references.
      credentialData = getReferencedSchemaNames(selectedSchema, 1).map((type) =>
        buildCredential({ type })
      );
    } else {
      // Atomic schemas contains properties at root level.
      schemaProperty = selectedSchema.properties;
      credentialData = { [Object.keys(schemaProperty)[0]]: '' };
    }

    return {
      id: uuid(),
      issuerUuid: 'unknown',
      type,
      data: credentialData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      issuanceDate: new Date().toISOString(),
      expirationDate: null,
    };
  };

  return credentialRequests
    .map((credentialRequest) => {
      const credentialsSameType = credentials
        .filter((credential) => credential.type === credentialRequest.type)
        // Sort to return the most recent credential issued.
        .sort(sortByIssuanceDate);
      let credential = credentialsSameType[0];

      // there should always be a credential for each credential request
      // if not, we'll filter out the undefined values later
      if (!credential) {
        // Do nothing if the credential is not allowed to be inputted.
        if (!(credentialRequest.allowUserInput ?? options?.allowUserInput)) {
          return undefined;
        }

        // Create a new credential for user to input with empty value to fill in.
        credential = buildCredential({ type: credentialRequest.type });
      }

      const credentialDisplayInfo = buildCredentialDisplayInfo(
        credential,
        credentialRequest,
        schema,
        receiverName
      );
      const instances = isRoot
        ? buildInstances(credentialsSameType, credentialRequest)
        : [];

      credentialDisplayInfo.instances = instances;
      // Clone the original data and save in a property.
      credentialDisplayInfo.originalInstance = _.cloneDeep(
        credentialDisplayInfo
      );

      // Auto set the edit mode if the credential is allowed to be inputted, and there is no instance.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const setEditMode =
        (overrideEditMode?: boolean) =>
        (credentialDisplayInfo: CredentialDisplayInfo) => {
          if (overrideEditMode !== undefined) {
            credentialDisplayInfo.uiState.isEditMode = overrideEditMode;
          }

          if (
            isRoot &&
            credentialDisplayInfo.credentialRequest?.allowUserInput &&
            instances.length < 1
          ) {
            credentialDisplayInfo.uiState.isEditMode = true;
          }

          if (Array.isArray(credentialDisplayInfo.children)) {
            credentialDisplayInfo.children.forEach(
              setEditMode(credentialDisplayInfo.uiState.isEditMode)
            );
          }
        };

      // Check and set edit mode for the credential display info.
      setEditMode()(credentialDisplayInfo);

      return credentialDisplayInfo;
    })
    .filter(
      (credentialDisplayInfo): credentialDisplayInfo is CredentialDisplayInfo =>
        Boolean(credentialDisplayInfo)
    );
};
