import { createContext, ReactNode, useContext } from 'react';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import { useCredentialsDisplay } from '~/features/request/CredentialsDisplay/CredentialsDisplayContext';

export type CredentialsDisplayItemContext = {
  credentialDisplayInfo: CredentialDisplayInfo;
  parentCredentialDisplayInfo?: CredentialDisplayInfo;
  isSelectable: boolean;
  isRoot: boolean;
  path: string;
  handleSelectCredential(checked: boolean, shouldCascade?: boolean): void;
  handleChangeValueCredential(value: unknown): void;
  handleClearValueCredential(): void;
  handleChangeValidationCredential(valid: boolean): void;
  handleChangeCredentialInstance(credentialId: string): void;
  handleToggleEditModeCredential(editMode: boolean): void;
  handleChangeValidationChild(
    options: { type: string; valid: boolean; errorMessage?: string }[]
  ): void;
};

const Context = createContext<CredentialsDisplayItemContext | null>(null);

/**
 * This hook will give access to the credential in the level that it is being called.
 */
export function useCredentialsDisplayItem() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      'The component calling this hook is missing a parent with *CredentialsDisplayItemProvider*'
    );
  }

  return context;
}

type CredentialsDisplayItemProviderProps = {
  children: ReactNode | ReactNode[];
  credentialDisplayInfo: CredentialDisplayInfo;
  parentCredentialDisplayInfo?: CredentialDisplayInfo;
  isSelectable: boolean;
  isRoot: boolean;
  path: string;
};

/**
 * This is a context for the usage of rendered display items and its data field components
 * for a more manageable state.
 * @param props
 * @constructor
 */
export default function CredentialsDisplayItemProvider(
  props: CredentialsDisplayItemProviderProps
) {
  const { children, ...restProps } = props;
  const credentialDisplay = useCredentialsDisplay();

  /**
   * Select/unselect the credential in displayInfoList by the path.
   */
  const handleSelectCredential = (checked: boolean, shouldCascade = true) => {
    credentialDisplay.handleSelectCredential(
      restProps.path,
      checked,
      shouldCascade
    );
  };

  /**
   * Change credential instance by the credentialId and by the path.
   * @param credentialId
   */
  const handleChangeCredentialInstance = (credentialId: string) => {
    credentialDisplay.handleChangeCredentialInstance(
      restProps.path,
      credentialId
    );
  };

  /**
   * Changes the credential value by the path.
   * @param value
   */
  const handleChangeValueCredential = (value: unknown) => {
    credentialDisplay.handleChangeValueCredential(restProps.path, value);
  };

  /**
   * Changes the credential validation by the path.
   * @param valid
   */
  const handleChangeValidationCredential = (valid: boolean) => {
    credentialDisplay.handleChangeValidationCredential(restProps.path, valid);
  };

  /**
   * Clears the credential value by the path.
   */
  const handleClearValueCredential = () => {
    credentialDisplay.handleClearValueCredential(restProps.path);
  };

  const handleToggleEditModeCredential = (editMode: boolean) => {
    credentialDisplay.handleToggleEditModeCredential(restProps.path, editMode);
  };

  /**
   * Change the validation of child credentials.
   * @param options
   */
  const handleChangeValidationChild = (
    options: { type: string; valid: boolean; errorMessage?: string }[]
  ) => {
    credentialDisplay.handleChangeValidationChild(restProps.path, options);
  };

  return (
    <Context.Provider
      value={{
        ...restProps,
        handleSelectCredential,
        handleChangeCredentialInstance,
        handleChangeValueCredential,
        handleChangeValidationCredential,
        handleClearValueCredential,
        handleToggleEditModeCredential,
        handleChangeValidationChild,
      }}
    >
      {children}
    </Context.Provider>
  );
}
