import { styled } from "@mui/system";
import { Box, Grid, ListItem } from "@mui/material";

export const StyledFolderBar = styled(Grid)(({}) => ({
  padding: "10px 0px",
  overflow: "hidden",
  "& .folderItem": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0px !important",
    padding: "0px 5px",
    fontSize: "13px",

    "& .folderTitle": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& .iconArrow": {
        padding: "5px",
        opacity: 0,
        cursor: "pointer",
      },
      "& .titleWrap": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: "5px 0px",
        cursor: "pointer",
      },
      "& .title": {
        padding: "0px 0px 0px 7px",
      },
    },
    "& .MuiButtonBase-root": {
      padding: "0px",
      borderRadius: "3px",
    },
    "& .folderSubmenu": {
      display: "none",
      width: "100%",
      padding: "0px 0px 0px 10px !important",
      margin: "0px !important",
    },
  },
}));

export const StyledFolderMenuItem = styled(ListItem)(({}) => ({
  "&.hasChildren": {
    "& >.folderTitle .iconArrow": {
      opacity: "1 !important",
    },
  },
  "&.isOpen": {
    "& > .folderSubmenu": {
      display: "block",
    },
    "& > .MuiButtonBase-root .iconArrow": {
      transform: "rotate(90deg)",
    },
  },
  "&.isActive": {
    "& > .MuiButtonBase-root": {
      background: "#0492f2",
      color: "#fff",
      "&:hover": {
        background: "#0277bd",
      },
    },
  },
}));

export const StyledVolumeMenuItem = styled(ListItem)(({}) => ({
  "& .volumeTitleWrapper": {
    display: "flex",
    cursor: "pointer",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "13px",
    padding: "5px",
    fontWeight: 500,
    width: "100%",
    "& svg": {
      marginRight: "5px",
      height: "20px",
      g: {
        fill: "#556cd6",
      },
    },
  },
  "& .volumeFolderTreeWrapper": {
    width: "100%",
    marginBottom: "5px",
  },
  padding: "0px",
  flexDirection: "column",
  alignItems: "flex-start",
  borderBottom: "1px solid #eaeaea",
}));

export const FileManagerFolderBarGrid = styled(Grid)(({}) => ({
  flex: 1,
  overflow: "auto",
  height: "100%",
  background: "#f9fafc",
  borderRight: "1px solid #E9eef9",
  "& .FileManagerFolderBarWrapper": {},
}));

export const FileManagerFolderBarWrapper = styled(Box)(() => ({}));
