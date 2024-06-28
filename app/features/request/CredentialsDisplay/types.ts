import {
  CredentialDto,
  CredentialRequestDto,
  CredentialSchemaDto,
} from '@verifiedinc/core-types';

/**
 * Represents the information to display for a single credential.
 */
export interface CredentialDisplayInfo {
  id: string;
  label?: string | undefined;
  value: string;
  displayFormat?: string | undefined;
  isNewCredential: boolean;
  providedBy?: string | null;
  verificationMethod?: string | null;
  children?: CredentialDisplayInfo[] | undefined;
  credentialRequest?: Omit<CredentialRequestDto, 'children' | 'issuers'>;
  schema?: CredentialSchemaDto['schemas'][string];
  instances: CredentialDisplayInfo[];
  originalInstance: CredentialDisplayInfo | null;
  uiState: CredentialDisplayInfoUIState;
}

/**
 * Represents the state to manage a single credential behavior on UI.
 */
export interface CredentialDisplayInfoUIState {
  isEditMode: boolean;
  isChecked: boolean;
  isValid: boolean;
  isDirty: boolean;
  errorMessage: string | null;
}

/**
 * Represents the information needed to display credential(s) of a specific type.
 */
export interface CredentialTypeDisplayInfo {
  displayFormat?: string;
  label: string;
  heading: string;
  type: string;
  schema: CredentialSchemaDto['schemas'][string];
}

export type CredentialDtoDomain = CredentialDto & {
  providedBy?: string;
  verificationMethod?: string | null;
};
