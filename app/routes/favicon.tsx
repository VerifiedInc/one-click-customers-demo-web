import { LoaderFunction, Response } from '@remix-run/node';
import axios from 'axios';
import sharp from 'sharp';

import { logger } from '~/logger.server';
import { Brand } from '~/utils/getBrand';
import { getBrandSet } from '~/utils/getBrandSet';

// Convert buffer to webp.
const toWebp = async (buffer: ArrayBuffer): Promise<Buffer> => {
  return sharp(buffer).resize(80, 80).webp({ quality: 80 }).toBuffer();
};

/**
 * Loader function to fetch the favicon for the brand.
 * Return default favicon if brand is not found.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const brandSet = await getBrandSet(searchParams);
  const brand: Brand | null = brandSet.brand;

  try {
    if (!brand.logo.length) {
      throw new Error(`No logo for ${brand.name}`);
    }

    const brandUrl = brand.logo.startsWith('https')
      ? brand.logo
      : `${url.origin}${brand.logo}`;
    const response = await axios.get(brandUrl, {
      responseType: 'arraybuffer',
    });

    return new Response(await toWebp(response.data as ArrayBuffer), {
      headers: {
        'Content-Type': 'image/webp',
      },
    });
  } catch {
    logger.error(
      `failed to fetch favicon for brand ${brand.name}, using verified inc one.`
    );

    // Use Verified's logo as favicon in case it failed to fetch the brand's logo.
    const response = await axios.get(`${url.origin}/verifiedinc.webp`, {
      responseType: 'arraybuffer',
    });

    return new Response(await toWebp(response.data as ArrayBuffer), {
      headers: {
        'Content-Type': 'image/webp',
      },
    });
  }
};
