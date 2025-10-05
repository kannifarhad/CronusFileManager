import { memo, type FC, type MouseEvent } from "react";
import { Box, Button, Collapse } from "@mui/material";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ItemMoveActionTypeEnum } from "../../types";

const StatusBar: FC = () => {
  const {
    operations: { handleClearBuffer },
    bufferedItems,
    selectedFiles,
  } = useFileManagerState();
  const selectIsActive = selectedFiles.size > 0 || bufferedItems.files.size > 0;

  return (
    <Collapse in={selectIsActive}>
      <Box className="infoMessages">
        {selectedFiles.size > 0 && (
          <Box className="text">
            <b>{selectedFiles.size}</b> items are selected
          </Box>
        )}
        {bufferedItems.files.size > 0 && (
          <Box className="text">
            <b>{bufferedItems.files.size}</b>
            {bufferedItems.type === ItemMoveActionTypeEnum.CUT ? "cut" : "copied"} items in buffer (
            <Button
              href="#"
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleClearBuffer();
              }}
            >
              Clear
            </Button>
            )
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default memo(StatusBar);
