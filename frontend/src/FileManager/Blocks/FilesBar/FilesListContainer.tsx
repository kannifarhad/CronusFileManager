import React, { memo, useCallback, MouseEvent } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ViewItems from "../ViewItems/ViewItems";
import { StyledFilesListContainer, StyledFilesListWrapper } from './styled';
import OverlayBlocks from "./OverlayBlocks";
import {
  useFileManagerState,
} from "../../ContextStore/FileManagerContext";
import { ContextMenuTypeEnum, FolderType, Items, ItemsList, ItemType } from "../../types";

const findDragAndDropItems = (
  result: DropResult,
  filesList: ItemsList
): { draggedFile?: Items; destinationFolder?: FolderType } => {
  let draggedFile: Items | undefined;
  let destinationFolder: FolderType | undefined;

  for (const file of filesList) {
    if (file.id === result.draggableId) {
      draggedFile = file;
    }
    if (file.id === result.destination?.droppableId) {
      if (file.type !== ItemType.FOLDER) {
        break; // Exit early
      }
      destinationFolder = file;
    }
    if (draggedFile && destinationFolder) {
      break; // Exit early if both items are found
    }
  }
  return { draggedFile, destinationFolder };
};

const ContainerBar: React.FC = () => {
  const { operations: { handleContextClick, handleDragEnd }, filesList } = useFileManagerState();

  const handleContextMenuClick = useCallback((event: MouseEvent) => {
    handleContextClick({ item: null, event, menuType: ContextMenuTypeEnum.CONTENT});
  }, [handleContextClick]);

  const onDragEnd = useCallback(async (result: DropResult)=>{
    const { draggedFile, destinationFolder} = await findDragAndDropItems(result, filesList);
    if(draggedFile && destinationFolder){
      handleDragEnd([draggedFile], destinationFolder);
    }
  },[filesList, handleDragEnd]);

  return (
    <StyledFilesListWrapper>
      <StyledFilesListContainer
        onContextMenu={handleContextMenuClick}
      >
        <OverlayBlocks />
        <DragDropContext onDragEnd={onDragEnd}>
          <ViewItems />
        </DragDropContext>
      </StyledFilesListContainer>
    </StyledFilesListWrapper>
  );
}

export default memo(ContainerBar);
