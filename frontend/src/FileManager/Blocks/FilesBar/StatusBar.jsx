import { memo } from "react";
import { Box, Collapse } from  "@mui/material";

function StatusBar() {
  const selectMessages = false;
  const selectedFiles = [];
  const bufferedItems = {files:[]};

  const clearBufferFiles = () => {};
  return (
    <Collapse in={selectMessages}>
      <Box className="infoMessages">
        {selectedFiles.length > 0 && (
          <Box className="text">
            <b>{selectedFiles.length}</b> items are selected
          </Box>
        )}
        {bufferedItems.files.length > 0 && (
          <Box className="text">
            <b>{bufferedItems.files.length}</b>{" "}
            {bufferedItems.type === "cut" ? "cuted" : "copied"} items in buffer
            (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                clearBufferFiles();
              }}
            >
              Clear
            </a>
            )
          </Box>
        )}
      </Box>
    </Collapse>
  );
}

export default memo(StatusBar);
