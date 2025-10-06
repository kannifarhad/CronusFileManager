import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  status: {
    danger: "#ff0000",
  },
  cronus: {
    iconButton: {
      background: "#767676",
      backgroundEnabled: "#929292",
      disabledColor: "#ccc",
      activeColor: "#00ffef",
      borderColor: "#9c9c9c",
      borderActiveColor: "#a3a3a3",
    },
    topBar: {
      background: "#5c5c5c",
      borderColor: "#9c9c9c",
    },
    folderBar: {
      background: "#3d3d3d",
      borderColor: "#9c9c9c",
      iconColor: "#cccc",
      activeFolderBackground: "#30ccff57",
      volumeIconBack: "#00c2ff",
      volumeActiveBackColor: "#656161",
    },
    fileItems: {
      background: {
        hover: "#625f5f8f",
        selected: "#30ccff57",
        selectMode: "#4c4c4c8f",
      },
      title: {
        color: "",
      },
      extension: {
        background: "#706d6dbd",
        color: "#fff",
      },
      cuted: "",
    },
    dropzone: {
      background: "#414141",
      droppablearea: {
        background: "#2b2b2b",
        color: "#00ffef",
        borderColor: "#00ffef",
      },
      boxShadow: "0px 2px 4px #191919",
      borderColor: "#7e7e7e",
      text: {
        mainColor: "",
        secondaryColor: "",
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#0492f2",
      light: "#36a7f4",
      dark: "#0266a9",
      contrastText: "#f00",
    },
    secondary: {
      light: "#ffbb33",
      main: "#ffab00",
      dark: "#b27700",
      contrastText: "#000",
    },
    error: {
      main: "#f00",
    },
    background: {
      default: "#2d2d2d",
      paper: "#1e1e1e",
    },
  },
});

export default theme;
