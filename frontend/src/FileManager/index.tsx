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
import { customTheme } from "./theme";
import FileManager from "./FileManager";

const FileManagerWithProvider: React.FC<FileManagerProps> = forwardRef(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      refresh: () => {
        console.log("refresh requested");
      },
    }));

    return (
      // <ThemeProvider theme={customTheme}>
        <FileManagerProvider>
          <FileManager {...props} />
        </FileManagerProvider>
      // </ThemeProvider>
    );
  }
);

export default FileManagerWithProvider;
