import { styled } from "@mui/system";
import { Box, BoxProps, } from "@mui/material";
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
