import { validationError } from 'remix-validated-form';

export type ValidateError = {
  subaction?: string;
  formId?: string;
  fieldErrors: Record<string, string>;
};

// This method is responsible to extract the ValidateError object and return a proper json response to the client side,
// On client side we can repopulate fields and do UX improvements from there.
export function validateError(
  error: ValidateError,
  repopulateFields?: unknown,
  init?: ResponseInit
) {
  return validationError(error, repopulateFields, init);
}
