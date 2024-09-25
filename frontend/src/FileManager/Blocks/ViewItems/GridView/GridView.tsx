import React, { memo, useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { StyledGridViewContainer, StyledEmptyFolderContainer } from "../styled";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import { Items } from "../../../types";
import DraggedElementsStack from "./DraggedElementsStack";
import VirtualizedGrid from "./VirtualizedGrid";

export const ITEM_SIZE = 100;

const GridView = () => {
  const {
    filesList,
    selectedFiles,
    operations: { handleDragEnd },
  } = useFileManagerState();
  const [activeItem, setActiveItem] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5, delay: 200 },
    })
  );

  const handleDragStart = useCallback((event: any) => {
    setActiveItem(event.active.data.current);
  }, []);

  const onDragEnd = useCallback(
    (event: any) => {
      const folderItem = event.over?.data?.current;
      const droppedItems: Items[] =
        selectedFiles.size > 0
          ? Array.from(selectedFiles)
          : ([activeItem] as Items[]);
      if (folderItem && droppedItems.length > 0) {
        handleDragEnd(droppedItems, folderItem);
      }
    },
    [selectedFiles, activeItem, handleDragEnd]
  );

  if (filesList.length === 0) {
    return (
      <StyledEmptyFolderContainer>
        <h6>The folder is empty!</h6>
      </StyledEmptyFolderContainer>
    );
  }

  return (
    <StyledGridViewContainer>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <VirtualizedGrid items={filesList} />
        <DragOverlay>
          {activeItem ? (
            <DraggedElementsStack
              filesList={
                selectedFiles.size > 0
                  ? Array.from(selectedFiles)
                  : [activeItem]
              }
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </StyledGridViewContainer>
  );
};

export default memo(GridView);
