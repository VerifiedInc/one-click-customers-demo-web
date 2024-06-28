/* eslint-disable @typescript-eslint/no-empty-function */
import * as amplitude from '@amplitude/analytics-browser';

function AnalyticsFactory() {
  // If no API key is set, return empty functions
  if (!window.ENV.AMPLITUDE_API_KEY) {
    return {
      identify() {},
      track() {},
      trackWithProperties() {},
      page() {},
      reset() {},
    };
  }
  // Initialize Amplitude
  amplitude.init(window.ENV.AMPLITUDE_API_KEY, {
    defaultTracking: {
      pageViews: false,
      fileDownloads: false,
      formInteractions: false,
    },
  });

  return {
    // Identify user -> set user id and email (if available)
    identify(userId: string) {
      // Set user id for Amplitude
      amplitude.setUserId(userId);
    },
    reset() {
      amplitude.reset();
    },
    // Track without properties
    track(event: string) {
      // Track just logged user
      // TODO: Remove this when we solve the issue with multiple sessions
      if (amplitude.getUserId()) {
        amplitude.track({
          event_type: event,
        });
      }
    },
    // Track with properties
    trackWithProperties(event: string, record: Record<string, any>) {
      // Track just logged user
      // TODO: Remove this when we solve the issue with multiple sessions
      if (amplitude.getUserId()) {
        amplitude.track({
          event_type: event,
          event_properties: record,
        });
      }
    },
    // Page View Tracking
    page: (name: string) => {
      const pageViewProperties = {
        'Page Domain': location.hostname,
        'Page Path': location.pathname,
        'Page URL': location.href,
        'Page Title': document.title,
        'Page Referrer': document.referrer,
        'Page Search': location.search,
        'Page Hash': location.hash,
        'Page Host': location.host,
      };

      // Track just logged user
      // TODO: Remove this when we solve the issue with multiple sessions
      if (amplitude.getUserId()) {
        amplitude.track({
          event_type: `Viewed Page ${name}`,
          event_properties: {
            ...pageViewProperties,
          },
        });
      }
    },
  };
}

export const analyticsClient = AnalyticsFactory();
