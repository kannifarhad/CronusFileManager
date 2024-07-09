import { styled } from "@mui/system";
import { Grid, Box } from "@mui/material";

export const StyledFilesBarWrapper = styled(Grid)(({ theme }) => ({
  position: "relative",
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

export const StyledFilesLoadingOverlay = styled(Box)(({ theme }) => ({
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

export const StyledToasterMessages = styled(Box)(({ theme }) => ({
    zIndex: '66',
    position:'absolute',
    top:'20px',
    right:'20px',
    width:'300px',
    float:'right'
}));

export const StyledFilesListContainer = styled(Box)(({ theme }) => ({
  padding: '10px',
  minHeight: '400px',
  position:"relative",
  paddingBottom:"60px"
}));

export const StyledFilesListWrapper = styled(Box)(({ theme }) => ({
  position:"relative",
}));