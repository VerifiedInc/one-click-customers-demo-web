import { UserDto } from '@verifiedinc/core-types';
import {
  CaptureMessageOptions,
  ErrorCatch as IErrorCatch,
  ErrorCatchGateway,
  SeverityLevel,
} from './types';

export function ErrorCatch(provider: IErrorCatch): ErrorCatchGateway {
  return {
    captureException(exception: Error) {
      provider.sendException(exception);
    },
    captureMessage(message: string, options: CaptureMessageOptions): void {
      console.log('captureMessage', message, provider.name);

      let extra: Record<string, any> = {};
      let level: SeverityLevel = 'info';

      // Apply options status to extra if existing.
      if (options?.status) {
        extra = {
          ...extra,
          status: options.status,
        };
      }

      // Apply options extra if existing.
      if (options?.extra) {
        extra = {
          ...extra,
          ...options.extra,
        };
      }

      // Add stack if existing and set level to error.
      if (options.stack) {
        extra = {
          ...extra,
          stack: options.stack,
        };
        level = 'error';
      }

      if (options.error instanceof Error) {
        provider.sendException(options.error);
      }

      // create a Sentry event and return the eventId
      const eventId = provider.sendMessage(message, { level, extra });

      // Send user feedback.
      if (options.extra?.isFeedback) {
        const userFeedback = {
          event_id: eventId,
          name: options.extra?.email ?? '',
          email: options.extra?.email ?? '',
          comments: message,
        };
        // create a UserFeedback event in Sentry tied to the error event
        provider.sendFeedback(userFeedback);
      }
    },
    identifyUser(userOrEmail: string | UserDto): void {
      console.log('identifyUser', userOrEmail, provider.name);

      // userOrEmail is an email
      if (typeof userOrEmail === 'string') {
        provider.setUser({
          email: userOrEmail,
        });
        return;
      }

      // Use the first email
      const email = userOrEmail.emailAddresses[0];
      // User the first phone
      const phone = userOrEmail.phoneNumbers[0];
      // Use user id.
      const id = userOrEmail.uuid;

      // Identify user in Sentry.
      provider.setUser({
        email,
        phone,
        id,
      });
    },
  };
}
