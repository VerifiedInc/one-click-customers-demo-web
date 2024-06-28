import React from 'react';
import { Box } from '@mui/system';

export function DragIndicator({ offset }: Readonly<{ offset: number }>) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: offset + 'px',
        right: 0,
        height: '2px',
        bgcolor: 'primary.main',
        pointerEvents: 'none',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '-4px',
          width: '6px',
          height: '6px',
          bgcolor: 'white',
          borderRadius: '50%',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'primary.main',
        },
      }}
    />
  );
}
