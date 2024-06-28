// encapsulates browser "env vars"
export interface BrowserConfig {
  env: string;
  sentryDSN: string;
  release: string;
  googlePlacesApiKey: string;
}

export const browserConfig: BrowserConfig =
  window.ENV as unknown as BrowserConfig;
