import { useMutation } from '@tanstack/react-query';

import { fetchEnhanced } from '~/utils/fetch';
import { JsonResponse } from '~/utils/server';

import { ZipCodeLookupResponse } from '../types/addressLookup';
import { path } from '~/routes/addressZipCodeLookup';

type Request = { zipcode: string };

type Response = {
  state: string;
  city: string;
  country: string;
  zipcode: string;
};

export function useZipCodeLookup() {
  return useMutation<Response, Error, Request>({
    mutationKey: ['zipcode-lookup'],
    mutationFn: async function handleMutation({ zipcode }: any) {
      const formData = new FormData();
      formData.set('zipcode', zipcode);

      const response = await fetchEnhanced(path(), {
        method: 'POST',
        body: formData,
      });
      const data: JsonResponse<string, ZipCodeLookupResponse, Error> =
        await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data as Response;
    },
  });
}
