import { useMemo } from 'react';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { Box, Button, Stack, SxProps, Typography } from '@mui/material';

import { mapSimplifiedToCredentialDto } from '~/utils/credentials';

import { useBrand } from '~/hooks/useBrand';
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
    const credentialRequests =
      oneClick.success.oneClickDB.presentationRequest.credentialRequests;
    const schemas = await getSchemas();
    return json({
      ...oneClick.success,
      credentials,
      credentialRequests,
      schemas,
    });
  }

  // No credentials found, so user should be redirected to the register page.
  searchParams.delete('1ClickUuid');
  searchParams.delete('optedOut');
  const _searchParams = searchParams.toString();
  return redirect('/register' + _searchParams ? '?' + _searchParams : '');
};

export default function PersonalInformation() {
  const brand = useBrand();
  const { credentials, credentialRequests, schemas } = useLoaderData();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const dashboardPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/${searchParamsString ? `?${searchParamsString}` : ''}`;
  }, [searchParams]);

  const successPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/verified${searchParamsString ? `?${searchParamsString}` : ''}`;
  }, [searchParams]);

  const buttonContainerSx: SxProps = {
    position: 'sticky',
    bottom: 0,
    py: 2,
    zIndex: 2,
    background:
      'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 1) 35%)',
    width: '100%',
  };

  const handleGetStarted = () => {
    if (typeof window === 'undefined') {
      navigate(dashboardPageLink);
      return;
    }
    navigate(successPageLink);
  };

  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h1' mt={0} align='center'>
        {brand.name}
      </Typography>
      <Typography
        variant='h3'
        mt={2.5}
        mb={1}
        fontWeight={400}
        textAlign='center'
      >
        Please fill the information below to get started
      </Typography>
      <Stack
        direction='column'
        spacing={2}
        mb={0}
        mt={4}
        width='100%'
        position='relative'
      >
        <RequestBody
          credentialRequests={credentialRequests}
          credentials={credentials}
          schema={schemas}
          renderExtra={({ isValid }) => (
            <Box sx={buttonContainerSx}>
              <Button onClick={handleGetStarted} fullWidth disabled={!isValid}>
                Get Started
              </Button>
            </Box>
          )}
        />
      </Stack>
    </Box>
  );
}
