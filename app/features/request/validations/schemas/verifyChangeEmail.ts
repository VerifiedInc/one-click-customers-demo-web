import * as zod from 'zod';
import { withZod } from '@remix-validated-form/with-zod';

import { EmailFragmentSchema } from '~/features/request/validations/fragments/email';

export const VerifyChangeEmailSchema = zod.object({
  email: EmailFragmentSchema,
});

export const VerifyChangeEmailValidator = withZod(VerifyChangeEmailSchema);
