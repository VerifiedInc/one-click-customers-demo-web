import * as zod from 'zod';

export const SSNSchema = zod.string().regex(/^\d{9}$/);

export const timestampSchema = zod.string().refine((value) => {
  return !isNaN(Number(value));
});
