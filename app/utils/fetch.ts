import * as Sentry from '@sentry/remix';

import { getErrorMessage } from '~/errors';

// This is a helper function to set the response to the current parent span, can be loader or action.
function setResponseToSpan(input: RequestInfo | URL, responseJSON = '') {
  // Run server side only.
  if (typeof window !== 'undefined') return;

  const currentSpan = Sentry.getCurrentHub().getScope().getSpan();

  if (currentSpan) {
    let key;
    let method;

    if (input instanceof URL) {
      key = input.pathname;
      method = 'GET';
    } else if (typeof input === 'string') {
      key = input;
      method = 'GET';
    } else {
      key = input.method;
      method = input.method || 'GET';
    }

    currentSpan.data = { [`${method} ${key}`]: responseJSON };
  }
}

/**
 * This is enhanced version of fetch that handles connectivity issues.
 * @param input Request info or URL
 * @param init Request init
 * @param options Options to control retries and wait time.
 * @returns {Promise<Response>}
 */
export function fetchEnhanced(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: { retries: number; waitMS: number } = { retries: 10, waitMS: 3000 }
): Promise<Response> {
  return new Promise((resolve, reject) => {
    fetch(input, init).then(
      // Success case.
      async (response) => {
        const _response = response.clone();
        const _responseToSpan = response.clone();
        setResponseToSpan(input, await _responseToSpan.text());
        resolve(_response);
      },
      // Error case.
      (error) => {
        setResponseToSpan(input, getErrorMessage(error));

        // The fetch failed due to connectivity issues, wait 3 seconds and try again.
        // If out of retries, reject the promise straight.
        if (
          options.retries > 0 &&
          error instanceof TypeError &&
          error.message === 'Failed to fetch'
        ) {
          setTimeout(
            () =>
              resolve(
                fetchEnhanced(input, init, {
                  ...options,
                  retries: options.retries - 1,
                })
              ),
            options.waitMS
          );
          return;
        }

        reject(error);
      }
    );
  });
}
