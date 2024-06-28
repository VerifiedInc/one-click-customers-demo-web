import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from '@remix-run/react';

export default function BugReportSubmitted() {
  const navigate = useNavigate();

  // navigate back to 2 pages ago
  const handleDone = () => navigate(-2);

  return (
    <Box
      component='main'
      marginTop={2}
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h2' textAlign='center' fontWeight={900}>
        Thank You
      </Typography>
      <Typography
        variant='body1'
        textAlign='center'
        width='100%'
        marginTop={2}
        sx={{ wordBreak: 'break-word' }}
      >
        Your report has been submitted.
      </Typography>
      <Box component='section'>
        <Button onClick={handleDone}>Done</Button>
      </Box>
    </Box>
  );
}
