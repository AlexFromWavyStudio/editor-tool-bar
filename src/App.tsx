import './App.css';

import { Center, ChakraProvider, extendTheme } from '@chakra-ui/react';

import Footer from './components/footer';

const theme = extendTheme({
  colors: {
    custom: {
      primary: "white",
      secondary: "#EDF2F7",
      onHoverColor: "#5a4cdb",
      onFocusColor: "#00FF00",
      lastMarkerColor: "red",
      markerColor: "#A9A9A9",
      lightBlue: "#8EC9DC",
    },
  },
});
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Center h="100vh">
        <Footer />
      </Center>
    </ChakraProvider>
  );
}

export default App;
