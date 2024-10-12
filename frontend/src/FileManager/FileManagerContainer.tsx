import React, { memo } from "react";
import { Paper, Grid } from "@mui/material";
import TopBar from "./Blocks/TopBar";
import FolderBar from "./Blocks/FolderBar";
import FilesBar from "./Blocks/FilesBar";

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
