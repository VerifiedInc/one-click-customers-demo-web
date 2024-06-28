/**
 * Input type for isExistingCredential
 * Encapsulates fields that are necessary for the function to work
 */
export type MaybeExistingCredential<T = unknown> = T & {
  isNewCredential?: boolean;
  children?: MaybeExistingCredential<T>[];
};

/**
 * asserted type for isExistingCredential
 * Encapsulates fields that are guaranteed to be present if the assertion passes
 */
export type ExistingCredential<T = unknown> = T & {
  isNewCredential?: false;
};
/**
 * Helper function to determine if a credential already exists.
 * recursively checks if all children are existing credentials
 * @param credential
 * @returns
 */
export const isExistingCredential = <T = unknown>(
  credential: MaybeExistingCredential<T>
): credential is ExistingCredential<T> => {
  //  credential is new
  if (credential.isNewCredential) {
    return false;
  }

  // credential is not new, and has no children
  if (!credential.children || credential.children.length === 0) {
    return true;
  }

  // credential is not new, and has children
  // check if all children are existing credentials
  return credential.children.every(isExistingCredential);
};
