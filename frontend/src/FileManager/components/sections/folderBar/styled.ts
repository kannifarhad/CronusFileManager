import { styled } from "@mui/material/styles";
import { Box, Grid, ListItem } from "@mui/material";

export const StyledFolderBar = styled(Grid)(({ theme }) => ({
  overflow: "hidden",
  "& .folderItem": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0px !important",
    padding: "0px 5px",
    fontSize: "13px",
    alignItems: "flex-start",
    "&.isActive > .folderTitle": {
      background: theme.cronus.folderBar.activeFolderBackground,
    },
    "& .folderTitle": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      borderRadius: "5px",
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
    "& > .folderTitle .iconArrow": {
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

export const StyledVolumeMenuItem = styled(ListItem)(({ theme }) => ({
  "&.isActive": {
    background: theme.cronus.folderBar.volumeActiveBackColor,
  },
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
        fill: theme.cronus.folderBar.volumeIconBack,
      },
    },
  },
  "& .volumeFolderTreeWrapper": {
    padding: "0px",
    width: "100%",
    marginBottom: "5px",
  },
  width: "100%",
  padding: "0px",
  flexDirection: "column",
  alignItems: "flex-start",
  borderBottom: `1px solid ${theme.cronus.folderBar.volumeActiveBackColor}`,
  background: theme.cronus.folderBar.background,
  borderBottomLeftRadius: "5px",
  borderBottomRightRadius: "5px",
}));

export const FileManagerFolderBarGrid = styled(Grid)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  height: "100%",
  background: theme.cronus.folderBar.background,
  borderRight: `1px solid ${theme.cronus.folderBar.borderColor}`,
  "& .FileManagerFolderBarWrapper": {},
}));

export const FileManagerFolderBarWrapper = styled(Box)(() => ({}));
