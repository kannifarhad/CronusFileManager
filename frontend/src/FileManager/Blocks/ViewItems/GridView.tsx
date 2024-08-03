import React, { memo } from "react";
import { Box } from "@mui/material";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import { StyledGridViewContainer, StyledEmptyFolderContainer } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { Items, ItemType } from "../../types";

const GridView: React.FC = () => {
  const { filesList } = useFileManagerState();
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
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {filesList.map((item: Items, index: number) =>
              item.type === ItemType.FOLDER ? (
                <FolderItem key={item.id} index={index} item={item} />
              ) : item.type === ItemType.FILE ? (
                <FileItem key={item.id} index={index} item={item} />
              ) : null,
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </StyledGridViewContainer>
  );
};

export default memo(GridView);
