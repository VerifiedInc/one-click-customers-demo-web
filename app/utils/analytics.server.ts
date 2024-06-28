/* eslint-disable @typescript-eslint/no-empty-function */
import * as amplitude from '@amplitude/analytics-node';

function AnalyticsFactory() {
  if (!process.env.AMPLITUDE_API_KEY) {
    return {
      track() {},
    };
  }

  amplitude.init(process.env.AMPLITUDE_API_KEY, {});

  return {
    track(event: amplitude.Types.BaseEvent) {
      amplitude.track(event);
    },
  };
}

export const analyticsServer = AnalyticsFactory();
