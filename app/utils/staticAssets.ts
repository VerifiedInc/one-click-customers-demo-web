// Get the base url from the source of each side.
const baseURL =
  typeof window !== 'undefined'
    ? window?.ENV?.cdnBaseUrl || ''
    : process?.env?.CDN_BASE_URL || '';

// Set root dir where the static assets for the project lives on.
const rootDir = '/web-wallet';

const makeUrl = (path: string) => `${baseURL}${rootDir}${path}`;

export const assets = {
  images: {
    authenticationGraphic: makeUrl('/authentication-graphic.svg'),
    gmail: makeUrl('/gmail.svg'),
    gmailAddBadge: makeUrl('/gmail_add_badge.svg'),
    gmailButtonUpgrade: makeUrl('/gmail_button_upgrade.svg'),
    horizontalGreenLogo: makeUrl('/horizontal-green-logo.svg'),
    logoGreenWhiteCheck: makeUrl('/logo-green-white-check.svg'),
    logoWhiteGreenCheck: makeUrl('/logo-white-green-check.svg'),
    outlook: makeUrl('/outlook.svg'),
    verifiedEmailDialogGraphic: makeUrl('/VerifiedEmailDialogGraphic.svg'),
    verifiedEmail: {
      autoReply: makeUrl('/verifiedEmail/Auto_Reply.png'),
      inboxExampleGmail: makeUrl('/verifiedEmail/Inbox Example (Gmail).png'),
      inboxExampleOutlook: makeUrl(
        '/verifiedEmail/Inbox Example (Outlook).png'
      ),
      verifiedBadge200px: makeUrl('/verifiedEmail/Verified Badge 200px.png'),
    },
  },
} as const;
