import React, { memo, useMemo, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import ItemSelectButton from "./ItemSelectButton";
import { convertDate, classNames } from "../../../../utils/helpers";
import { StyledFileItem, StyledItemTitle, StyledItemInfoBox } from "../styled";
import { useFileManagerState } from "../../../../store/FileManagerContext";
import { type FolderType, ItemMoveActionTypeEnum, ContextMenuTypeEnum } from "../../../../types";
import ContentIcons from "../../../elements/ContentIcons";

const FolderItem: React.FC<{
  item: FolderType;
}> = ({ item }) => {
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
    [handleContextClick]
  );

  const doubleClick = useCallback(
    (clickedItem: FolderType) => {
      handleSelectFolder(clickedItem);
    },
    [handleSelectFolder]
  );

  const isCuted = useMemo(
    () => bufferedItems.type === ItemMoveActionTypeEnum.CUT && bufferedItems.files.has(item),
    [item, bufferedItems]
  );
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: item,
  });

  const { setNodeRef, isOver } = useDroppable({
    id: item.id,
    disabled: isDragging,
    data: item,
  });

  return (
    <Box sx={{ padding: "3px", width: "100%", height: "100%", boxSizing: "border-box" }}>
      <StyledFileItem
        ref={setNodeRef}
        className={classNames({
          selected: selectedFiles?.has(item),
          selectmode: selectedFiles?.size > 0,
          fileCuted: isCuted || isDragging,
          isFolder: true,
        })}
        onDoubleClick={() => doubleClick(item)}
        onContextMenu={(event) => handleContextMenuClick(item, event)}
      >
        <ItemSelectButton item={item} />
        <StyledItemInfoBox ref={setDraggableRef} {...listeners} {...attributes}>
          <ContentIcons name={isOver ? "folderopen" : "folder"} size={50} />
        </StyledItemInfoBox>
        <Tooltip
          title={
            <span>
              <strong>Name :</strong> {item.name} <br />
              <strong>Created :</strong> {convertDate(item.created)}
            </span>
          }
        >
          <StyledItemTitle>
            <span>{item.name}</span>
          </StyledItemTitle>
        </Tooltip>
      </StyledFileItem>
    </Box>
  );
};

export default memo(FolderItem);
