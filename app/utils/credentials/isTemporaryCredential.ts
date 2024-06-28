/**
 * Input type for isExistingCredential
 * Encapsulates fields that are necessary for the function to work
 */
export type MaybeTemporaryCredential<T = unknown> = T & {
  isNewCredential?: boolean;
  providedBy?: string;
  verificationMethod?: string;
  children?: MaybeTemporaryCredential<T>[];
};

/**
 * asserted type for isExistingCredential
 * Encapsulates fields that are guaranteed to be present if the assertion passes
 */
export type TemporaryCredential<T = unknown> = T & {
  isNewCredential?: false;
  providedBy: string;
  verificationMethod: string;
};
/**
 * Helper function to determine if a credential is temporary.
 * recursively checks if all children are existing credentials
 * @param credential
 * @returns
 */
export const isTemporaryCredential = <T = unknown>(
  credential: MaybeTemporaryCredential<T>
): credential is TemporaryCredential<T> => {
  //  credential is new
  if (credential.isNewCredential) {
    return false;
  }

  // credential is not new and has a providedBy field, denoting it is from a data provider service
  if (credential.providedBy) return true;

  // credential is not new, and has no children
  if (!credential.children || credential.children.length === 0) {
    return !!credential.providedBy;
  }

  // credential is not new, and has children
  // check if all children are existing credentials
  return credential.children.every(isTemporaryCredential);
};
