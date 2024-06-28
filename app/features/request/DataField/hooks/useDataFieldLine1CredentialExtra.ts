import { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

import { useAppContext } from '~/context/AppContext';

import { Address } from '~/features/request/DataField/types';
import { DataFieldExtraProps } from '~/features/request/DataField/hooks/useDataFieldInputExtra';
import { changeValue } from '~/features/request/DataField/observables';

export function useDataFieldLine1CredentialExtra(
  props: DataFieldExtraProps,
  shouldHandle: boolean
): any {
  const appContext = useAppContext();

  const buildAddress = (place: any): Address => {
    const address: Address = {
      line1: '',
      city: '',
      state: '',
      country: '',
      postcode: '',
    };
    // Get each component of the address from the place details,
    for (const component of place.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number': {
          address.line1 = `${component.long_name} ${address.line1}`;
          break;
        }

        case 'route': {
          address.line1 += component.short_name;
          break;
        }

        case 'postal_code': {
          address.postcode = `${component.long_name}${address.postcode}`;
          break;
        }

        case 'postal_code_suffix': {
          address.postcode = `${address.postcode}-${component.long_name}`;
          break;
        }

        case 'locality':
          address.city = component.long_name;
          break;

        case 'administrative_area_level_1': {
          address.state = component.short_name;
          break;
        }

        case 'country':
          address.country = component.short_name;
          break;
      }
    }

    return address;
  };

  const dispatchAddress = (address: Address) => {
    if (address.line1) {
      changeValue.notify({
        type: 'Line1Credential',
        value: address.line1,
      });
    }
    if (address.city) {
      changeValue.notify({ type: 'CityCredential', value: address.city });
    }
    if (address.state) {
      changeValue.notify({
        type: 'StateCredential',
        value: address.state,
      });
    }
    if (address.country) {
      changeValue.notify({
        type: 'CountryCredential',
        value: address.country,
      });
    }
    if (address.postcode) {
      changeValue.notify({
        type: 'ZipCodeCredential',
        value: address.postcode,
      });
    }
  };

  useEffect(() => {
    if (!shouldHandle) return;

    const loader = new Loader({
      apiKey: appContext.config.googlePlacesApiKey,
      version: 'weekly',
    });
    loader.importLibrary('places').then((library) => {
      const autocomplete = new library.Autocomplete(props.inputRef.current, {
        componentRestrictions: { country: ['us', 'ca'] },
        fields: ['address_components'],
        types: ['address'],
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        dispatchAddress(buildAddress(place));
      });
    });
  }, [shouldHandle]);
}
