import { FormEventHandler } from 'react';
import { Form, useNavigate, useSearchParams } from '@remix-run/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import * as Sentry from '@sentry/remix';

import { useField } from '~/hooks/useField';
import { emailSchema } from '~/validations/email.schema';
import { descriptionSchema } from '~/validations/description.schema';
import { bugReportSchema } from '~/validations/bugReport.schema';

export const loader = () => {
  return null;
};

/**
 * A page for users to report bugs
 */
export default function BugReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // navigate back to the previous page
  const goBack = () => navigate(-1);

  const email = useField({ name: 'email', schema: emailSchema });
  const description = useField({
    name: 'description',
    schema: descriptionSchema,
  });
  const validation = bugReportSchema.safeParse({
    email: email.value,
    description: description.value,
  });
  const isValid = validation.success;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!validation.success) return;

    const data = validation.data;

    // send the bug report to Provider
    Sentry.captureMessage(data.description, { extra: { email: data.email } });

    navigate(`/bugReport/submitted?${searchParams.toString()}`);
  };

  return (
    <Box
      component='main'
      marginTop={2}
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h1' textAlign='center' fontWeight={900}>
        Oh No!
      </Typography>
      <Typography
        variant='body1'
        textAlign='center'
        width='100%'
        marginTop={2}
        sx={{ wordBreak: 'break-word' }}
      >
        Something not quite right? Let us know what went wrong, and we'll work
        on fixing it for you.
      </Typography>
      <Box marginTop={2} component='section' maxWidth='300px'>
        <Form method='POST' onSubmit={handleSubmit}>
          <>
            <TextField
              multiline
              label='What happened?'
              name='description'
              placeholder='Describe the problem'
              value={description.value}
              onChange={description.change}
              error={!!description.error}
              helperText={description.error}
              sx={{
                '& textarea': {
                  px: '14px!important',
                },
                '& fieldset': {
                  borderRadius: '.5rem!important',
                },
              }}
            />
            <TextField
              label='Email'
              name='email'
              value={email.value}
              onChange={email.change}
              error={!!email.error}
              helperText={email.error}
              sx={{
                mt: 2,
                '& fieldset': {
                  borderRadius: '.5rem!important',
                },
              }}
            />
            <Box marginTop={2} display='flex' justifyContent='space-between'>
              <Button type='button' color='error' onClick={goBack}>
                Cancel
              </Button>
              <Button type='submit' disabled={!isValid}>
                Submit
              </Button>
            </Box>
          </>
        </Form>
      </Box>
    </Box>
  );
}
