// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensures the body takes the full height of the viewport
      },
      "#root": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      },
    },
  },
});

export default theme;
