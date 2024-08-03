import React, { memo, useMemo, useCallback } from "react";
import { TableRow, Checkbox } from "@mui/material";
import {
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import {
  toAbsoluteUrl,
  convertDate,
  formatBytes,
  classNames,
} from "../../helpers";
import config from "../../Elements/config.json";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import {
  FolderType,
  ItemMoveActionTypeEnum,
  ContextMenuTypeEnum,
} from "../../types";
import { StyledListTableCell } from "./styled";

const ListFolderItem: React.FC<{
  item: FolderType;
  index: number;
}> = ({ item, index }) => {
  const {
    operations: { handleContextClick, handleSelectFolder, handleAddSelected },
    selectedFiles,
    bufferedItems,
  } = useFileManagerState();

  const handleContextMenuClick = useCallback(
    (clickedItem: FolderType, event: React.MouseEvent) => {
      handleContextClick({
        item: clickedItem,
        event,
        menuType: ContextMenuTypeEnum.ITEM,
      });
    },
    [handleContextClick],
  );

  const doubleClick = useCallback(
    (clickedItem: FolderType) => {
      handleSelectFolder(clickedItem, true);
    },
    [handleSelectFolder],
  );

  const isCuted = useMemo(
    () =>
      bufferedItems.type === ItemMoveActionTypeEnum.CUT &&
      bufferedItems.files.has(item),
    [item, bufferedItems],
  );

  const isSelected = useMemo(
    () => selectedFiles.has(item),
    [selectedFiles, item],
  );

  // const getStyle = (style: React.CSSProperties, snapshot: DroppableStateSnapshot) => {
  //   if (!snapshot.isDraggingOver) {
  //     return style;
  //   }
  //   return {
  //     ...style,
  //     background: "#f00 !important",
  //   };
  // };

  return (
    <Draggable index={index} draggableId={item.id}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <TableRow
          ref={provided.innerRef}
          className={classNames({
            tableListRow: true,
            selected: selectedFiles?.has(item),
            selectmodeTable: selectedFiles?.size > 0,
            fileCuted: isCuted,
          })}
          onDoubleClick={() => doubleClick(item)}
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable
            droppableId={item.id}
            type="CONTAINERITEM"
            isCombineEnabled
          >
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot,
            ) => (
              <>
                <StyledListTableCell>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleAddSelected(item)}
                    value={item.id}
                  />
                </StyledListTableCell>
                <StyledListTableCell>
                  <img
                    alt={item.name}
                    style={{ width: "20px" }}
                    src={
                      snapshot.isDraggingOver
                        ? toAbsoluteUrl(config.icons.folderopen)
                        : toAbsoluteUrl(config.icons.folder)
                    }
                  />
                </StyledListTableCell>
                <StyledListTableCell align="left">
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    // style={getStyle(provided.droppableProps.style, snapshot)}
                  >
                    {item.name}
                    {provided.placeholder}
                  </div>
                </StyledListTableCell>
                <StyledListTableCell align="left">
                  {formatBytes(item.size)}
                </StyledListTableCell>
                <StyledListTableCell align="left">
                  {convertDate(item.created)}
                </StyledListTableCell>
              </>
            )}
          </Droppable>
        </TableRow>
      )}
    </Draggable>
  );
};

export default memo(ListFolderItem);
