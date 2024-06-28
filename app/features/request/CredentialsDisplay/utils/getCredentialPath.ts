/**
 * This function gets the path to the credential, handy to combine with get from lodash to access it in an optimal way.
 * @param path
 * @param root
 */
export function getCredentialPath(
  path: string | undefined,
  root: string
): string {
  if (!path) return '';

  const pattern = /\[(\d+)\]/gm;
  const match = path.match(pattern);

  if (!match) return '';

  return match.reduce((acc, match, index) => {
    if (index === 0) {
      return acc + `${match}`;
    }

    return acc + `.children${match}`;
  }, root);
}
