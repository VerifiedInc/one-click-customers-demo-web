import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';

/**
 * Filters and returns an array of selected credentials from the provided list.
 * The function also recursively filters and updates the children of selected credentials.
 *
 * @param credentialDisplayInfoList - The list of CredentialDisplayInfo objects to filter.
 * @returns An array of CredentialDisplayInfo objects that have `uiState.isChecked` set to `true`
 * and meet specific criteria defined in the function.
 */
export function getSelectedCredentials(
  credentialDisplayInfoList: CredentialDisplayInfo[]
): CredentialDisplayInfo[] {
  return (
    credentialDisplayInfoList
      // Get selected credentials.
      .filter(
        (credentialDisplayInfo) => credentialDisplayInfo.uiState.isChecked
      )
      // Map the credentials to repeat the previous process when is composite.
      .map((credentialDisplayInfo) => ({
        ...credentialDisplayInfo,
        children: Array.isArray(credentialDisplayInfo.children)
          ? getSelectedCredentials(credentialDisplayInfo.children)
          : undefined,
      }))
  );
}
