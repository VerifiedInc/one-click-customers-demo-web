import { json, TypedResponse } from '@remix-run/node';

/**
 * Represents a JSON response with a specific structure.
 *
 * @typeParam A - The type of the action.
 * @typeParam D - The type of the data.
 * @typeParam E - The type of the error.
 */
export type JsonResponse<A = any, D = any, E = any> = {
  _action: A; // The action associated with the response.
  data?: D | null; // The data contained in the response (optional).
  error?: E | null; // The error information (optional).
  isSuccess: boolean; // Indicates if the response is successful.
  isError: boolean; // Indicates if the response is an error.
};

/**
 * Create a TypedResponse with a JsonResponse structure.
 *
 * @param action - The action associated with the response.
 * @param data - The data to be included in the response (optional).
 * @param error - The error information, if applicable (optional).
 * @returns A TypedResponse containing the JsonResponse data structure.
 * @typeParam A - The type of the action.
 * @typeParam D - The type of the data.
 * @typeParam E - The type of the error.
 */
export function jsonResponse<A = any, D = any, E = any>(
  action: A,
  data?: D,
  error?: E
): TypedResponse<JsonResponse<A, D, E>> {
  const isSuccess = data !== null || !error;
  const isError = !!error;

  return json({
    _action: action,
    data: data || null,
    error: error || null,
    isSuccess,
    isError,
  });
}
