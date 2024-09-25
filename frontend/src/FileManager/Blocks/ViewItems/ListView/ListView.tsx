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
import { List as VirtualizedList, AutoSizer } from "react-virtualized";
import DraggedElementsStack from "../GridView/DraggedElementsStack";
import ListItemRender from "./ListItemRender";
import { StyledListTable, StyledEmptyFolderContainer } from "../styled";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import { Items } from "../../../types";

export const ROW_HEIGHT = 50;

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

  // Virtualized row renderer
  const rowRenderer = ({ index, key, style }: any) => {
    const item = filesList[index];
    return <ListItemRender item={item} key={key} style={style} />;
  };

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
      <TableContainer
        component={Box}
        style={{ height: "100%", overflow: "hidden" }}
      >
        <StyledListTable
          size="small"
          aria-label="files list table"
          style={{ height: "100%" }}
        >
          <TableHead>
            <TableRow className="tableHead">
              <TableCell style={{ width: "45px" }} />
              <TableCell style={{ width: "35px" }} align="left" />
              <TableCell align="left">Name</TableCell>
              <TableCell style={{ width: "100px" }} align="left">
                Size
              </TableCell>
              <TableCell style={{ width: "165px" }} align="left">
                Created
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody style={{ height: "100%" }}>
            <AutoSizer>
              {({ height, width }) => (
                <VirtualizedList
                  width={width}
                  height={height}
                  rowHeight={ROW_HEIGHT}
                  rowCount={filesList.length}
                  rowRenderer={rowRenderer}
                  overscanRowCount={5}
                />
              )}
            </AutoSizer>
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
          </TableBody>
        </StyledListTable>
      </TableContainer>
    </DndContext>
  );
};

export default memo(ListView);
