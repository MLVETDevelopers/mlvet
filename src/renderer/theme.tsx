// Must use createTheme from '@mui/material/styles' and not '@mui/system'
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import '@fontsource/rubik/';
import colors from './colors';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        light: colors.yellow[500],
        main: colors.yellow[500],
        dark: colors.yellow[600],
        contrastText: colors.grey[900],
      },
      secondary: {
        light: colors.yellow[500],
        main: colors.grey[600],
        dark: colors.grey[550],
        contrastText: colors.yellow[500],
      },
    },
    typography: {
      fontFamily: ['Rubik', 'sans-serif'].join(','),
      'h-100': {
        fontSize: '24px',
        lineHeight: '36px',
        margin: 0,
        fontWeight: 500,
      },
      'h-300': {
        fontSize: '18px',
        lineHeight: '28px',
        margin: 0,
        fontWeight: 500,
      },
      button: {
        fontSize: '16px',
        lineHeight: '25px',
        margin: 0,
        fontWeight: 500,
        textTransform: 'none',
      },
      'p-300': {
        fontSize: '18px',
        lineHeight: '25px',
        margin: 0,
        fontWeight: 400,
      },
      'p-400': {
        fontSize: '15px',
        lineHeight: '25px',
        margin: 0,
        fontWeight: 400,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@font-face': {
            fontFamily: 'Rubik',
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h-100',
            h3: 'h-300',
            body1: 'p-300',
            body2: 'p-400',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
      },

      // Text field styling
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.grey[500],
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '::before': { borderColor: colors.grey[500] },
            ':hover:not(.Mui-disabled):before': {
              borderBottom: `${colors.grey[500]} 2px solid`,
            },
            color: colors.grey[300],
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'standard',
        },
      },
    },
  })
);

export default theme;

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'h-100': React.CSSProperties;
    'h-300': React.CSSProperties;
    'p-300': React.CSSProperties;
    'p-400': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'h-100'?: React.CSSProperties;
    'h-300'?: React.CSSProperties;
    'p-300'?: React.CSSProperties;
    'p-400'?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'h-100': true;
    'h-300': true;
    'p-300': true;
    'p-400': true;
  }
}
