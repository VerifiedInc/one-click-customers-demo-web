import { Button, Stack, Typography, useTheme } from '@mui/material';
import { useMatches, useSearchParams } from '@remix-run/react';

export function FileBugButton() {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const matches = useMatches();
  const isBugReport = matches.some((match) => match.id?.includes('bugReport'));

  if (isBugReport) return null;

  return (
    <Stack direction='column' alignItems='center' justifyContent='center'>
      <Button
        href={`/bugReport?${searchParams.toString()}`}
        variant='text'
        sx={{ mt: 2, color: theme.palette.neutral.main }}
      >
        Report an Issue
      </Button>
    </Stack>
  );
}
