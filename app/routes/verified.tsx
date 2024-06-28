import { Box, Button, Typography } from '@mui/material';
import { Refresh, Share } from '@mui/icons-material';
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { requireSession } from '~/session.server';

import { VerifiedImage } from '~/components/VerifiedImage';
import { useBrand } from '~/hooks/useBrand';
import { logoutUseCase } from '~/features/logout/usecases/logoutUseCase';
import { useFullName } from '~/hooks/useFullName';
import { OriginalButton } from '~/components/OriginalButton';
import { useShareDemo } from '~/features/share/hooks/useShareDemo';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const searchParamsString = searchParams.toString();
  const query = `${searchParamsString ? `?${searchParamsString}` : ''}`;
  const formData = await request.clone().formData();
  const action = formData.get('action');

  switch (action) {
    case 'logout': {
      return logoutUseCase({ request });
    }
    case 'account': {
      return redirect(`/account${query}`);
    }
    default: {
      return redirect(`/${query}`);
    }
  }
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  // requireSession will redirect to the login page if the required params is not present to return the required data
  const session = await requireSession(request);
  // return the session to the route, so it can be displayed
  return json({ session });
};

export default function Verified() {
  const brand = useBrand();
  const { session } = useLoaderData<typeof loader>();
  const name = useFullName(session);
  const { handleShareDemo } = useShareDemo();

  const solidButtonProps = {
    sx: {
      mt: 3,
      py: 2,
      px: 3.5,
      fontSize: '1.4rem',
    },
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Typography variant='h1' align='center' mt={0}>
        Welcome to
        <br />
        {brand.name}, {name}!
      </Typography>
      <Typography
        variant='h3'
        align='center'
        sx={{ fontSize: 22, fontWeight: 400, mt: 2 }}
      >
        You're verified and signed up.
      </Typography>
      <Form method='post'>
        <input name='action' value='account' readOnly hidden />
        <Button {...solidButtonProps}>My Account</Button>
      </Form>
      <Form method='post'>
        <input name='action' value='logout' readOnly hidden />
        <Button
          variant='outlined'
          size='small'
          sx={{
            alignSelf: 'center',
            py: 1,
            px: 2,
            fontSize: '1rem',
            mt: 2,
          }}
        >
          Sign Out
        </Button>
      </Form>
      <Box mt={6}>
        <VerifiedImage theme={brand.theme} sx={{ maxWidth: 267 }} />
      </Box>
      <Form method='post'>
        <input name='action' value='logout' readOnly hidden />
        <OriginalButton
          newVariant='gray'
          size='small'
          startIcon={<Refresh />}
          sx={{
            alignSelf: 'center',
            py: 1,
            px: 2,
            fontSize: '1rem',
            mt: 2,
          }}
        >
          Restart Demo
        </OriginalButton>
      </Form>
      <OriginalButton
        onClick={handleShareDemo}
        type='button'
        variant='contained'
        size='small'
        startIcon={<Share />}
        sx={{
          alignSelf: 'center',
          py: 1,
          px: 2,
          fontSize: '1rem',
          mt: 2,
        }}
      >
        Share Demo
      </OriginalButton>
    </Box>
  );
}
