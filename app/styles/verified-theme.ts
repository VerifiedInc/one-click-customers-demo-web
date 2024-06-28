import { PaletteColorOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import * as colors from './colors';

declare module '@mui/material/styles' {
  // custom palette
  interface Palette {
    neutral: Palette['primary'];
    warningContrast: PaletteColorOptions;
    infoContrast: PaletteColorOptions;
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
    warningContrast: PaletteColorOptions;
    infoContrast: PaletteColorOptions;
  }

  // custom typography
  interface TypographyVariants {
    label: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
  }

  interface BreakpointOverrides {
    xxs: true;
  }
}

// custom button
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    warningContrast: true;
    infoContrast: true;
  }
}

// custom typography
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}

// add neutral color palette as color option for buttons
declare module '@mui/material' {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

const typography = {
  fontFamily: ['"Lato"', 'sans-serif'].join(','),
  h1: {
    fontSize: '2.125rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.35,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.33,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.35,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.15px',
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: 0.1,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1.25rem',
    fontWeight: 300,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  body2: {
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  button: {
    // fontSize set by MUI button component sizes, setting it here will screw that up
    fontWeight: 900,
    letterSpacing: 0,
    lineHeight: 1.2,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.25,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.25,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
};

export const shadows = {
  bottomSheet:
    '0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12)',
};

// Create a theme instance.

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.green,
      light: colors.lightGreen,
      dark: colors.darkGreen,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.blue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white,
    },
    error: {
      main: colors.red,
      light: colors.lightRed,
      dark: colors.darkRed,
      contrastText: colors.white,
    },
    warning: {
      main: colors.yellow,
      light: colors.yellow, // lightYellow is too light, makes alerts practically invisible
      dark: colors.darkYellow,
      contrastText: colors.white,
    },
    success: {
      main: colors.green,
      light: colors.green, // lightGreen is too light for alerts
      dark: colors.darkGreen,
      contrastText: colors.white,
    },
    info: {
      main: colors.blue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white,
    },
    neutral: {
      main: colors.grey,
      light: colors.lightGrey,
      dark: colors.darkGrey,
    },
  },
  typography,
  components: {
    MuiModal: {
      styleOverrides: {
        root: {
          zIndex: 1305,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          ...typography.subtitle2,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        text: {
          color: colors.white,
        },
        root: {
          textTransform: 'none',
          borderRadius: 30,
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
      defaultProps: {
        size: 'large',
        variant: 'contained',
        type: 'submit',
        sx: {
          mt: 4,
          py: 2,
          px: 3.5,
          fontSize: '1.4rem',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: 'monospace!important',
          '& pre': {
            fontFamily: 'monospace!important',
          },
        },
      },
    },
  },
});
