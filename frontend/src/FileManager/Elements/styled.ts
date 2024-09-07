import { styled } from "@mui/system";
import { Box, Button, Dialog, Alert, Menu, MenuItem } from "@mui/material";

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

export const StyledButton = styled(Button)(({}) => ({
  fontSize: "14px",
  padding: "10px 5px",
  minWidth: "35px !important",
  background: "#fff",
  "& .buttonTitle": {
    fontSize: "12px",
    textTransform: "none",
    lineHeight: "11px",
    padding: "0px 5px",
  },
}));
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

export const StyledDropZoneSection = styled("section")(({}) => ({
  position: "absolute",
  zIndex: "55",
  top: "-1px",
  left: "20px",
  background: "#f9fafc",
  borderTop: "none",
  borderRadius: "0px 0px 5px 5px",
  padding: "20px 40px",
  width: "calc(100% - 40px)",
  boxShadow: "0px 2px 4px #bababa",
  boxSizing: "border-box",
  opacity: "0.96",
  "& .dropzone": {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderStyle: "dashed",
    backgroundColor: "#fff",
    margin: "10px 0px",
    color: "#bdbdbd",
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
  padding: "10px 0px",
  margin: "0px",
}));

export const StyledContextMenu = styled(Menu)(({}) => ({}));

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
