/**
 * Helper to create a credential data object from a type and value
 * @returns {Record<string, string>} the credential data object
 */
export const makeCredentialData = ({
  value,
  type,
  schemas,
  isNewCredential,
}: {
  value: string | Record<string, any>[];
  type: string;
  schemas: Record<string, any>;
  isNewCredential?: boolean;
}): Record<string, any> => {
  const dataKey = Object.keys(schemas[type].properties || {})[0] || 'data';
  const mapCompositeCredentialData = (credentials: Record<string, any>[]) => {
    return credentials.map((credential): Record<string, any> => {
      const dataKey =
        Object.keys(schemas[credential.type].properties || {})[0] || 'data';
      const dataValue = credential.children || credential.value || '';

      if (dataValue) {
        const credentialData = {
          id: credential.id,
          type: credential.type || '',
          data: Array.isArray(dataValue)
            ? mapCompositeCredentialData(dataValue)
            : { [dataKey]: credential.value },
          verificationMethod: credential.isNewCredential
            ? 'self_attested'
            : credential.verificationMethod ?? 'self_attested',
        };

        // credential data does not need id for new credentials.
        if (isNewCredential) {
          delete credentialData.id;
        }

        return credentialData;
      }

      return credential;
    });
  };

  if (Array.isArray(value)) {
    return mapCompositeCredentialData(value).filter(Boolean);
  }

  return { [dataKey]: value };
};
