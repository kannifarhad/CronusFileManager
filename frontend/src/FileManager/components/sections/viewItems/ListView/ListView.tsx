import React, { memo, useCallback, useState } from "react";
import { TableContainer, Box } from "@mui/material";
import { DndContext, DragOverlay, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { List as VirtualizedList, AutoSizer } from "react-virtualized";
import DraggedElementsStack from "../gridView/DraggedElementsStack";
import ListItemRender from "./ListItemRender";
import { StyledListTable, StyledEmptyFolderContainer } from "../styled";
import { useFileManagerState } from "../../../../store/FileManagerContext";
import { type Items } from "../../../../types";
import useText from "../../../../hooks/useTexts";

export const ROW_HEIGHT = 50;

const ListView: React.FC<{}> = () => {
  const {
    filesList,
    selectedFiles,
    search,
    operations: { handleDragEnd },
  } = useFileManagerState();
  const [activeItem, setActiveItem] = useState<Items | null>(null);
  const texts = useText();

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
      const droppedItems: Items[] = selectedFiles.size > 0 ? Array.from(selectedFiles) : ([activeItem] as Items[]);
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
    <DndContext onDragStart={handleDragStart} onDragEnd={onDragEnd} sensors={sensors}>
      <TableContainer component={Box} style={{ height: "100%", overflow: "hidden" }}>
        <StyledListTable aria-label="files list table" style={{ height: "100%" }}>
          <Box className="tableHead">
            <Box style={{ width: "45px" }} />
            <Box style={{ width: "35px" }} />
            <Box>{texts.name}</Box>
            <Box style={{ width: "100px", marginLeft: "auto" }}>{texts.size}</Box>
            <Box style={{ width: "165px" }}>{texts.created}</Box>
          </Box>

          <Box style={{ height: "100%", width: "100%" }}>
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
                <DraggedElementsStack filesList={selectedFiles.size > 0 ? Array.from(selectedFiles) : [activeItem]} />
              ) : null}
            </DragOverlay>
          </Box>
        </StyledListTable>
      </TableContainer>
    </DndContext>
  );
};

export default memo(ListView);
