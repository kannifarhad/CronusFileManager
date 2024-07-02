import React, {
  useState,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { FileManagerProps } from "./types";
import { Box, Paper, Grid, Collapse } from "@mui/material";
import {
  useFileManagerState,
  useFileManagerDispatch,
  FileManagerProvider,
  ActionTypes,
} from "./FileManagerContext";
import { FileManagerWrapper } from "./styled";
import useGenerateActionButtons from "./Hooks/useGenerateActionButtons";
import FileManagerContainer from "./FileManagerContainer";
import PopupDialog from "./Elements/PopupDialog";

const FileManager: React.FC<FileManagerProps> = ({ height, callback }) => {
  const dispatch = useFileManagerDispatch();
  const { aviableButtons, operations } = useGenerateActionButtons({});
  const expanded = false;
  const [popupData, setPopup] = useState({
    open: false,
});


  useEffect(() => {
    // getFoldersList({ path: "/" }).then((result) => {
    //   dispatch({
    //     type: ActionTypes.SET_SELECTED_FOLDER,
    //     payload: result.data.path,
    //   });
    // });
  }, []);

  return (
    <FileManagerWrapper expanded={expanded}>
      <PopupDialog {...popupData} />

      <FileManagerContainer />
    </FileManagerWrapper>
  );
};

export default memo(FileManager);
