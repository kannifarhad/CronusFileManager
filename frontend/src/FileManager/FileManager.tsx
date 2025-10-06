import React, { memo } from "react";
import { ThemeProvider } from "@mui/system";
import { FileManagerWrapper } from "./styled";
import FileManagerContainer from "./FileManagerContainer";
import PopupDialog from "./components/elements/PopupDialog";
import ImageEditPopup from "./components/elements/ImageEditor";
import { useFileManagerState } from "./store/FileManagerContext";
import useCurrentTheme from "./utils/hooks/useCurrentTheme";

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
