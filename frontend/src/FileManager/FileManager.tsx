import React, {
  useState,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { FileManagerProps } from "./types";
import { FileManagerWrapper } from "./styled";
import FileManagerContainer from "./FileManagerContainer";
import PopupDialog from "./Elements/PopupDialog";

const FileManager: React.FC<FileManagerProps> = ({ height, callback }) => {
  const expanded = false;
  const [popupData, setPopup] = useState({
    open: false,
});

  return (
    <FileManagerWrapper expanded={expanded}>
      <PopupDialog {...popupData} />
      <FileManagerContainer />
    </FileManagerWrapper>
  );
};

export default memo(FileManager);
