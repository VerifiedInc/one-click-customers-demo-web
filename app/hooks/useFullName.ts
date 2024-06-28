import { OneClickDto } from '@verifiedinc/core-types';

export function useFullName(session: OneClickDto) {
  const fullName = session?.credentials?.fullName;
  // Full name credential can be either a string or a record containing optionally the first name, last name, middle name.
  const firstName =
    typeof fullName === 'string' ? fullName : fullName?.firstName;
  return firstName;
}
