import { BrandDto } from '@verifiedinc/core-types';

import { config } from '~/config';
import { getBrandApiKey, getBrandDto } from '~/coreAPI.server';

import { getBrand } from './getBrand';
import { logger } from '~/logger.server';

export const getBrandSet = async (searchParams: URLSearchParams) => {
  let brand = getBrand(null);
  let apiKey = config.verifiedApiKey;

  const brandUuid = searchParams.get('brand');

  // Override possibly brand in session if query param is set.
  if (brandUuid) {
    logger.info(`getting brand: ${brandUuid}`);

    const baseUrl = config.coreServiceUrl;
    const adminKey = config.coreServiceAdminAuthKey;

    apiKey = await getBrandApiKey(brandUuid, {
      baseUrl,
      adminKey,
    });

    logger.info(`got api key: ${apiKey}`);

    const brandDto = await getBrandDto(brandUuid, {
      baseUrl,
      adminKey,
    });

    brand = getBrand(brandUuid ? (brandDto as BrandDto) : null);

    logger.info(`got brand: ${JSON.stringify(brandUuid)}`);
  }

  return {
    apiKey,
    brand,
  };
};
