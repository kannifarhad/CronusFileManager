import React, {
  memo,
} from "react";
import { FileManagerProps } from "./types";
import { FileManagerWrapper } from "./styled";
import FileManagerContainer from "./FileManagerContainer";
import PopupDialog from "./Elements/PopupDialog";

const FileManager: React.FC<FileManagerProps> = ({ height, callback }) => {
  const expanded = false;

  return (
    <FileManagerWrapper expanded={expanded}>
      <PopupDialog />
      <FileManagerContainer />
    </FileManagerWrapper>
  );
};

export default memo(FileManager);
