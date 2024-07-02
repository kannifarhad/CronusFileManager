import * as React from "react";
import { createTheme } from "@mui/system";

export const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#1976d2",
      contrastText: "white",
    },
  },
});
