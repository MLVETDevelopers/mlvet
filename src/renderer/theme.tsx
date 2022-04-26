// Must use createTheme from '@mui/material/styles' and not '@mui/system'
import { createTheme } from '@mui/material/styles';
import colors from './colors';

const theme = createTheme({
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
    'h-100': {
      fontSize: '24px',
      lineHeight: '36px',
      margin: 0,
    },
    'h-300': {
      fontSize: '18px',
      lineHeight: '28px',
      margin: 0,
    },
    button: {
      fontSize: '16px',
      lineHeight: '25px',
      margin: 0,
    },
    'p-300': {
      fontSize: '18px',
      lineHeight: '25px',
      margin: 0,
    },
    'p-400': {
      fontSize: '15px',
      lineHeight: '25px',
      margin: 0,
    },
  },
  components: {
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
  },
});

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

// Update the Typography's variant prop options
// declare module '@mui/material/Typography' {
//   interface TypographyPropsVariantOverrides {
//     'h-100': true;
//     'h-300': true;
//     button: true;
//     'p-300': true;
//     'p-400': true;
//     body1: true;
//     body: true;
//     body2: true;
//   }
// }
