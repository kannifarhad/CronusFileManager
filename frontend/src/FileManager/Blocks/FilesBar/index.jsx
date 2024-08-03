import { memo } from "react";
import { Box } from "@mui/material";
import { StyledFilesBarWrapper } from "./styled";
import StatusBar from "./StatusBar";
import FilesListContainer from "./FilesListContainer";

function FileBarWrapper() {
  return (
    <StyledFilesBarWrapper item xs={9} sm={10}>
      {/* <PerfectScrollbar> */}
      {/* <Box style={{ maxHeight: expand ? bigHeight : height }}> */}
      <Box>
        <FilesListContainer />
      </Box>
      {/* </PerfectScrollbar> */}
      <StatusBar />
    </StyledFilesBarWrapper>
  );
}

export default memo(FileBarWrapper);
