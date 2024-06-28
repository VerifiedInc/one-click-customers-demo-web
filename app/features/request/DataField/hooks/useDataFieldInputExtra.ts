import { MutableRefObject, useEffect } from 'react';

import { CredentialsDisplayItemContext } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

import { changeValue } from '~/features/request/DataField/observables';
import { useDataFieldLine1CredentialExtra } from '~/features/request/DataField/hooks/useDataFieldLine1CredentialExtra';

export type DataFieldExtraProps = {
  credentialsDisplayItem: CredentialsDisplayItemContext;
  inputRef: MutableRefObject<any | null>;
};

export function useDataFieldInputExtra(props: DataFieldExtraProps): any {
  const { credentialsDisplayItem } = props;
  const { handleChangeValueCredential, credentialDisplayInfo } =
    credentialsDisplayItem;

  // Set up an effect to observe changes in the data field value
  useEffect(() => {
    // Define a handler function to be called when the value changes
    const handler = ({ type, value }: { type: string; value: any }) => {
      // Check if the credentialRequest type matches the provided type and if children is not an array
      if (
        credentialDisplayInfo.credentialRequest?.type === type &&
        !Array.isArray(credentialDisplayInfo.children)
      ) {
        // If the conditions are met, call handleChangeValueCredential with the new value
        handleChangeValueCredential(value);
      }
    };

    // Add the observer function to listen for changes
    changeValue.addObserver(handler);

    return () => {
      // Clean up by removing the observer when the component unmounts or when the dependencies change
      changeValue.removeObserver(handler);
    };
  }, [credentialDisplayInfo, handleChangeValueCredential]);

  // Call the hook to handle the Line1Credential type.
  useDataFieldLine1CredentialExtra(
    props,
    credentialDisplayInfo.credentialRequest?.type === 'Line1Credential'
  );
}
