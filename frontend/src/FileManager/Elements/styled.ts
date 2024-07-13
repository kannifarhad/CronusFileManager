import {
  styled
} from "@mui/system";
import {
  Box,
  Button,
  Dialog,
  Alert,
  Menu,
  MenuItem
} from "@mui/material";

export const StyledButtonGroupWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !["expanded"].includes(prop),
})(({
  theme
}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > *": {
    margin: theme.spacing(1),
  },
}));

export const StyledButton = styled(Button)(({
  theme
}) => ({
  fontSize: "14px",
  padding: "10px 5px",
  minWidth: "35px",
  background: "#fff",
  "& span": {},
  "& .buttonTitle": {
    fontSize: "12px",
    textTransform: "none",
    lineHeight: "11px",
    padding: "0px 5px",
  },
}));

export const StyledPopUpDialog = styled(Dialog)(({
  theme
}) => ({
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

export const StyledInfoBox = styled(Alert)(({
  theme
}) => ({
  ".dialogDescription": {
    margin: '0px 0px 10px 0px',

    '& .fmInfoBoxtitle': {
      fontSize: '14px'
    },
    '& .fmInfoBoxmessage': {
      fontSize: '12px',
      margin: '0',
      padding: '0',
    },
    '& .fmInfoBoxprogress': {
      width: '100%',
      marginTop: '-15px',
      marginBottom: '10px'
    },
  },
}));

export const StyledDropZoneSection = styled('section')(({
  theme
}) => ({
  position: 'absolute',
  zIndex: '55',
  top: '-1px',
  background: '#f6f7fd',
  border: '1px solid #868DAA',
  borderTop: 'none',
  borderRadius: '0px 0px 5px 5px',
  padding: '20px 40px',
  margin: '0px 0px 0px 50px',
  '& .dropzone': {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderStyle: "dashed",
    backgroundColor: "#fff",
    margin: '10px 0px',
    color: "#bdbdbd",
    cursor: "pointer",
    outline: "none",
    transition: "border .24s ease-in-out",
    '&:focus': {
      borderColor: '#0492f2'
    },
    '& p': {
      padding: '0px',
      margin: '0px',
    }
  }
}));

export const StyledAcceptedFilesList = styled('section')(({
  theme
}) => ({
  fontSize: '12px',
  padding: '0px',
  margin: '0px',
}));

export const StyledContextMenu = styled(Menu)(({
  theme
}) => ({

}));

export const StyledContextMenuItem = styled(MenuItem)(({
  theme
}) => ({
  padding:'9px 10px',
  fontSize:'12px',
  lineHeight: '12px',
  minWidth:'200px',
  '& span':{
    fontSize:'12px',
    padding:'0px 10px 0px 0px'
  }
}));