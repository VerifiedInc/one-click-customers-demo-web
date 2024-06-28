import { NewChildCredential } from './getNewChildren';
import { isNewCredential } from './isNewCredential';

/**
 * Input type for the getNewChildren function
 * Encapsulates fields that are necessary for the function to work
 */
export type MaybeWithNewChildren<T = unknown> = T & {
  children?: MaybeWithNewChildren<T>[];
  isNewCredential?: boolean;
};

/**
 * Output type for the getNewChildren function
 * Encapsulates fields that are guaranteed to be present
 */
export type WithNewChildren<T = unknown> = T & {
  children?: NewChildCredential<T>[];
  isNewCredential: false;
};

/**
 * Helper function to determine if a credential has new children.
 * checks if any children are new credentials
 * @param {MaybeWithNewChildren} credential
 * @returns {boolean}
 */
export const hasNewChildren = <T = unknown>(
  credential: MaybeWithNewChildren<T>
): credential is WithNewChildren<T> => {
  const children = [...(credential.children || [])];

  if (!children || children.length === 0) {
    return false;
  }

  while (children.length > 0) {
    const child = children.pop();

    if (!child) {
      continue;
    }

    if (isNewCredential(child)) {
      return true;
    }

    if (child.children) {
      children.push(...child.children);
    }
  }

  return false;
};
