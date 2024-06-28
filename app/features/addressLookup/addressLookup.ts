import { AddressLookup } from './types/addressLookup';
import { googleProvider } from './providers/google';

/**
 * Address lookup module, used to search for address using zipcode.
 * @returns {AddressLookup}
 */
export function addressLookup(): AddressLookup {
  const provider = googleProvider();
  return {
    zipCodeLookup(zipcode: string) {
      return provider.zipCodeLookup(zipcode);
    },
  };
}
