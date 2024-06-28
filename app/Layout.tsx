import { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useBrand } from './hooks/useBrand';
import { FileBugButton } from './components/FileBugButton';

export default function Layout({ children }: PropsWithChildren) {
  const brand = useBrand();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container
        maxWidth='xs'
        sx={{
          position: 'relative',
          paddingX: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4.5,
            mb: 2,
          }}
        >
          {brand.logo && (
            <img
              alt={`${brand.name} logo`}
              src={brand.logo}
              style={{ maxWidth: 80 }}
            />
          )}
        </Box>
        {children}
        <Box mb={3} mx='auto'>
          <FileBugButton />
        </Box>
      </Container>
    </Box>
  );
}
