import * as Sentry from '@sentry/remix';
import { CaptureContext, SeverityLevel, User } from '@sentry/types';

import { ErrorCatch as IErrorCatch } from '../types';

export function SentryErrorCatch(): IErrorCatch {
  return {
    name: 'Sentry',
    sendException(exception) {
      return Sentry.captureException(exception);
    },
    sendFeedback(feedback) {
      return Sentry.captureUserFeedback(feedback);
    },
    sendMessage<T = CaptureContext | SeverityLevel>(
      message: string,
      options?: T
    ) {
      return Sentry.captureMessage(message, options as any);
    },
    setUser<T = User>(user: T | null): any {
      return Sentry.setUser(user || null);
    },
  };
}
