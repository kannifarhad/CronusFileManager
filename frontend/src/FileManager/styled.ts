import * as React from "react";
import { styled } from "@mui/system";
import { Box, BoxProps, Grid, GridProps } from "@mui/material";
interface FileManagerWrapperProps extends BoxProps {
  expanded: boolean;
}
export const FileManagerWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !["expanded"].includes(prop),
})<FileManagerWrapperProps>(({ theme, expanded }) => {
  if (expanded) {
    return {
      position: "fixed",
      top: "0",
      left: "0",
      height: "100%",
      width: "100%",
      zIndex: "999",
      padding: "20px",
      background: "rgba(255, 255, 255, 0.7)",
    };
  }
  return {};
});

export const FileManagerFolderBarGrid = styled(Grid)(({ theme }) => {
  return {
    flexGrow: 1,
    background: "#f9fafc",
    borderRight: "1px solid #E9eef9",
    "& .FileManagerFolderBarWrapper": {},
  };
});

interface FileManagerFolderBarWrapperProps extends BoxProps {
  height?: number;
  expanded?: boolean;
}
export const FileManagerFolderBarWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !["maxHeight"].includes(prop),
})<FileManagerFolderBarWrapperProps>(({ height, expanded }) => {
  const heightInPx =
    height !== undefined && height > 300 ? `${height}px` : "300px";
  const bigHeight = `${window.innerHeight - 100}px`;
  const maxHeight = expanded ? bigHeight : heightInPx;
  return {
    // maxHeight,
    
  };
});
