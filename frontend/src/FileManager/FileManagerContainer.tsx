import React, { memo } from "react";
import { Paper, Grid } from "@mui/material";
import TopBar from "./components/sections/topBar";
import FolderBar from "./components/sections/folderBar";
import FilesBar from "./components/sections/filesBar";

const FileManager: React.FC<{}> = () => (
  <Paper
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: "100%",
    }}
  >
    <TopBar />
    <Grid
      container
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        minHeight: 0,
      }}
      columns={20}
    >
      <FolderBar />
      <FilesBar />
    </Grid>
  </Paper>
);

export default memo(FileManager);
