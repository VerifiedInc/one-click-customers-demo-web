import { ActionFunction } from '@remix-run/node';

import { jsonResponse } from '~/utils/server';

import { addressLookup } from '~/features/addressLookup/addressLookup';

export const path = () => `/addressZipCodeLookup`;

/**
 * This action is an API route that looks up an address based on a zipcode.
 * */
export const action: ActionFunction = async ({ request }) => {
  try {
    const action = 'addressZipCodeLookup';
    const zipcode = (await request.formData()).get('zipcode');

    if (!zipcode) {
      throw new Error('Zipcode is missing');
    }

    // Lookup the address based on the zipcode
    const response = await addressLookup().zipCodeLookup(
      encodeURIComponent(zipcode as string)
    );

    return jsonResponse(action, response);
  } catch (error: any) {
    return jsonResponse(action, null, {
      message: error?.message,
    });
  }
};
