import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import {
  CredentialDto,
  CredentialRequestDto,
  CredentialSchemaDto,
} from '@verifiedinc/core-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CredentialsDisplayProvider, {
  CredentialsDisplayContext,
  useCredentialsDisplay,
} from '~/features/request/CredentialsDisplay/CredentialsDisplayContext';
import CredentialsDisplay from '~/features/request/CredentialsDisplay/CredentialsDisplay';

type RequestExtraProps = {
  children: (credentialsDisplay: CredentialsDisplayContext) => ReactNode;
};

function RequestExtra(props: RequestExtraProps) {
  const credentialsDisplay = useCredentialsDisplay();
  return <>{props.children(credentialsDisplay)}</>;
}

export function RequestBody({
  credentialRequests,
  credentials,
  schema,
  renderExtra,
}: {
  credentialRequests: CredentialRequestDto[];
  credentials: CredentialDto[];
  schema: CredentialSchemaDto['schemas'];
  renderExtra?: RequestExtraProps['children'];
}) {
  // Configure a React Query client to handle requests client side only,
  // it supports SSR as well but is not the focus.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: Infinity,
            retryDelay: 3000,
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const content = () => (
    <Box
      position='relative'
      display='flex'
      flexDirection='column'
      alignItems='center'
      sx={{ flex: 1, width: '100%' }}
    >
      <CredentialsDisplayProvider
        value={{
          credentialRequests,
          credentials,
          receiverName: undefined,
          schema: { schemas: schema },
        }}
      >
        <CredentialsDisplay />
        {renderExtra && <RequestExtra>{renderExtra}</RequestExtra>}
      </CredentialsDisplayProvider>
    </Box>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        display='flex'
        flex={1}
        sx={{
          width: '100%',
          // Traverse the card image elements to apply flex to them.
          '& > div, & > div > div': {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          },
        }}
      >
        {content()}
      </Box>
    </QueryClientProvider>
  );
}
