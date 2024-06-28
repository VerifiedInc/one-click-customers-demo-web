import {
  getNewChildren,
  NewChildCredential,
  WithNewChildren,
} from './getNewChildren';
import { hasNewChildren } from './hasNewChildren';
import {
  ExistingCredential,
  isExistingCredential,
} from './isExistingCredential';
import { isNewCredential, NewCredential } from './isNewCredential';
import {
  isTemporaryCredential,
  TemporaryCredential,
} from '~/utils/credentials/isTemporaryCredential';

/**
 * Input type for the categorizeCredentials function
 * Encapsulates fields that are necessary for the function to work
 */
export type CategorizableCredential<T = unknown> = T & {
  children?: CategorizableCredential<T>[];
  isNewCredential?: boolean;
  id: string;
};

/**
 * Helper to categorize submitted credentials according to how they should be handled
 * @param credentials
 * @returns
 */
export const categorizeCredentials = <T = unknown>(
  credentials: CategorizableCredential<T>[]
): {
  newCredentials: NewCredential<T>[];
  temporaryCredentials: TemporaryCredential<T>[];
  existingCredentials: ExistingCredential<T>[];
  newChildren: NewChildCredential<T>[];
  existingCredentialsWithNewChildren: WithNewChildren<T>[];
} => {
  const existingCredentials = credentials.filter(isExistingCredential);
  const newCredentials = credentials.filter(isNewCredential);
  const temporaryCredentials = credentials.filter(isTemporaryCredential);
  const existingCredentialsWithNewChildren = credentials.filter(hasNewChildren);
  const newChildren = existingCredentialsWithNewChildren.flatMap(
    getNewChildren as any
  ) as any[];

  return {
    existingCredentials,
    temporaryCredentials,
    newCredentials,
    newChildren,
    existingCredentialsWithNewChildren,
  };
};
