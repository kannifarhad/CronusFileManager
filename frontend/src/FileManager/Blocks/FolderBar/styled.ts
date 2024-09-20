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
      },
      "& .titleWrap": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: "5px 0px",
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

export const FileManagerFolderBarGrid = styled(Grid)(({}) => ({
  flex: 1,
  overflow: "auto",
  height: "100%",
  background: "#f9fafc",
  borderRight: "1px solid #E9eef9",
  "& .FileManagerFolderBarWrapper": {},
}));

// interface FileManagerFolderBarWrapperProps extends BoxProps {
//   height?: number;
//   expanded?: boolean;
// }
// export const FileManagerFolderBarWrapper = styled(Box, {
//   shouldForwardProp: (prop: string) => !["maxHeight"].includes(prop),
// })<FileManagerFolderBarWrapperProps>(({ height, expanded }) => {
//   const heightInPx =
//     height !== undefined && height > 300 ? `${height}px` : "300px";
//   const bigHeight = `${window.innerHeight - 100}px`;
//   const maxHeight = expanded ? bigHeight : heightInPx;
//   return {
//     maxHeight,
//   };
// });
export const FileManagerFolderBarWrapper = styled(Box)(() => ({}));
