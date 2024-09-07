import { styled } from "@mui/system";
import { Grid, Box } from "@mui/material";

export const StyledFilesBarWrapper = styled(Grid)(({}) => ({
  position: "relative",
  // overflow: "auto",
  flex: 1,
  height: "100%",
  "& .infoMessages": {
    position: "absolute",
    width: "100%",
    bottom: "0",
    left: "0",
    padding: "10px 20px",
    fontSize: "13px",
    background: "#fff",
    textAlign: "center",
    borderTop: "1px solid #E9eef9",
  },
}));

export const StyledFilesLoadingOverlay = styled(Box)(({}) => ({
  position: "absolute",
  zIndex: "55",
  top: "0px",
  left: "0px",
  width: "100%",
  height: "100%",
  "& .opaOverlaw": {
    opacity: "0.8",
    background: "#fff",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
}));

export const StyledToasterMessages = styled(Box)(({}) => ({
  zIndex: "66",
  position: "absolute",
  top: "20px",
  right: "20px",
  width: "300px",
  float: "right",
}));

export const StyledFilesListContainer = styled(Box)(({}) => ({
  position: "relative",
  overflowY: "hidden",
  height: "100%",
  width: "100%",
}));

export const StyledFilesListWrapper = styled(Box)(({}) => ({
  position: "relative",
  height: "100%",
}));
