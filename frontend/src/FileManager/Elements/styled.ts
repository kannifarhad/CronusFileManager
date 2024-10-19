import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  Alert,
  MenuItem,
  List,
  ListItem,
  ButtonProps,
  Popover,
} from "@mui/material";

export const StyledButtonGroupWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !["expanded"].includes(prop),
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > *": {
    margin: theme.spacing(1),
  },
}));

// Define a new interface extending MUI ButtonProps with 'isActive'
interface StyledButtonProps extends ButtonProps {}

export const StyledButton = styled(Button)<StyledButtonProps>(
  ({ style, theme, disabled }) => ({
    fontSize: "14px",
    padding: "10px 5px",
    minWidth: "35px !important",
    background: disabled
      ? theme.cronus.iconButton.background
      : theme.cronus.iconButton.backgroundEnabled,
    borderColor: theme.cronus.iconButton.borderColor,
    "& .buttonTitle": {
      fontSize: "12px",
      textTransform: "none",
      lineHeight: "11px",
      padding: "0px 5px",
    },
    ...style,
  })
);
export const StyledActionButton = styled(Button)(({}) => ({
  fontSize: "14px",
  padding: "10px 15px",
  "& .MuiButton-icon span": {
    fontSize: "14px !important",
  },
  "& .actionButtonLabel": {
    fontSize: "14px",
    textTransform: "none",
    lineHeight: "11px",
    padding: "0px 5px",
  },
}));

export const StyledFileEditFooter = styled(Box)(({}) => ({
  textAlign: "center",
  borderTop: "1px solid #E9eef9",
  overflow: "hidden",
  padding: "10px",
  background: "#fff",
}));

export const StyledPopUpDialog = styled(Dialog)(({}) => ({
  ".dialogDescription": {
    "& .list": {
      textAlign: "left",
    },
    "& img": {
      maxWidth: "100%",
      display: "block",
    },
  },
}));

export const StyledInfoBox = styled(Alert)(({}) => ({
  marginTop: "10px",
  "& .fmInfoBoxtitle": {
    fontSize: "14px",
  },
  "& .fmInfoBoxmessage": {
    fontSize: "12px",
    margin: "0",
    padding: "0",
  },
  "& .fmInfoBoxprogress": {
    width: "100%",
    marginTop: "-15px",
    marginBottom: "10px",
  },
}));

export const StyledDropZoneSection = styled("section")(({ theme }) => ({
  position: "absolute",
  zIndex: "55",
  top: "-1px",
  left: "20px",
  background: theme.cronus.dropzone.background,
  borderTop: "none",
  borderRadius: "0px 0px 5px 5px",
  padding: "20px 40px",
  width: "calc(100% - 40px)",
  boxShadow: theme.cronus.dropzone.boxShadow,
  boxSizing: "border-box",
  opacity: "0.96",
  "& .dropzone": {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 20px",
    borderWidth: "1px",
    borderRadius: "10px",
    borderStyle: "dashed",
    borderColor: theme.cronus.dropzone.droppablearea.borderColor,
    backgroundColor: theme.cronus.dropzone.droppablearea.background,
    margin: "10px 0px",
    color: theme.cronus.dropzone.droppablearea.color,
    cursor: "pointer",
    outline: "none",
    transition: "border .24s ease-in-out",
    "&:focus": {
      borderColor: "#0492f2",
    },
    "& p": {
      padding: "0px",
      margin: "0px",
    },
  },
}));

export const StyledAcceptedFilesList = styled("section")(({}) => ({
  fontSize: "12px",
  margin: "10px 0px",
  maxHeight: "200px",
  overflowY: "auto",
  overflowX: "hidden",
}));

export const StyledContextMenu = styled(Popover)(({}) => ({}));

export const StyledContextMenuItem = styled(MenuItem)(({}) => ({
  padding: "9px 10px",
  fontSize: "12px",
  lineHeight: "12px",
  minWidth: "200px",
  "& span": {
    fontSize: "12px",
    padding: "0px 10px 0px 0px",
  },
}));

export const StyledDropZoneFileList = styled(List)(({ theme }) => ({
  borderBottom: `1px solid ${theme.cronus.dropzone.borderColor}`,
  padding: "0px",
  margin: "0px",
  "& .MuiCollapse-root ul.MuiList-root": {
    borderLeft: `1px solid ${theme.cronus.dropzone.borderColor}`,
    borderBottomLeftRadius: "5px",
  },
}));
export const StyledDropZoneFileListItem = styled(ListItem)(({ theme }) => ({
  padding: "0px 9px",
  borderBottom: `1px solid ${theme.cronus.dropzone.borderColor}`,
  margin: "0px",
}));
