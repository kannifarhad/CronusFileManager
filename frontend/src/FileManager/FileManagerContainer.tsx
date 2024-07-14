import React, {
  memo,
} from "react";
import { FileManagerProps } from "./types";
import { Paper, Grid } from "@mui/material";
import TopBar from "./Blocks/TopBar";
import FolderBar from "./Blocks/FolderBar";
import FilesBar from "./Blocks/FilesBar";

const FileManager: React.FC<FileManagerProps> = ({ height, callback }) => {
  // console.log('rerender');
  return (
    <Paper>
      <TopBar />
      <Grid container>
        <FolderBar/>
        <FilesBar />
      </Grid>
    </Paper>
  );
};

export default memo(FileManager);
