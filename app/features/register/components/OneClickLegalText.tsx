import { Typography } from '@mui/material';

import { useBrand } from '~/hooks/useBrand';

export function OneClickLegalText() {
  const brand = useBrand();

  return (
    <Typography
      variant='caption'
      mt={1.8}
      mb={4.5}
      px={2}
      color='neutral.main'
      sx={{ textAlign: 'center' }}
    >
      By entering your phone number, you agree to receive a text to create a
      Verified account for 1-Click Signup at {brand.name} and other supported
      sites.
    </Typography>
  );
}
