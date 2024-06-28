import { json, LoaderFunction } from '@remix-run/node';
import { fetchEnhanced } from '~/utils/fetch';

export const path = (src: string) =>
  `/credentialImageSearch?query=${encodeURIComponent(src)}`;

/**
 * This loader is an API like that fetches the image containing in the query parameter, extract and return it.
 * */
export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  // Query is the file url stored in remote bucket that we want to extract base64 from.
  const query = url.searchParams.get('query');

  // Do not allow empty query parameter.
  if (!query) {
    return json({ error: new Error('Url is missing.') }, { status: 400 });
  }

  try {
    // We fetch the raw file that contain the base64 string.
    const response = await fetchEnhanced(decodeURIComponent(query), {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    });
    const base64 = await response.text();

    return json({ data: base64 });
  } catch (error) {
    return json({ error }, { status: 404 });
  }
};
