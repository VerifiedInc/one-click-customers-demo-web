import { SentryErrorCatch } from '~/utils/errorCatch/providers/sentry';
import { ErrorCatch } from '~/utils/errorCatch/errorCatch';

export function MakeErrorCatch() {
  return ErrorCatch(SentryErrorCatch());
}
