import React, { memo, useMemo, useCallback } from "react";
import { Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import ItemSelectButton from "./ItemSelectButton";
import { toAbsoluteUrl, convertDate, classNames } from "../../../helpers";
import { StyledFileItem, StyledItemTitle, StyledItemInfoBox } from "../styled";
import { FILE_EXTENSION_MAP } from "../../../config";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import {
  FolderType,
  ItemMoveActionTypeEnum,
  ContextMenuTypeEnum,
} from "../../../types";

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
    () =>
      bufferedItems.type === ItemMoveActionTypeEnum.CUT &&
      bufferedItems.files.has(item),
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
    <StyledFileItem
      ref={setNodeRef}
      className={classNames({
        selected: selectedFiles?.has(item),
        selectmode: selectedFiles?.size > 0,
        fileCuted: isCuted || isDragging,
      })}
      onDoubleClick={() => doubleClick(item)}
      onContextMenu={(event) => handleContextMenuClick(item, event)}
    >
      <Box>
        <ItemSelectButton item={item} />
        <StyledItemInfoBox ref={setDraggableRef} {...listeners} {...attributes}>
          <img
            alt={item.name}
            src={
              isOver
                ? toAbsoluteUrl(FILE_EXTENSION_MAP.icons.folderopen)
                : toAbsoluteUrl(FILE_EXTENSION_MAP.icons.folder)
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
      </Box>
    </StyledFileItem>
  );
};

export default memo(FolderItem);
