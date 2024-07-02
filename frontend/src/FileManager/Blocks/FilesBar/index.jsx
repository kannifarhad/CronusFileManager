import { memo } from "react";
import { Box } from  "@mui/material";
import { StyledFilesBarWrapper } from "./styled";
import StatusBar from "./StatusBar";

function FileBarWrapper({ buttons, operations }) {
  return (
    <StyledFilesBarWrapper item xs={9} sm={10}>
      {/* <PerfectScrollbar> */}
      {/* <Box style={{ maxHeight: expand ? bigHeight : height }}> */}
      <Box>
        <FilesListContainer buttons={buttons} operations={operations} />
      </Box>
      {/* </PerfectScrollbar> */}
      <StatusBar />
    </StyledFilesBarWrapper>
  );
}

export default memo(FileBarWrapper);
