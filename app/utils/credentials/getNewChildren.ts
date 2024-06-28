/**
 * Input type for the getNewChildren function
 * Encapsulates fields that are necessary for the function to work
 */
export type WithNewChildren<T = unknown> = T & {
  children?: WithNewChildren<T>[];
  isNewCredential?: boolean;
  id: string;
};

/**
 * Output type for the getNewChildren function
 * Encapsulates fields that are necessary for the function to work
 */
export type NewChildCredential<T = unknown> = T & {
  parentId: string;
};

/**
 * Helper to extract new children from a credential
 * @param {U extends WithNewChildren<T>} credential
 * @returns {NewChildCredential[]} an array of new children
 */
export const getNewChildren = <T = unknown>(
  credential: WithNewChildren<T>
): NewChildCredential<T>[] => {
  // Do not get credentials when they are parent and is a new credential, they will be issued all together.
  if (
    credential.children &&
    credential.children.length > 0 &&
    credential.isNewCredential
  ) {
    return [];
  }

  // if the credential has no children, return an empty array
  if (!credential.children || credential.children.length === 0) {
    return [];
  }

  const newChildren: NewChildCredential<T>[] = [];

  for (const child of credential.children) {
    if (child.isNewCredential) {
      // const dataKey = getCredentialDataKey(child.type);
      newChildren.push({
        ...child,
        parentId: credential.id,
      });
    }

    if (child.children) {
      newChildren.push(...getNewChildren<T>(child));
    }
  }

  return newChildren;
};
