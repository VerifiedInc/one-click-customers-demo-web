import { isRouteErrorResponse } from '@remix-run/react';
import { getErrorMessage, getErrorStack, getErrorStatus } from '../errors';

/**
 * Parses an error into a message, status, and stack
 * Intended for use with errors thrown by Remix data functions, which may be RouteResponseErrors, regular Errors, or other throwable types
 * @param {unknown} error The error to parse.
 * @returns {{ message: string, status: number, stack?: string }} The parsed error data
 */
export function parseRouteError(error: unknown) {
  let message: string;
  let status: number;
  let stack: string | undefined;

  // a RouteErrorResponse is a Response thrown by a Remix data function
  // it has a status and a data property, which contains the error details
  if (isRouteErrorResponse(error)) {
    message = error.data.message;
    status = error.status;
    stack = error.data.stack;
  } else if (error instanceof Error) {
    // if the error is a regular Error, we can get the message, status, and stack from it
    message = getErrorMessage(error);
    status = getErrorStatus(error);
    stack = getErrorStack(error);
  } else {
    // if some other type of value was thrown, we don't really know what to do with it
    // so we'll just return a generic error message and status
    message = 'Unknown error';
    status = 500;
  }

  return { message, status, stack, error };
}
