import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      100: '#E3FDFD',
      200: '#CBF1F5',
      300: '#A6E3E9',
      400: '#71C9CE',
      500: '#3DA5B9',
    },
  },
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, serif",
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
});

export default theme;