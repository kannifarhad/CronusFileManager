import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

export interface FileManagerWrapperProps extends BoxProps {
  expanded: boolean;
}
export const FileManagerWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !["expanded"].includes(prop),
})<FileManagerWrapperProps>(({ expanded, height }) => {
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
  return {
    height: `${height}px`,
    display: "flex",
    alignItems: "stretch",
    width: "100%",
  };
});
