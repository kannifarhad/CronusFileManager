import React, { memo } from "react";
import { ThemeProvider } from "@mui/system";
import { FileManagerWrapper } from "./styled";
import FileManagerContainer from "./FileManagerContainer";
import PopupDialog from "./Elements/PopupDialog";
import ImageEditPopup from "./Elements/ImageEditor";
import { useFileManagerState } from "./ContextStore/FileManagerContext";
import useCurrentTheme from "./Hooks/useCurrentTheme";

const FileManager: React.FC<{ height: number }> = ({ height }) => {
  const { fullScreen } = useFileManagerState();
  const theme = useCurrentTheme();
  return (
    <ThemeProvider theme={theme}>
      <ImageEditPopup />
      <PopupDialog />
      <FileManagerWrapper expanded={fullScreen} height={height}>
        <FileManagerContainer />
      </FileManagerWrapper>
    </ThemeProvider>
  );
};

export default memo(FileManager);
