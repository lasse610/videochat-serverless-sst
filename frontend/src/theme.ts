import { createTheme } from '@mui/material';

/** 
declare module '@mui/material/styles' {
    interface Theme {

    }
    // allow configuration using `createTheme`
    interface DeprecatedThemeOptions {

  }
*/

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2D6FF3',
      light: '#52b7f8',
      dark: '#0c1c4a',
    },
    secondary: {
      main: '#1f1f21',
      dark: '#000000',
      light: '#8b8f97',
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: ['Poppins'].join(','),
  },
});

export default theme;
