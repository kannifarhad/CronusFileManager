import React, { memo, useCallback, useMemo } from "react";
import { Tooltip } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { classNames, getFileIcon } from "../../../helpers";
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
  ImagesThumbTypeEnum,
} from "../../../types";
import { FILE_EXTENSION_MAP } from "../../../config";

const FileItem: React.FC<{
  item: FileType;
}> = ({ item }) => {
  const {
    operations: { handleContextClick, handleGetThumb },
    selectedFiles,
    bufferedItems,
    settings,
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

  const getImageThumb = useCallback(
    (fileItem: FileType) => {
      try {
        if (
          settings.showImages === ImagesThumbTypeEnum.THUMB &&
          FILE_EXTENSION_MAP.imageFiles.includes(fileItem.extension)
        ) {
          return handleGetThumb(fileItem);
        }
        return getFileIcon(fileItem);
      } catch (error) {
        return getFileIcon(fileItem);
      }
    },
    [handleGetThumb, settings.showImages]
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
        <img alt={item.name} src={getImageThumb(item) as unknown as string} />
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
