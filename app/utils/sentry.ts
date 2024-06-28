import * as Sentry from '@sentry/types';

// This list of fields to redact is used to remove sensitive data from Sentry error reports,
// these matching values will be replaced with the redacted string.
const dataListToRedact: any[] = [];

// This list of paths to redact is used to remove sensitive data from Sentry error reports,
// these matching urls will redact including the request header and request data.
const requestsToRedact = ['/request/', '/publicRequest/', '/cards/'];

// This function is used to remove sensitive data from Sentry error reports.
const applyRedacted = () => 'REDACTED';

// This function is used to allow to redact function to remove sensitive data.
const someRequestUrl = (url: string | undefined) => {
  if (!url) return false;

  for (const requestUrl of requestsToRedact) {
    if (url.includes(requestUrl)) {
      return true;
    }
  }
  return false;
};

// Applies redacted to a string.
const redactValue = (str: string) => {
  let stringCopy = str;

  for (const pattern of dataListToRedact) {
    if (typeof pattern === 'string') {
      stringCopy = stringCopy.replace(
        new RegExp(pattern, 'g'),
        applyRedacted()
      );
    }
    if (pattern instanceof RegExp) {
      stringCopy = stringCopy.replace(pattern, applyRedacted());
    }
  }

  return stringCopy;
};

/**
 * This function is used to remove sensitive data from Sentry error reports.
 * @param event
 */
export function redactEvent(event: Sentry.Event): any {
  // Modify or drop the event here.
  if (event.breadcrumbs) {
    // Redact sensitive breadcrumbs.
    event.breadcrumbs.forEach((crumb) => {
      crumb.message = redactValue(crumb.message || '');
    });
  }

  if (event.request) {
    // Redact everything in the request.
    if (someRequestUrl(event.request.url)) {
      // Redact sensitive request data.
      event.request.url = applyRedacted();
      event.request.data = applyRedacted();
      // Redact sensitive request headers.
      if (event.request.headers) {
        event.request.headers = {};
      }
    }

    if (event.exception) {
      // Redact sensitive exception data.
      event.exception.values?.forEach((value) => {
        value.stacktrace?.frames?.forEach((frame) => {
          frame.filename = redactValue(frame.filename || '');
          frame.function = redactValue(frame.function || '');
        });
      });
    }
  }

  // Return the modified event.
  return event;
}
