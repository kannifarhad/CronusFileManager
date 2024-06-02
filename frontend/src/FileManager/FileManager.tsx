import React, {
  useState,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FileManagerProps } from "./types";
import { Box, Paper, Grid, Collapse } from "@mui/material";
import {
  useFileManagerState,
  useFileManagerDispatch,
  FileManagerProvider,
  ActionTypes,
} from "./FileManagerContext";
import { getFoldersList } from "./Api/fileManagerServices";
import { ThemeProvider } from "@mui/system";
import { FileManagerWrapper } from "./styled";

const FileManager: React.FC<FileManagerProps> = ({ height, callback }) => {
  const dispatch = useFileManagerDispatch();

  useEffect(() => {
    // getFoldersList({ path: "/" }).then((result) => {
    //   dispatch({
    //     type: ActionTypes.SET_SELECTED_FOLDER,
    //     payload: result.data.path,
    //   });
    // });
  }, []);
  return (
    <FileManagerWrapper expanded={false}>
      <Paper> FILE MANANGER</Paper>
    </FileManagerWrapper>
  );
};

export default memo(FileManager);
