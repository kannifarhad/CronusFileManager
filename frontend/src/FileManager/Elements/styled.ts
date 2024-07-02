import * as React from "react";
import { styled } from "@mui/system";
import { Box, Button, Dialog } from "@mui/material";

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

export const StyledButton = styled(Button)(({ theme }) => ({
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

export const StyledPopUpDialog = styled(Dialog)(({ theme }) => ({
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
