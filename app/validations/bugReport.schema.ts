import * as zod from 'zod';
import { emailSchema } from './email.schema';
import { descriptionSchema } from './description.schema';

export const bugReportSchema = zod.object({
  email: emailSchema,
  description: descriptionSchema,
});

export type BugReportSchemaType = zod.infer<typeof bugReportSchema>;
