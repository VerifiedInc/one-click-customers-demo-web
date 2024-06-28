import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { config } from './config';
import { Brand } from './utils/getBrand';
import { getBrandSet } from './utils/getBrandSet';
import { getSharedCredentialsOneClick } from './coreAPI.server';

/*************************
 * SESSION FUNCTIONALITY *
 *************************/

/**
 * Creates a session storage object
 * @see https://remix.run/docs/en/v1/utils/sessions#createcookiesessionstorage
 */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secrets: [config.sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  },
});

// key for getting/setting the user name in the session
const USER_SESSION_KEY = 'userName';

/**
 * Gets the session from the request
 * @param {Request} request
 * @returns {Promise<Session>} session
 */
export const getSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
};

/**
 * Gets the user from the session
 * @param {Request} request
 * @returns {Promise<string | null>} user
 */
export const getUserName = async (request: Request): Promise<string | null> => {
  const session = await getSession(request);
  const name = session.get(USER_SESSION_KEY);
  return name;
};

/**
 * Logs a user out
 * Clears the session cookie and redirects to the login page
 * @param {Request} request
 * @returns {Promise<Response>} response
 */
export const logout = async (request: Request, redirectUrl?: string) => {
  console.log('logout');
  const session = await getSession(request);
  return redirect(redirectUrl || '/register', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
};

/**
 * Requires 1ClickUiid query param to be set to mock user with a session.
 * logs out if no result is found
 * @param {Request} request
 * @returns {Promise<OneClickDto>} oneClickDto
 */
export const requireSession = async (request: Request) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const oneClickUuid = searchParams.get('1ClickUuid');

  if (oneClickUuid) {
    const brandSet = await getBrandSet(searchParams);

    const result = await getSharedCredentialsOneClick(oneClickUuid, {
      baseUrl: config.coreServiceUrl,
      apiKey: brandSet.apiKey,
    });

    if (result) return result;
  }

  throw await logout(
    request,
    `/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  );
};

/**
 * Creates a user session and sets the session cookie
 * @param {Request} request
 * @param {string} userUuid
 */
export const createUserSession = async (
  request: Request,
  name: string,
  redirectTo = '/'
) => {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, name);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
};

/*******************************
 * BRAND SESSION FUNCTIONALITY *
 ******************************/

/**
 * Creates a brand session storage object
 * @see https://remix.run/docs/en/v1/utils/sessions#createcookiesessionstorage
 */
export const brandSessionStorage = createCookieSessionStorage<{
  brand: Brand;
  apiKey: string;
}>({
  cookie: {
    name: '__brand_session',
    secrets: [config.sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  },
});

/**
 * Gets the brand session from the request
 * @param {Request} request
 * @returns {Promise<Session>} session
 */
export const getBrandSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  return brandSessionStorage.getSession(cookie);
};

const BRAND_SESSION_KEY = 'brand';
const APIKEY_SESSION_KEY = 'apiKey';

/**
 * Creates a brand session.
 * @param {Request} request
 * @param {Brand} brand
 * @returns
 */
export const createBrandSession = async (
  request: Request,
  brand: Brand,
  apiKey: string
) => {
  const session = await getBrandSession(request);
  session.set(BRAND_SESSION_KEY, brand);
  session.set(APIKEY_SESSION_KEY, apiKey);
  const commited = await brandSessionStorage.commitSession(session, {
    secure: true,
    sameSite: 'none',
  });
  return commited;
};
