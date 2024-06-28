import { useEffect, useMemo } from 'react';

import {
  findCredentialsByType,
  getCredentialValues,
} from '~/features/request/CredentialsDisplay/utils';
import {
  CredentialsDisplayItemContext,
  useCredentialsDisplayItem,
} from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { useZipCodeLookup } from '~/features/addressLookup/hooks/useZipCodeLookup';
import { useDebounce } from '~/hooks/useDebounce';

type CompositeDataFieldValidatorOptions = {
  credentialsDisplayItemContext: CredentialsDisplayItemContext;
  isEditMode: boolean;
  childValues: string;
};

/**
 * Hook to validate the address credentials asynchronously.
 *
 * Behavior:
 * - When the user is in edit mode, the address credentials will be validated asynchronously firstly.
 * - If the address credentials are missing, they wont validate here but in the useDataFieldValidator level.
 * - If the zip code lookup has an error, the address credentials will be considered as valid letting it to be fail open.
 * - If the zip code lookup has a response, the address credentials will be validated with the response data.
 */
function useAddressCredentialValidator(
  options: CompositeDataFieldValidatorOptions
) {
  const { credentialsDisplayItemContext, isEditMode, childValues } = options;
  const debouncedChildValues = useDebounce(childValues, 350);

  const { credentialDisplayInfo, handleChangeValidationChild } =
    credentialsDisplayItemContext;
  const zipCodeLookup = useZipCodeLookup();
  const addressFields = [
    'CityCredential',
    'StateCredential',
    'CountryCredential',
    'ZipCodeCredential',
  ];

  // Validate the address credentials with the response data.
  useEffect(() => {
    // If the zip code lookup has an error, invalidate the fields.
    if (zipCodeLookup.error) {
      handleChangeValidationChild(
        addressFields.map((field) => ({
          type: field,
          valid: true,
        }))
      );
      return;
    }

    if (!zipCodeLookup.data) return;

    const credentialsRecord = findCredentialsByType(
      addressFields,
      credentialDisplayInfo
    );

    const validations = addressFields
      .map((field) => {
        const credential = credentialsRecord[field];

        // Because the required to be validate field is missing from the credential display list,
        // it should be considered as valid.
        if (!credential) return undefined;

        // Make sure the value is in the zip code lookup data.
        return {
          type: field,
          valid: Object.values(zipCodeLookup.data).some(
            // make insensitive comparison
            (value) => value.toLowerCase() === credential.value.toLowerCase()
          ),
        };
      })
      .filter(
        (validation): validation is { type: string; valid: boolean } =>
          !!validation
      );

    handleChangeValidationChild(validations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCodeLookup.data, zipCodeLookup.error]);

  // Effect to meet the criterias to make deep asynchronous validation for the address credentials.
  useEffect(() => {
    // Validate only in edit mode to avoid re-validation over existing ones since it may block the UI.
    if (!isEditMode) return;

    if (credentialDisplayInfo.credentialRequest?.type === 'AddressCredential') {
      const validationMessage = 'Verifying...';

      const credentialsRecord = findCredentialsByType(
        addressFields,
        credentialDisplayInfo
      );

      // Because the required to be validate field is missing from the credential display list,
      // it won't be possible to make a deep asynchronous validation and should be considered as valid.
      if (
        !(
          credentialsRecord.CountryCredential?.value === 'US' &&
          credentialsRecord.ZipCodeCredential?.value?.length
        )
      ) {
        return;
      }

      // invalidate field so it can be verified asynchronously.
      handleChangeValidationChild(
        addressFields.map((field) => ({
          type: field,
          valid: false,
          errorMessage: validationMessage,
        }))
      );

      zipCodeLookup.mutate({
        zipcode: credentialsRecord.ZipCodeCredential.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedChildValues, isEditMode]);
}

export function useCompositeDataFieldValidator() {
  const credentialsDisplayItemContext = useCredentialsDisplayItem();
  const { credentialDisplayInfo } = credentialsDisplayItemContext;

  // Get the edit mode state.
  const isEditMode = useMemo(
    () => credentialDisplayInfo.uiState.isEditMode,
    [credentialDisplayInfo.uiState.isEditMode]
  );

  // Get the child values to detect changes.
  const childValues = useMemo(() => {
    return getCredentialValues(credentialDisplayInfo).join('');
  }, [credentialDisplayInfo]);

  useAddressCredentialValidator({
    childValues,
    isEditMode,
    credentialsDisplayItemContext,
  });
}
