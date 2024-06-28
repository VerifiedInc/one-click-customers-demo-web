import { Box } from '@mui/material';

export function OneClickPoweredBy() {
  return (
    <Box component='a' href='https://www.verified.inc' display='flex'>
      <Box
        component='img'
        src='/1-click-powered-by.svg'
        alt='1-Click Signup powered by Verified'
        px={4}
        mt={2}
        width='100%'
        maxWidth='350px'
        sx={{ textAlign: 'center' }}
      />
    </Box>
  );
}
