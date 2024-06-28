import { CredentialDto } from '@verifiedinc/core-types';

export function mapSimplifiedToCredentialDto(
  simplifiedCredential: Record<string, any>
): CredentialDto[] {
  const credentials: CredentialDto[] = [];

  const entries = Object.entries(simplifiedCredential);

  for (const [key, value] of entries) {
    const isArrayData =
      typeof value === 'object' && !Array.isArray(value) && value !== null;
    const type = key.slice(0, 1).toUpperCase() + key.slice(1) + 'Credential';
    const credential: Omit<CredentialDto, 'data'> = {
      id: crypto.randomUUID(),
      createdAt: String(Date.now()),
      updatedAt: String(Date.now()),
      type,
      issuanceDate: String(Date.now()),
      expirationDate: null,
      issuerUuid: crypto.randomUUID(),
    };

    credentials.push({
      ...credential,
      data: isArrayData
        ? mapSimplifiedToCredentialDto(value)
        : {
            [key]: value,
          },
    });
  }

  return credentials;
}
