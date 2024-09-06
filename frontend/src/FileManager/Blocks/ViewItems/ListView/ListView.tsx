import React, { memo, useCallback, useState } from "react";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import ListFileItem from "./ListFileItem";
import { StyledListTable, StyledEmptyFolderContainer } from "../styled";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import { FileType, Items } from "../../../types";
import VirtualizedList from "./VirtualizedList";

const ListView: React.FC<{}> = () => {
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
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <TableContainer component={Box}>
        <StyledListTable size="small" aria-label="a dense table">
          <TableHead>
            <TableRow className="tableHead">
              <TableCell style={{ width: "20px" }} />
              <TableCell style={{ width: "35px" }} align="left" />
              <TableCell align="left">Name</TableCell>
              <TableCell style={{ width: "100px" }} align="left">
                Size
              </TableCell>
              <TableCell style={{ width: "150px" }} align="left">
                Created
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <VirtualizedList items={filesList} />
            <DragOverlay>
              {activeItem ? (
                <ListFileItem item={activeItem as FileType} />
              ) : null}
            </DragOverlay>
          </TableBody>
        </StyledListTable>
      </TableContainer>
    </DndContext>
  );
};

export default memo(ListView);
