import {
  CredentialDto,
  CredentialSchemaDto,
  PresentationRequestDto,
} from '@verifiedinc/core-types';

export type RequestDataLoader = {
  presentationRequest: PresentationRequestDto;
  credentials: CredentialDto[];
  schema: Promise<CredentialSchemaDto>;
  redirectUrl: string | null;
  requestPagePath: string;
  isConciergeEnabled: boolean;
  isOneClick: boolean;
};
