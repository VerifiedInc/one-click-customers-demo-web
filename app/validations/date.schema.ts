import * as zod from 'zod';

export const USDateSchema = zod.string().refine((value: string) => {
  const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (regex.test(value)) {
    const date = Date.parse(String(new Date(value)));
    return !isNaN(date);
  }
  return false;
}, 'Date is invalid');
