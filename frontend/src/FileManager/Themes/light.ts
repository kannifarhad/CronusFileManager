import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  status: {
    danger: "#ff0000",
  },
  cronus: {
    iconButton: {
      background: "#fff",
      disabledColor: "#ccc",
      activeColor: "#556cd6",
      borderColor: "#0492f2",
      borderActiveColor: "#a3a3a3",
    },
    topBar: {
      background: "#f6f7fd",
      borderColor: "#868DAA",
    },
    folderBar: {
      background: "#f6f7fd",
      borderColor: "#E9eef9",
      iconColor: "#cccc",
      activeFolderBackground: "#30ccff57",
      volumeIconBack: "#556cd6",
      volumeActiveBackColor: "#fff",
    },
    fileItems: {
      background: {
        hover: "#f7f7f7",
        selected: "#e0f0fb",
        selectMode: "#f7f7f7",
      },
      title: {
        color: "",
      },
      extension: {
        background: "#ccc",
        color: "#fff",
      },
      cuted: "",
    },
  },
  palette: {
    mode: "light",
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
