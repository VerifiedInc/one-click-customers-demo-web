import { logger } from '~/logger.server';

import { config } from '~/config';
import { fetchEnhanced } from '~/utils/fetch';

import { AddressLookup } from '../types/addressLookup';

export function googleProvider(): AddressLookup {
  const baseUrl = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  const apiKey = config.googleGeocodingApiKey;

  baseUrl.searchParams.set('key', apiKey);

  return {
    async zipCodeLookup(zipcode: string) {
      const url = new URL(baseUrl.toString());
      url.searchParams.set('address', zipcode);
      const response = await fetchEnhanced(url);

      if (response.ok) {
        const data = await response.json();

        // If the status is OK, then a address was found.
        if (data.status === 'OK') {
          // Find US country in result list.
          const result = data.results.find((result: any) => {
            return result.address_components.some((component: any) => {
              // Validate only against US country.
              return (
                component.short_name === 'US' &&
                component.types.includes('country')
              );
            });
          });

          if (!result) {
            throw new Error(
              `Address lookup for zipcode ${zipcode} was not found`
            );
          }

          // Find city
          const city = result.address_components.find((component: any) =>
            component.types.includes('locality')
          );

          // Find state
          const state = result.address_components.find((component: any) =>
            component.types.includes('administrative_area_level_1')
          );

          // Find country
          const country = 'US';

          const match = {
            city: city.long_name,
            state: state?.short_name,
            country,
            zipcode,
          };

          logger.debug(
            `Found address lookup for ${zipcode}: ${JSON.stringify(match)}`
          );

          return match;
        } else {
          const errorMessage = `Error fetching address lookup for ${zipcode}: ${JSON.stringify(
            data
          )}`;
          logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      const notFoundMessage = `Address lookup for ${zipcode} was not found`;
      logger.error(notFoundMessage);
      throw new Error(notFoundMessage);
    },
  };
}
