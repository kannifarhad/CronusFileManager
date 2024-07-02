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
import { getFoldersList } from "./Api/fileManagerServices";
import { ThemeProvider } from "@mui/system";
import {
  FileManagerWrapper,
  FileManagerFolderBarGrid,
  FileManagerFolderBarWrapper,
} from "./styled";
import useGenerateActionButtons from "./Hooks/useGenerateActionButtons";
import TopBar from "./Blocks/TopBar";
import FolderBar from "./Blocks/FolderBar";
import FilesBar from "./Blocks/FilesBar";

const FileManager: React.FC<FileManagerProps> = ({ height, callback }) => {
  const dispatch = useFileManagerDispatch();
  const { aviableButtons, operations } = useGenerateActionButtons({});

  return (
    <Paper>
      <TopBar buttons={aviableButtons.topbar} />
      <Grid container>
        <FileManagerFolderBarGrid item xs={3} sm={2}>
          <FileManagerFolderBarWrapper>
            <FolderBar
              foldersList={{ name: "ROOT", children: null, path: "/" }}
              onFolderClick={operations.handleSetMainFolder}
              selectedFolder={"/"}
            />
            <FilesBar buttons={aviableButtons} operations={operations} />
          </FileManagerFolderBarWrapper>
        </FileManagerFolderBarGrid>
      </Grid>
    </Paper>
  );
};

export default memo(FileManager);
