import * as zod from 'zod';

import { phoneSchema } from './phone.schema';
import { USDateSchema } from './date.schema';

export const oneClickNonHostedSchema = zod.object({
  phone: phoneSchema,
  birthDate: USDateSchema,
});
