import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  status: {
    danger: "#ff0000",
  },
  cronus: {
    iconButton: {
      background: "#fff",
      backgroundEnabled: "#fff",
      disabledColor: "#ccc",
      activeColor: "#556cd6",
      borderColor: "#bcc7fd",
      borderActiveColor: "#ccc",
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
    dropzone: {
      background: "#f9fafc",
      droppablearea: {
        background: "#fff",
        color: "#bdbdbd",
        borderColor: "#ccc",
      },
      boxShadow: "0px 2px 4px #bababa",
      borderColor: "#ccc",
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
