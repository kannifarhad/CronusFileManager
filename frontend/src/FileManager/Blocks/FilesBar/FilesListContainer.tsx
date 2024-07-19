import React, { memo, useCallback, MouseEvent } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ViewItems from "../ViewItems/ViewItems";
import { StyledFilesListContainer, StyledFilesListWrapper } from './styled';
import OverlayBlocks from "./OverlayBlocks";
import {
  useFileManagerState,
} from "../../ContextStore/FileManagerContext";
import { ContextMenuTypeENum } from "../../types";

const ContainerBar: React.FC = () => {
  const { operations: { handleContextClick, handleDragEnd } } = useFileManagerState();

  const handleContextMenuClick = useCallback((event: MouseEvent) => {
    handleContextClick({ item: null, event, menuType: ContextMenuTypeENum.CONTENT});
  }, [handleContextClick]);


  return (
    <StyledFilesListWrapper>
      <StyledFilesListContainer
        onContextMenu={handleContextMenuClick}
      >
        <OverlayBlocks />
        <DragDropContext onDragEnd={(result: DropResult) => handleDragEnd(result)}>
          <ViewItems />
        </DragDropContext>
      </StyledFilesListContainer>
    </StyledFilesListWrapper>
  );
}

export default memo(ContainerBar);
