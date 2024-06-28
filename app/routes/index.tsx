import { useEffect, useMemo, useRef } from 'react';
import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
} from '@remix-run/node';
import { Form, Link, useSearchParams } from '@remix-run/react';
import {
  AccountCircle,
  AutoGraph,
  CreditCard,
  Send,
} from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';

import { driver, driverLinks } from '~/libs/driver';
import { requireSession } from '~/session.server';

import IconBoxAndLabel from '~/components/IconBoxAndLabel';
import SpendSummary from '~/components/SpendSummary';

import { useBrand } from '~/hooks/useBrand';
import { logoutUseCase } from '~/features/logout/usecases/logoutUseCase';

export const links: LinksFunction = () => [...driverLinks()];

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  return logoutUseCase({ request });
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  // requireSession will redirect to the login page if the required params is not present to return the required data
  const session = await requireSession(request);
  // return the session to the route, so it can be displayed
  return json({ session });
};

export default function Index() {
  const brand = useBrand();
  const [searchParams] = useSearchParams();
  const accountPageLink = useMemo(() => {
    const searchParamsString = searchParams.toString();
    return `/account${searchParamsString ? `?${searchParamsString}` : ''}`;
  }, [searchParams]);

  const profileRef = useRef<Element | null>(null);
  const signOutRef = useRef<HTMLButtonElement | null>(null);
  const borderRadius = 30;

  useEffect(() => {
    const tourKey = `tour-${brand.uuid}`;
    const session = sessionStorage.getItem(tourKey);
    // If the user has already seen the tour, don't show it again
    if (session) return;
    sessionStorage.setItem(tourKey, 'true');

    driver({
      animate: true,
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          popover: {
            title: 'Welcome',
            description: "Let's take a quick tour of the app.",
            side: 'top',
            align: 'start',
          },
        },
        {
          element: profileRef.current as Element,
          popover: {
            title: 'Account Information',
            description: 'Here you can see your account information.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: signOutRef.current as Element,
          popover: {
            title: 'Sign Out',
            description: 'To sign out, you can click here.',
            side: 'top',
            align: 'start',
          },
        },
      ],
    }).drive();
  }, []);

  return (
    <Box
      position='relative'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Box
        position='absolute'
        zIndex={-1}
        top={-116}
        bgcolor='primary.main'
        height={324}
        width='100%'
        sx={{
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}
      />
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        width='100%'
      >
        <Box
          color='neutral.light'
          display='flex'
          flexDirection='column'
          alignItems='center'
          ml={2}
        >
          <Typography variant='h1'>$7,425</Typography>
          <Typography variant='subtitle1' fontWeight={400}>
            Available balance
          </Typography>
        </Box>
        <Box pr={2}>
          <Box ref={profileRef}>
            <Link to={accountPageLink}>
              <IconButton>
                <AccountCircle
                  sx={{ fontSize: '4rem', color: 'neutral.light' }}
                />
              </IconButton>
            </Link>
          </Box>
        </Box>
      </Box>
      <SpendSummary />
      <Box width='90%' mt={4.5} mb={2.25}>
        <Typography variant='h4'>Activity</Typography>
      </Box>
      <Box display='flex' justifyContent='space-between' width='90%'>
        <IconBoxAndLabel label='Transfer'>
          <Send sx={{ color: 'neutral.light' }} />
        </IconBoxAndLabel>
        <IconBoxAndLabel label='My Card'>
          <CreditCard sx={{ color: 'neutral.light' }} />
        </IconBoxAndLabel>
        <IconBoxAndLabel label='Insight'>
          <AutoGraph sx={{ color: 'neutral.light' }} />
        </IconBoxAndLabel>
      </Box>
      <Form method='post'>
        <Button ref={signOutRef}>Sign Out</Button>
      </Form>
    </Box>
  );
}
