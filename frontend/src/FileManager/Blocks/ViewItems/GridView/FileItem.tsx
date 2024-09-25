import React, { memo, useCallback, useMemo } from "react";
import { Tooltip } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { getThumb, classNames } from "../../../helpers";
import ItemSelectButton from "./ItemSelectButton";
import {
  StyledFileItem,
  StyledItemExtension,
  StyledItemTitle,
  StyledItemInfoBox,
} from "../styled";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import {
  FileType,
  ItemMoveActionTypeEnum,
  ContextMenuTypeEnum,
} from "../../../types";

const FileItem: React.FC<{
  item: FileType;
}> = ({ item }) => {
  const {
    operations: { handleContextClick },
    selectedFiles,
    bufferedItems,
    showImages,
  } = useFileManagerState();

  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const handleContextMenuClick = useCallback(
    (clickedItem: FileType, event: React.MouseEvent) => {
      handleContextClick({
        item: clickedItem,
        event,
        menuType: ContextMenuTypeEnum.ITEM,
      });
    },
    [handleContextClick]
  );

  const isCuted = useMemo(
    () =>
      bufferedItems.type === ItemMoveActionTypeEnum.CUT &&
      bufferedItems.files.has(item),
    [item, bufferedItems]
  );

  return (
    <StyledFileItem
      onContextMenu={(event) => handleContextMenuClick(item, event)}
      className={classNames({
        selected: selectedFiles.has(item),
        selectmode: selectedFiles.size > 0,
        fileCuted: isCuted || isDragging,
      })}
      ref={setNodeRef}
    >
      <ItemSelectButton item={item} />
      <StyledItemExtension>{item.extension}</StyledItemExtension>

      <StyledItemInfoBox {...listeners} {...attributes}>
        <img alt={item.name} src={getThumb(item, showImages)} />
      </StyledItemInfoBox>
      <Tooltip title={item.name}>
        <StyledItemTitle>
          <span>{item.name}</span>
        </StyledItemTitle>
      </Tooltip>
    </StyledFileItem>
  );
};

export default memo(FileItem);
