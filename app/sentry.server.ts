import * as Sentry from '@sentry/remix';
import { config } from '~/config';

export function initSentry() {
  // Initialize Sentry on server side.
  // see docs: https://docs.sentry.io/platforms/javascript/guides/remix/#configure
  Sentry.init({
    // We define a release on initialize so Sentry can know which release to use the sourcemap do show human-readable stack traces.
    release: config.COMMIT_SHA,
    // Environment options are: local, development, sandbox and production
    environment: config.ENV,
    dsn: config.sentryDSN,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    // Headers are only attached to requests that are from web wallet project in their URL.
    tracePropagationTargets: [
      // Exclude build path and Log Rocket requests from performance.
      // Context about Log Rocket:
      // Sentry adds baggage to the request body and Log Rocket are very strict to yours payload, giving CORS error if extra param is attached.
      /^\/?((?!(health\/alive?.+)).)*$/gim,
      /^\/?((?!(build?.+)).)*$/gim,
      /^\/?((?!(\.awswaf.com)).)*$/gim,
      /^\/?((?!(\.googleapis.com)).)*$/gim,
    ],
    ignoreErrors: ['query() call aborted', 'queryRoute() call aborted'],
    // Performance Monitoring
    tracesSampleRate: 1.0, // opting to record 100% of all transactions in all envs for now
    beforeSendTransaction(event) {
      // Ignore health/alive route to not consume the quota
      if (event.transaction === 'routes/health.alive') {
        // Don't send the event to Sentry
        return null;
      }

      return event;
    },
  });
}
