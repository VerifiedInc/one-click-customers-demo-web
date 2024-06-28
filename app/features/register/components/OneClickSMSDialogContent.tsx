import { useEffect, useRef } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { DialogContent, Typography, Stack, Button } from '@mui/material';
import { parsePhoneNumber } from 'libphonenumber-js';

import { useSocket } from '~/context/SocketContext';
import { useBrand } from '~/hooks/useBrand';
import { rooms } from '~/utils/socket';

type OneClickSMSDialogContentProps = {
  phone: string;
  onRetryClick(): void;
};

export function OneClickSMSDialogContent({
  phone,
  onRetryClick,
}: OneClickSMSDialogContentProps) {
  const brand = useBrand();
  const socket = useSocket();
  const socketRef = useRef(socket);

  // Effect to manage socket connection.
  useEffect(() => {
    const socket = socketRef.current;
    socket?.open({ query: { room: rooms.oneClickRoom(brand.uuid, phone) } });
    return () => {
      socket?.close();
    };
  }, [brand.uuid, phone]);

  // Effect to listen to the socket event of 1-click.
  useEffect(() => {
    const handleOneClickSuccessful = (url: string) => {
      // Remove the listener to infinite loop since it will redirect against the page that emits the event.
      socket?.io?.off('1-click-successful', handleOneClickSuccessful);
      const urlObject = new URL(url);
      window.location.href = urlObject.href.replace('http://', 'https://');
    };

    socket?.io?.on('1-click-successful', handleOneClickSuccessful);

    // Remove the listener to avoid memory leaks.
    return () => {
      socket?.io?.off('1-click-successful', handleOneClickSuccessful);
    };
  }, [socket]);

  return (
    <DialogContent>
      <Typography fontWeight={700} textAlign='center'>
        Please click the verification link we just texted to <br />
        {parsePhoneNumber(phone ?? '')?.formatNational?.() ?? phone}
      </Typography>
      <Stack justifyContent='center' mt={3}>
        <Button
          onClick={onRetryClick}
          variant='outlined'
          size='small'
          startIcon={<ArrowBack sx={{ width: 24, height: 24 }} />}
          sx={{
            alignSelf: 'center',
            py: 1,
            px: 2,
            fontSize: '1rem',
          }}
        >
          Re-Enter Phone
        </Button>
      </Stack>
    </DialogContent>
  );
}
