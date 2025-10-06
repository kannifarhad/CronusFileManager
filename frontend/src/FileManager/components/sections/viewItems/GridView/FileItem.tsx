import React, { memo, useCallback, useMemo } from "react";
import { Box, Tooltip } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { classNames, getFileIcon } from "../../../../helpers";
import ItemSelectButton from "./ItemSelectButton";
import { StyledFileItem, StyledItemExtension, StyledItemTitle, StyledItemInfoBox } from "../styled";
import { useFileManagerState } from "../../../../store/FileManagerContext";
import { type FileType, ItemMoveActionTypeEnum, ContextMenuTypeEnum, ImagesThumbTypeEnum } from "../../../../types";
import { FILE_EXTENSION_MAP } from "../../../../config";
import ContentIcons from "../../../elements/ContentIcons";

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
    () => bufferedItems.type === ItemMoveActionTypeEnum.CUT && bufferedItems.files.has(item),
    [item, bufferedItems]
  );

  const getImageThumb = useCallback(
    (fileItem: FileType) => {
      try {
        if (
          settings.showImages === ImagesThumbTypeEnum.THUMB &&
          FILE_EXTENSION_MAP.imageFiles.includes(fileItem.extension)
        ) {
          return <img alt={item.name} src={handleGetThumb(fileItem) as unknown as string} />;
        }
        return <ContentIcons name={getFileIcon(fileItem.extension)} />;
      } catch {
        return <ContentIcons name={getFileIcon(fileItem.extension)} />;
      }
    },
    [handleGetThumb, settings.showImages]
  );

  return (
    <Box sx={{ padding: "3px", width: "100%", height: "100%", boxSizing: "border-box" }}>
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
          {getImageThumb(item)}
        </StyledItemInfoBox>
        <Tooltip title={item.name}>
          <StyledItemTitle>
            <span>{item.name}</span>
          </StyledItemTitle>
        </Tooltip>
      </StyledFileItem>
    </Box>
  );
};

export default memo(FileItem);
