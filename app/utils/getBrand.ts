import tinycolor from 'tinycolor2';
import { BrandDto } from '@verifiedinc/core-types';

export type Brand = {
  uuid: string;
  name: string;
  logo: string;
  homepageUrl: string | null;
  theme: {
    light: string;
    main: string;
    dark: string;
  };
};

export function getBrand(brandDto: BrandDto | null): Brand {
  if (!brandDto) {
    return {
      uuid: '_',
      name: 'Hooli',
      logo: '/logo192.webp',
      homepageUrl: '',
      theme: {
        light: '#51d0fe',
        main: '#01abe8',
        dark: '#016082',
      },
    };
  }

  const primaryColor = brandDto.primaryColor || '#a5a5a5';

  return {
    uuid: brandDto.uuid,
    name: brandDto.receiverName,
    logo: brandDto.logoImageUrl ?? '',
    homepageUrl: brandDto.homepageUrl,
    theme: {
      light: tinycolor(primaryColor).lighten(20).toString(),
      main: primaryColor,
      dark: tinycolor(primaryColor).darken(20).toString(),
    },
  };
}
