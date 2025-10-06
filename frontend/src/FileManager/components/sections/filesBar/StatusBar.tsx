import { memo, type FC, type MouseEvent } from "react";
import { Box, Button, Collapse } from "@mui/material";
import { useFileManagerState } from "../../../store/FileManagerContext";
import { ItemMoveActionTypeEnum } from "../../../types";

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
          <Box className="text" sx={{ height: "20px" }}>
            <b>{selectedFiles.size} </b> item{selectedFiles.size > 1 ? "s are" : " is"} selected
          </Box>
        )}
        {bufferedItems.files.size > 0 && (
          <Box className="text">
            <b>{bufferedItems.files.size}</b>
            {bufferedItems.type === ItemMoveActionTypeEnum.CUT ? " cut" : " copied"} item
            {selectedFiles.size > 1 ? "s are" : " is"} in buffer
            <Button
              href="#"
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleClearBuffer();
              }}
              size="small"
              color="error"
              variant="outlined"
              sx={{ padding: "3px 10px", marginLeft: "15px", textTransform: "none", lineHeight: "1.2" }}
            >
              Clear Buffer
            </Button>
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default memo(StatusBar);
