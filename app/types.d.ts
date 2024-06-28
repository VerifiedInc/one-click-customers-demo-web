import { CredentialDto } from '@verifiedinc/core-types';

export type CredentialDtoDomain = CredentialDto & {
  providedBy?: string;
  verificationMethod?: string | null;
};
