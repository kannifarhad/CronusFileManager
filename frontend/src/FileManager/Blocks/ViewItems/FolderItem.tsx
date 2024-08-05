import React, { memo, useMemo, useCallback } from "react";
import { Tooltip } from "@mui/material";
import {
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Box } from "@mui/system";
import ItemSelectButton from "./ItemSelectButton";
import { toAbsoluteUrl, convertDate, classNames } from "../../helpers";
import { StyledFileItem, StyledItemTitle, StyledItemInfoBox } from "./styled";
import config from "../../Elements/config.json";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import {
  FolderType,
  ItemMoveActionTypeEnum,
  ContextMenuTypeEnum,
} from "../../types";

const FolderItem: React.FC<{
  item: FolderType;
  index: number;
}> = ({ item, index }) => {
  const {
    operations: { handleContextClick, handleSelectFolder },
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
      handleSelectFolder(clickedItem);
    },
    [handleSelectFolder],
  );

  const isCuted = useMemo(
    () =>
      bufferedItems.type === ItemMoveActionTypeEnum.CUT &&
      bufferedItems.files.has(item),
    [item, bufferedItems],
  );

  // const getStyle = (snapshot: DroppableStateSnapshot): React.CSSProperties => {
  //   if (!snapshot.isDraggingOver) {
  //     return {};
  //   }
  //   return {
  //     background: "#f00 !important",
  //   };
  // };

  return (
    <Draggable
      index={index}
      draggableId={item.id}
      isDragDisabled={item.private}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <StyledFileItem
          ref={provided.innerRef}
          className={classNames({
            selected: selectedFiles?.has(item),
            selectmode: selectedFiles?.size > 0,
            notDragging: !snapshot.isDragging,
            fileCuted: isCuted,
          })}
          onDoubleClick={() => doubleClick(item)}
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable
            droppableId={`droppable-${item.id}`} // Ensure unique droppableId
            type="CONTAINERITEM"
            isCombineEnabled
          >
            {(
              dropProvided: DroppableProvided,
              dropSnapshot: DroppableStateSnapshot,
            ) => (
              <Box
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                // style={{...getStyle(dropSnapshot), border: '3px solid #ccc' }}
              >
                <ItemSelectButton item={item} />

                <StyledItemInfoBox>
                  <img
                    alt={item.name}
                    src={
                      dropSnapshot.isDraggingOver
                        ? toAbsoluteUrl(config.icons.folderopen)
                        : toAbsoluteUrl(config.icons.folder)
                    }
                  />
                </StyledItemInfoBox>
                <Tooltip
                  title={
                    <>
                      <b>Name :</b> {item.name} <br />
                      <b>Created :</b> {convertDate(item.created)}
                    </>
                  }
                >
                  <StyledItemTitle>
                    <span>{item.name}</span>
                  </StyledItemTitle>
                </Tooltip>
                {dropProvided.placeholder}
              </Box>
            )}
          </Droppable>
        </StyledFileItem>
      )}
    </Draggable>
  );
};

export default memo(FolderItem);
