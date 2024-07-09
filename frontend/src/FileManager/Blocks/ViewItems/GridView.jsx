import React, { memo } from "react";
import {
  Box,

} from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import {StyledGridViewContainer} from './styled';

const GridView = () => {
  const filesList = [];
  return (
    <StyledGridViewContainer>
      <Droppable
        droppableId="mainDroppablContainer"
        type="CONTAINERITEM"
        isCombineEnabled
      >
        {(provided, snapshot) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {filesList.map((item, index) => {
                item.type === "folder" && (
                  <FolderItem key={index} index={index} item={item} />
                )
                item.type === "file" && (
                  <FileItem key={index} index={index} item={item} />
                )
              })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </StyledGridViewContainer>
  );
};

export default memo(GridView);
