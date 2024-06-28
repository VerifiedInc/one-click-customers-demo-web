import groupBy from 'lodash/groupBy';
import {
  UserIdentifierDto,
  UserIdentifierTypeEnum,
} from '@verifiedinc/core-types';

/**
 * Groups an array of UserIdentifierDto objects by their 'type' property
 * and returns the result as a Record, where the keys are UserIdentifierTypeEnum values
 * and the values are arrays of UserIdentifierDto objects.
 *
 * @param userIdentifiers - An array of UserIdentifierDto objects to be grouped by 'type'.
 * @returns A Record where keys are UserIdentifierTypeEnum values and values are arrays
 * of UserIdentifierDto objects.
 */
export function groupByType(
  userIdentifiers: UserIdentifierDto[]
): Record<UserIdentifierTypeEnum, UserIdentifierDto[]> {
  // Use the 'groupBy' function to group 'userIdentifiers' by 'type' property
  // and cast the result to the appropriate type.
  return groupBy(userIdentifiers, 'type') as Record<
    UserIdentifierTypeEnum,
    UserIdentifierDto[]
  >;
}
