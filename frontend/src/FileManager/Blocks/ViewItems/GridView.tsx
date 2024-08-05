import React, { memo, useCallback } from "react";
import { Box } from "@mui/material";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import { StyledGridViewContainer, StyledEmptyFolderContainer } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { Items, ItemType } from "../../types";

const GridView: React.FC = () => {
  const { filesList } = useFileManagerState();

  const GetGridItem = useCallback((item: Items, index: number) => {
    if (item.type === ItemType.FOLDER)
      return <FolderItem key={item.id} index={index} item={item} />;
    if (item.type === ItemType.FILE)
      return <FileItem key={item.id} index={index} item={item} />;
    return null;
  }, []);

  if (filesList.length === 0) {
    return (
      <StyledEmptyFolderContainer>
        <h6>The folder is empty!</h6>
      </StyledEmptyFolderContainer>
    );
  }

  return (
    <StyledGridViewContainer>
      <Droppable
        droppableId="mainDroppableContainer"
        type="CONTAINERITEM"
        isCombineEnabled
      >
        {(provided: DroppableProvided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {filesList.map((item: Items, index: number) =>
              GetGridItem(item, index),
            )}
          </Box>
        )}
      </Droppable>
    </StyledGridViewContainer>
  );
};

export default memo(GridView);
