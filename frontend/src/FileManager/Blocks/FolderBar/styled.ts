import { styled } from "@mui/system";
import { Box, ListItem, ListItemProps } from "@mui/material";

export const StyledFolderBar = styled(Box)(({ theme }) => ({
  padding: "10px 0px",
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
        fontSize: "10px",
        lineHeight: "17px",
        padding: "6px 5px",
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
})<StyledFolderMenuItemProps>(({ theme, isOpen, isActive }) => {
  if (isActive) {
    return {
      "& > .MuiButtonBase-root": {
        background: "#0492f2",
        color: "#fff",
      },
    };
  }
  if (isOpen) {
    return {
      "& > .folderSubmenu": {
        display: "block",
      },
      "& > .MuiButtonBase-root .iconArrow": {
        transform: "rotate(90deg)",
      },
    };
  }
  return {};
});
