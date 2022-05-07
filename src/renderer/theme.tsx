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
      body1: {
        color: colors.grey[300],
      },
      fontFamily: ['Rubik', 'sans-serif'].join(','),
      h1: {
        fontSize: '24px',
        lineHeight: 36 / 18, // 36px
        margin: 0,
        fontWeight: 500,
      },
      h3: {
        fontSize: '18px',
        lineHeight: 28 / 18, // 28px
        margin: 0,
        fontWeight: 500,
      },
      button: {
        fontSize: '16px',
        lineHeight: '25px',
        margin: 0,
        fontWeight: 500,
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
            body1: 'p-300',
            body2: 'p-400',
          },
        },
      },
    },
  })
);

export default theme;

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'p-300': React.CSSProperties;
    'p-400': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'p-300'?: React.CSSProperties;
    'p-400'?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'p-300': true;
    'p-400': true;
  }
}
