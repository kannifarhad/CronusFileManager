import React, { memo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ViewItems from "../ViewItems/ViewItems";
import {StyledFilesListContainer, StyledFilesListWrapper} from './styled';
import OverlayBlocks from "./OverlayBlocks";
import {
  useFileManagerState,
  useFileManagerDispatch,  
} from "../../ContextStore/FileManagerContext";
const contextMenuInital = {
  mouseX: null,
  mouseY: null,
  selected: null,
};

function ContainerBar() {
  const [itemContext, itemContexSet] = useState(contextMenuInital);
  const [contentContex, contentContexSet] = useState(contextMenuInital);
  const { operations, aviableButtons }  = useFileManagerState();

  const handleAddSelected = (value) => {
    operations.handleAddSelected(value);
  };

  const handleItemContextClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    contentContexSet(contextMenuInital);
    itemContexSet({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleContentContextClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    itemContexSet(contextMenuInital);
    contentContexSet({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  return (
    <StyledFilesListWrapper>
      <StyledFilesListContainer
        onContextMenu={handleContentContextClick}
      >
      <OverlayBlocks />
        <DragDropContext onDragEnd={operations.handleDragEnd}>
          <ViewItems
            onContextMenuClick={handleItemContextClick}
            doubleClick={operations.handleSetMainFolder}
            addSelect={handleAddSelected}
          />
        </DragDropContext>
      </StyledFilesListContainer>
    </StyledFilesListWrapper>
  );
}

export default memo(ContainerBar);
