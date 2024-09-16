import { styled } from "@mui/system";
import { Box, Grid, ListItem, ListItemProps } from "@mui/material";

export const StyledFolderBar = styled(Grid)(({}) => ({
  padding: "10px 0px",
  overflow: "hidden",
  "& .folderItem": {
    display: "block !important",
    width: "100%",
    margin: "0px !important",
    padding: "0px",
    fontSize: "13px",

    "& .folderTitle": {
      position: "relative",
      "& .iconArrow": {
        position: "absolute",
        left: "0px",
        top: "0px",
        fontSize: "8px",
        lineHeight: "12px",
        padding: "6px",
      },
      "& .titleWrap": {
        display: "block",
        width: "100%",
        padding: "5px 0px",
      },
      "& .title": {
        padding: "0px 0px 0px 7px",
      },
    },
    "& .MuiButtonBase-root": {
      padding: "0px 0px 0px 20px",
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

interface StyledFolderMenuItemProps extends ListItemProps {
  isOpen: boolean;
  isActive: boolean;
}
export const StyledFolderMenuItem = styled(ListItem, {
  shouldForwardProp: (prop: string) => !["isOpen", "isActive"].includes(prop),
})<StyledFolderMenuItemProps>(({ isOpen, isActive }) => {
  let styles = {};
  if (isActive) {
    styles = {
      ...styles,
      "&  > .MuiButtonBase-root": {
        background: "#0492f2 !important",
        color: "#fff !important",
      },
    };
  }
  if (isOpen) {
    styles = {
      ...styles,
      "& > .folderSubmenu": {
        display: "block !important",
      },
      "&  >  .MuiButtonBase-root .iconArrow": {
        transform: "rotate(90deg)",
      },
    };
  }
  return styles;
});

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
