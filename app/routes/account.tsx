import { useMemo } from 'react';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { Box, Typography, Stack, Button } from '@mui/material';

import { mapSimplifiedToCredentialDto } from '~/utils/credentials';

import { getOneClickUseCase } from '~/features/oneClick/useCases/getOneClickUseCase';
import { getSchemas } from '~/coreAPI.server';
import { RequestBody } from '~/features/request/request/RequestBody';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const oneClick = await getOneClickUseCase({ request });

  if (oneClick?.success) {
    const credentials = mapSimplifiedToCredentialDto(
      oneClick.success.oneClick.credentials
    );
    const schemas = await getSchemas();
    return json({
      ...oneClick.success,
      credentials,
      schemas,
    });
  }

  // No credentials found, so user should be redirected to the register page.
  const _searchParams = searchParams.toString();
  return redirect('/register' + _searchParams ? '?' + _searchParams : '');
};

export default function Account() {
  const { credentials, credentialRequests, schemas } = useLoaderData();

  const [searchParams] = useSearchParams();
  const verifieddPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/verified${searchParamsString ? `?${searchParamsString}` : ''}`;
  }, [searchParams]);

  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h1' mt={0} align='center'>
        My Account
      </Typography>
      <Stack
        direction='column'
        spacing={2}
        my={2}
        mt={4}
        width='100%'
        position='relative'
      >
        <RequestBody
          credentialRequests={credentialRequests}
          credentials={credentials}
          schema={schemas}
        />
        <Link to={verifieddPageLink}>
          <Button fullWidth>Go Back</Button>
        </Link>
      </Stack>
    </Box>
  );
}
