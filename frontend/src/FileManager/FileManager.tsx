import React, { memo } from "react";
import { FileManagerWrapper } from "./styled";
import FileManagerContainer from "./FileManagerContainer";
import PopupDialog from "./Elements/PopupDialog";
import ImageEditPopup from "./Elements/ImageEditor";
import { useFileManagerState } from "./ContextStore/FileManagerContext";

const FileManager: React.FC<{ height?: number }> = ({ height = 300 }) => {
  const { fullScreen } = useFileManagerState();

  return (
    <>
      <ImageEditPopup />
      <PopupDialog />
      <FileManagerWrapper expanded={fullScreen} height={height}>
        <FileManagerContainer />
      </FileManagerWrapper>
    </>
  );
};

export default memo(FileManager);
