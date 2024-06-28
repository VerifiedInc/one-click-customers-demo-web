/**
 * Input type for isNewCredential
 * Encapsulates fields that are necessary for the function to work
 */
export type MaybeNewCredential<T = unknown> = T & {
  isNewCredential?: boolean;
};

/**
 * Output type for isNewCredential
 * Encapsulates fields that are guaranteed to be present if the assertion passes
 */
export type NewCredential<T = MaybeNewCredential> = T & {
  isNewCredential: true;
};

/**
 * Type guard to determine if a credential is new
 * @param {MaybeNewCredential} credential the credential to check
 * @returns {credential is NewCredential<T>} asserts that the credential is new
 */
export const isNewCredential = <T = unknown>(
  credential: MaybeNewCredential<T>
): credential is NewCredential<T> => {
  return credential.isNewCredential || false;
};
