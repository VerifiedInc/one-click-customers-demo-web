/**
 * Formats the email to make it compact.
 * @param email
 */
export function compactEmail(email: string) {
  // Decode email since it can be received from a query string.
  const _email = decodeURIComponent(email);

  const EMAIL_NAME_LIMIT_LENGTH = 8;
  const DOMAIN_LIMIT_LENGTH = 8;
  const emailPattern =
    /([a-zA-Z0-9._+-]+)(@)([a-zA-Z0-9._+-]+)(\.[a-zA-Z0-9_+-]+)/;

  // If the given email param is not a real email, just return it.
  if (!emailPattern.test(_email)) return _email;

  let [, emailName, at, domain, tld] = _email.split(emailPattern);

  if (emailName?.length > EMAIL_NAME_LIMIT_LENGTH) {
    emailName = emailName.slice(0, EMAIL_NAME_LIMIT_LENGTH) + '..';
  }

  if (domain?.length > DOMAIN_LIMIT_LENGTH) {
    domain = '..' + domain.slice(-DOMAIN_LIMIT_LENGTH);
  }

  return `${emailName}${at}${domain}${tld}`;
}
