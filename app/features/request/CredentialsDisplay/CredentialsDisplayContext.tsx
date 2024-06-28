import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { Draft, produce } from 'immer';
import get from 'lodash/get';
import merge from 'lodash/merge';
import clone from 'lodash/clone';
import {
  CredentialDto,
  CredentialRequestDto,
  CredentialSchemaDto,
} from '@verifiedinc/core-types';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import {
  getCredentialPath,
  getDisplayableCredentials,
  getOrderedCredentialDisplayInfo,
  isUIValidCredential,
} from '~/features/request/CredentialsDisplay/utils';
import { isRequiredCredentialDisplayInfo } from '~/features/request/CredentialsDisplay/utils/isRequiredCredentialDisplayInfo';

export type CredentialsDisplayContext = {
  credentialRequests?: CredentialRequestDto[];
  credentials: CredentialDto[];
  displayInfoList: CredentialDisplayInfo[];
  schema: CredentialSchemaDto;
  receiverName?: string;
  isValid?: boolean;
  handleChangeCredentialInstance(path: string, credentialId: string): void;
  handleChangeValueCredential(path: string, value: unknown): void;
  handleClearValueCredential(path: string): void;
  handleChangeValidationCredential(path: string, valid: boolean): void;
  handleSelectCredential(
    path: string,
    checked: boolean,
    shouldCascade: boolean
  ): void;
  handleToggleEditModeCredential(path: string, editMode: boolean): void;
  handleChangeValidationChild(
    path: string,
    options: { type: string; valid: boolean; errorMessage?: string }[]
  ): void;
};

type CredentialDisplayReducer = (
  state: CredentialDisplayReducerState,
  action: CredentialDisplayReducerDispatch
) => CredentialDisplayReducerState;

type CredentialDisplayReducerState = Omit<
  CredentialsDisplayContext,
  | 'handleSelectCredential'
  | 'handleChangeValueCredential'
  | 'handleClearValueCredential'
  | 'handleChangeValidationCredential'
  | 'handleChangeCredentialInstance'
  | 'handleToggleEditModeCredential'
  | 'handleChangeValidationChild'
>;

type CredentialDisplayReducerDispatch = (
  state: Draft<CredentialDisplayReducerState>
) => void;

type CredentialValue = Omit<
  CredentialsDisplayContext,
  | 'isValid'
  | 'displayInfoList'
  | 'handleSelectCredential'
  | 'handleChangeValueCredential'
  | 'handleClearValueCredential'
  | 'handleChangeValidationCredential'
  | 'handleChangeCredentialInstance'
  | 'handleToggleEditModeCredential'
  | 'handleChangeValidationChild'
>;

const Context = createContext<CredentialsDisplayContext | null>(null);

/**
 * Hook that hold the context value, should be used in nested components to avoid props drilling.
 */
export function useCredentialsDisplay() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      'The component calling this hook is missing a parent with *CredentialDisplayProvider*'
    );
  }

  return context;
}

/**
 * This function is very useful to select nested objects, so for atomic credentials living in a deep level of composite credentials for example,
 * it is easy to access the data like "displayInfoList[0].children[0].children[0].label".
 * @param callback
 */
export function useCredentialsDisplaySelector<T>(
  callback: (state: CredentialsDisplayContext) => T
) {
  const state = useCredentialsDisplay();
  if (!state) {
    throw new Error(
      'The component calling this hook is missing a parent with *CredentialDisplayProvider*'
    );
  }
  return useMemo(() => callback(state), [state]);
}

/**
 * Credentials display context, on it we have all the business logic to control the display info state by handlers.
 * @param value
 * @param children
 * @constructor
 */
export default function CredentialsDisplayProvider({
  value,
  children,
}: {
  value: CredentialValue;
  children: ReactNode | ReactNode[];
}) {
  // Build the initial values based on value prop.
  const init = () => {
    const credentials = getDisplayableCredentials(value.credentials);
    const displayInfoList = getOrderedCredentialDisplayInfo(
      credentials,
      value.schema,
      value.credentialRequests,
      value.receiverName
    );

    return {
      ...value,
      credentials,
      displayInfoList,
    };
  };
  // Declare the state manager for the context.
  const [state, dispatch] = useReducer<CredentialDisplayReducer>(
    produce,
    init()
  );

  // Validate all credentials.
  const isValid = useMemo(() => {
    const checkValidity = (
      credentialDisplayInfo: CredentialDisplayInfo
    ): boolean => {
      // Does not need to validate unchecked credentials.
      if (!credentialDisplayInfo.uiState.isChecked) return true;

      // Verify validation for enabled input credentials only.
      if (
        !credentialDisplayInfo.children &&
        credentialDisplayInfo.credentialRequest?.allowUserInput
      ) {
        // // Does not need to validate for credential that are empty and not interacted by the user.
        if (
          !isRequiredCredentialDisplayInfo({
            required: credentialDisplayInfo.credentialRequest.required,
            mandatory: credentialDisplayInfo.credentialRequest.mandatory,
          }) &&
          !credentialDisplayInfo.value &&
          !credentialDisplayInfo.uiState.isChecked &&
          !credentialDisplayInfo.uiState.isDirty
        ) {
          return true;
        }

        return credentialDisplayInfo.uiState.isValid;
      }
      // Check composite/atomic credentials.
      if (Array.isArray(credentialDisplayInfo.children)) {
        return credentialDisplayInfo.children.every(checkValidity);
      }

      // Treat not allowed user input as valid.
      return true;
    };

    // Should be valid when at least one credential is checked.
    const atLeastOneIsChecked = (
      credentialDisplayInfo: CredentialDisplayInfo
    ): boolean => {
      return credentialDisplayInfo.uiState.isChecked;
    };

    return (
      state.displayInfoList.every(checkValidity) &&
      state.displayInfoList.some(atLeastOneIsChecked)
    );
  }, [state.displayInfoList]);

  const getDisplayInfo = (
    path: string | undefined,
    object: Record<string, any>
  ) => {
    return get(
      // Use draft root, it contains displayInfoList which is where the data is stored.
      object,
      // get credential path by defining current path and the root property.
      getCredentialPath(path, 'displayInfoList')
    ) as CredentialDisplayInfo;
  };

  /**
   * Changes the credential in displayInfoList by id.
   * @param path
   * @param credentialId   */
  const handleChangeCredentialInstance = (
    path: string,
    credentialId: string
  ) => {
    dispatch((draft) => {
      const displayInfo = getDisplayInfo(path, draft);
      const matchDisplayInfo = displayInfo.instances.find(
        (i) => i.id === credentialId
      );

      if (!matchDisplayInfo) {
        throw new Error('matchDisplayInfo should not be undefined.');
      }

      // Replaces the credential with match, make direct mutation for arrays to update values.
      displayInfo.children = matchDisplayInfo.children;
      merge(displayInfo, matchDisplayInfo);
    });
  };

  /**
   * Select/unselect the credential in displayInfoList by path.
   * @param path
   */
  const handleSelectCredential = (
    path: string,
    checked: boolean,
    shouldCascade = true
  ) => {
    dispatch((draft) => {
      const displayInfo = getDisplayInfo(path, draft);
      // Update cascade when credential is available to be checked/unchecked.
      const updateCascade = (credentialDisplayInfo: CredentialDisplayInfo) => {
        if (!credentialDisplayInfo.uiState) {
          throw new Error(`State for ${path} is undefined.`);
        }

        credentialDisplayInfo.uiState.isChecked = checked;

        if (shouldCascade) {
          credentialDisplayInfo.children?.forEach(updateCascade);
        }
      };

      updateCascade(displayInfo);
    });
  };

  /**
   * Changes a specific credential value.
   * @param path
   * @param value
   */
  const handleChangeValueCredential = (path: string, value: unknown) => {
    dispatch((draft) => {
      const displayInfo = getDisplayInfo(path, draft);
      displayInfo.value = String(value ?? '');
      displayInfo.uiState.isDirty = true;
    });
  };

  /**
   * Changes a specific credential validation value.
   * @param path
   * @param valid
   */
  const handleChangeValidationCredential = (path: string, valid: boolean) => {
    dispatch((draft) => {
      const displayInfo = getDisplayInfo(path, draft);

      // Remove path indexes from the path string.
      const getParentPath = (path: string | undefined) =>
        path
          ?.match(/\[\d+\]/g)
          ?.slice(0, -1)
          .join('');

      // Update bottom-up the validity of its ancestors credentials if any,
      // it will reevaluate the child validity ones.
      const validateParent = (
        path: string | undefined,
        credentialDisplayInfo: CredentialDisplayInfo
      ) => {
        // When there are no more parent nothing will be needed to be validated.
        if (!path) return;

        // Validate only composite ones.
        credentialDisplayInfo.uiState.isValid =
          credentialDisplayInfo.children?.every((credentialDisplayInfo) => {
            // Ignore unchecked credentials.
            if (!credentialDisplayInfo.uiState.isChecked) return true;
            // Ignore not allowed to user input.
            if (!credentialDisplayInfo.credentialRequest?.allowUserInput)
              return true;

            return credentialDisplayInfo.uiState.isValid;
          }) || false;

        // Update bottom-up the validity of its ancestors credentials if any,
        // it will reevaluate the child.
        validateParent(
          getParentPath(path),
          getDisplayInfo(getParentPath(path), draft)
        );
      };

      // Update the validity of selected credential and its ancestors.
      // Update only directly atomic credentials.
      if (!Array.isArray(displayInfo.children)) {
        displayInfo.uiState.isValid = valid;
      }
      validateParent(
        getParentPath(path),
        getDisplayInfo(getParentPath(path), draft)
      );
    });
  };

  /**
   * Clears the credential value by the path.
   * @param path
   */
  const handleClearValueCredential = (path: string) => {
    dispatch((draft) => {
      const displayInfo = getDisplayInfo(path, draft);
      displayInfo.value = '';
      displayInfo.uiState.isDirty = false;
      displayInfo.uiState.isValid = false;
    });
  };

  const handleToggleEditModeCredential = (path: string, editMode: boolean) => {
    dispatch((draft) => {
      const displayInfo = getDisplayInfo(path, draft);

      if (editMode) {
        displayInfo.originalInstance = clone(displayInfo);
      } else {
        merge(displayInfo, displayInfo.originalInstance!);
        displayInfo.originalInstance = null;
      }

      const updateCascadeEditMode = (
        credentialDisplayInfo: CredentialDisplayInfo
      ) => {
        credentialDisplayInfo.uiState.isEditMode = editMode;
        if (Array.isArray(credentialDisplayInfo.children)) {
          return credentialDisplayInfo.children.forEach(updateCascadeEditMode);
        }
      };

      updateCascadeEditMode(displayInfo);
    });
  };

  /**
   * Change the validation of child credentials.
   * @param options
   */
  const handleChangeValidationChild = (
    path: string,
    options: { type: string; valid: boolean; errorMessage?: string }[]
  ) => {
    dispatch((draft) => {
      const displayInfo = getDisplayInfo(path, draft);

      // Update only direct child credentials if are array.
      if (!Array.isArray(displayInfo.children)) return;

      for (const child of displayInfo.children) {
        const type = child.credentialRequest?.type || 'unknown';
        const matchOption = options.find((option) => option.type === type);

        if (matchOption) {
          child.uiState.isValid = matchOption.valid;
          child.uiState.errorMessage = matchOption.errorMessage || null;
        }
      }

      // Update the parent validity to sync with child.
      displayInfo.uiState.isValid = isUIValidCredential(displayInfo);
    });
  };

  return (
    <Context.Provider
      value={{
        ...state,
        isValid,
        handleChangeCredentialInstance,
        handleSelectCredential,
        handleChangeValueCredential,
        handleClearValueCredential,
        handleChangeValidationCredential,
        handleToggleEditModeCredential,
        handleChangeValidationChild,
      }}
    >
      {children}
    </Context.Provider>
  );
}
