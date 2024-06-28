import { formatBearerToken } from './formatBearerToken';

/**
 * Creates a headers object with the provided auth token
 * @param {string} accessToken an auth token
 * @param {Record<string, string>} headers additional headers to include
 * @returns {Record<string, string>} a headers object with the provided auth token
 */
export const makeAuthHeaders = (
  accessToken: string,
  headers: Record<string, string> = {}
) => {
  return {
    ...headers,
    Authorization: formatBearerToken(accessToken),
  };
};
