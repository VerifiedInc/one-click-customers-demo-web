import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';

import { getErrorMessage, getErrorStack, getErrorStatus } from '../errors';
import { logger } from '../logger.server';
import { logout } from '../sessions.server';

/**
 * Wraps a Remix data function (action or loader) to add logging and error handling.
 * Re-throws errors as JSON responses, which Remix is better able to handle.
 * @param {ActionFunction | LoaderFunction} fn The action or loader function to wrap.
 * @returns {ActionFunction | LoaderFunction} The wrapped function.
 */
export function wrapDataFunction<Fn extends LoaderFunction>(fn: Fn): Fn {
  return async function handleDataFunction(args: DataFunctionArgs) {
    const { request } = args;

    // We can determine the type of data function from the request method
    // (loaders handle GET requests, actions handle all other methods)
    const type = request.method === 'GET' ? 'loader' : 'action';
    const url = new URL(request.url);
    const { pathname } = url;

    // Log the request
    logger.debug(
      `Called ${type} for route ${pathname} with args ${JSON.stringify(args)}`
    );
    try {
      return await fn(args);
    } catch (error) {
      if (error instanceof Response) {
        // If it's a redirect, it's not really an error
        // so no need to log it, and can just re-throw as-is
        if (error.status >= 300 && error.status < 400) {
          throw error;
        }

        // if the error is a 401 (Not Authenticated) or 403 (Forbidden), log the user out
        if (error.status === 401 || error.status === 403) {
          throw await logout(request);
        }

        // if it's not a redirect, that means a response was thrown
        // log and re-throw it as-is
        logger.error(
          `Error response in ${type} for route ${pathname}. ${JSON.stringify(
            error
          )}`
        );
        throw error;
      }

      const message = getErrorMessage(error);
      const status = getErrorStatus(error);
      const stack = getErrorStack(error);

      // Log the error
      logger.error(
        `Error in ${type} for route ${pathname}. Message: ${message}, status: ${status}, stack: ${stack}`
      );

      // if the error is a 401 (Not Authenticated) or 403 (Forbidden), log the user out
      if (status === 401 || status === 403) {
        throw await logout(request);
      }

      // re-throw a JSON response with the error details, status, etc
      throw json({ message, status, stack }, { status });
    }
  } as Fn;
}
