import * as zod from 'zod';
import { withZod } from '@remix-validated-form/with-zod';
import { DisplayFormatEnum } from '@verifiedinc/core-types';

import { UUIDFragmentSchema } from '~/features/request/validations/fragments/uuid';
import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';

const CredentialDisplayInfoItemSchema: zod.ZodType<CredentialDisplayInfo> =
  zod.lazy(() =>
    zod.object({
      id: UUIDFragmentSchema,
      value: zod.string(),
      label: zod.string().optional(),
      type: zod.string().optional(),
      displayFormat: zod.nativeEnum(DisplayFormatEnum).optional(),
      isNewCredential: zod.boolean(),
      providedBy: zod.string().or(zod.null()).optional(),
      verificationMethod: zod.string().or(zod.null()).optional(),
      children: zod.union([
        zod.lazy(() => CredentialDisplayInfoItemSchema).array(),
        zod.undefined(),
      ]),
      credentialRequest: zod.any({}),
      schema: zod.any({}),
      instances: zod.lazy(() => CredentialDisplayInfoItemSchema).array(),
      originalInstance: zod.union([
        zod.lazy(() => CredentialDisplayInfoItemSchema),
        zod.null(),
      ]),
      uiState: zod.object({
        isChecked: zod.boolean(),
        isValid: zod.boolean(),
        isDirty: zod.boolean(),
        isEditMode: zod.boolean(),
        errorMessage: zod.string().or(zod.null()),
      }),
    })
  );

const CredentialDisplayInfoSchema: zod.ZodType<CredentialDisplayInfo[]> =
  zod.lazy(() => CredentialDisplayInfoItemSchema.array());

export const RequestCredentialSchema = zod.object({
  presentationRequestUuid: UUIDFragmentSchema,
  credentialDisplayInfoList: CredentialDisplayInfoSchema,
  receiverName: zod.string().optional(),
  logoImageUrl: zod.string().optional(),
  redirectUrl: zod.string().optional(),
  isConciergeEnabled: zod
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  isOneClick: zod
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
});

export type RequestCredentialValidationType = zod.infer<
  typeof RequestCredentialSchema
>;

export const RequestCredentialValidator = withZod(RequestCredentialSchema);
