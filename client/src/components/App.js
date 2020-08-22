import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Topic from './pages/Topic';
import Deck from './pages/Deck';
import Upload from './pages/Upload';
import { ThemeProvider } from '../ThemeContext';
import { ThemeProvider as ChakraTheme, theme } from "@chakra-ui/core";
import { useSetting } from '../hooks'

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
}

function App() {
  const { activeTheme } = useSetting()
  return (
    <ChakraTheme theme={customTheme}>
    <ThemeProvider value={{ theme: activeTheme }}>
      <Router>
        <Route path="/deck-preview/:sectionId?/:cardId?" exact component={Deck} />
        <Route path="/decks/:deckId/:sectionId?/:cardId?" component={Deck} />
        <Route path="/upload" component={Upload} />
      </Router>
    </ThemeProvider>
    </ChakraTheme>
  );
}
export default App;
