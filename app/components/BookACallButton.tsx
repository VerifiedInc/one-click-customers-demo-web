import { useTheme } from '@emotion/react';
import { Button, ButtonProps } from '@mui/material';

import { VerifiedIncLogo } from './VerifiedIncLogo';
import { useAppContext } from '~/context/AppContext';

type BookACallButtonProps = ButtonProps;

export function BookACallButton(props: BookACallButtonProps) {
  const theme = useTheme() as unknown as any;
  const appContext = useAppContext();
  const bookACallUrl = appContext.config.bookACallUrl;
  const defaultProps = theme.components.MuiButton.defaultProps;
  return (
    <Button
      {...defaultProps}
      href={bookACallUrl}
      {...props}
      sx={{
        ...defaultProps.sx,
        ...props.sx,
        alignSelf: 'center',
        display: 'flex',
        width: 'auto',
        minHeight: 30,
        fontFamily: ['"Lato"', 'sans-serif'].join(','),
        lineHeight: 1.75,
        backgroundColor: '#0dbc3d!important',
        color: '#fff!important',
        borderColor: '#0dbc3d!important',
        textAlign: 'center',
        fontSize: 13,
        borderRadius: 1,
        py: 0.5,
        pl: 1.75,
        pr: 1.25,
      }}
    >
      Book a Call with{' '}
      {/* <WhiteLogoGreenCheck
        height={16}
        width={16}
        flexShrink={0}
        ml={0.5}
        mr={0.25}
        position='relative'
        top={-1}
      />{' '}
      Verified{' '}
      <Box component='span' fontSize={10} ml={0.25} lineHeight={0.5}>
        Inc.
      </Box> */}
      <VerifiedIncLogo ml={0.5} />
    </Button>
  );
}
