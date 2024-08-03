import React from "react";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: React.CSSProperties["color"];
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: React.CSSProperties["color"];
    };
  }
}

const theme = createTheme({
  status: {
    danger: "#ff0000",
  },
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#f00",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
