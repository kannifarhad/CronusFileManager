/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback, useState } from "react";
import { DndContext, DragOverlay, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { StyledGridViewContainer, StyledEmptyFolderContainer } from "../styled";
import { useFileManagerState } from "../../../../store/FileManagerContext";
import { type Items } from "../../../../types";
import DraggedElementsStack from "./DraggedElementsStack";
import VirtualizedGrid from "./VirtualizedGrid";
import useText from "../../../../utils/hooks/useTexts";

export const ITEM_SIZE = 100;

const GridView = () => {
  const {
    filesList,
    search,
    selectedFiles,
    operations: { handleDragEnd },
  } = useFileManagerState();
  const [activeItem, setActiveItem] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5, delay: 200 },
    })
  );
  const texts = useText();

  const handleDragStart = useCallback((event: any) => {
    setActiveItem(event.active.data.current);
  }, []);

  const onDragEnd = useCallback(
    (event: any) => {
      const folderItem = event.over?.data?.current;
      const droppedItems: Items[] = selectedFiles.size > 0 ? Array.from(selectedFiles) : ([activeItem] as Items[]);
      if (folderItem && droppedItems.length > 0) {
        handleDragEnd(droppedItems, folderItem);
      }
    },
    [selectedFiles, activeItem, handleDragEnd]
  );

  if (filesList.length === 0) {
    if (search.text) {
      return (
        <StyledEmptyFolderContainer>
          <h6>{texts.noResults}</h6>
        </StyledEmptyFolderContainer>
      );
    }
    return (
      <StyledEmptyFolderContainer>
        <h6>{texts.emptyFolder}</h6>
      </StyledEmptyFolderContainer>
    );
  }

  return (
    <StyledGridViewContainer>
      <DndContext onDragStart={handleDragStart} onDragEnd={onDragEnd} sensors={sensors}>
        <VirtualizedGrid items={filesList} />
        <DragOverlay>
          {activeItem ? (
            <DraggedElementsStack filesList={selectedFiles.size > 0 ? Array.from(selectedFiles) : [activeItem]} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </StyledGridViewContainer>
  );
};

export default memo(GridView);
