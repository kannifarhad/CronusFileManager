import React, { memo, useMemo, useCallback } from "react";
import { TableRow, Checkbox } from "@mui/material";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import {
  toAbsoluteUrl,
  convertDate,
  formatBytes,
  classNames,
} from "../../../helpers";
import config from "../../../Elements/config.json";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import {
  FolderType,
  ItemMoveActionTypeEnum,
  ContextMenuTypeEnum,
} from "../../../types";
import { StyledListTableCell } from "../styled";

const ListFolderItem: React.FC<{
  item: FolderType;
}> = ({ item }) => {
  const {
    operations: { handleContextClick, handleSelectFolder, handleAddSelected },
    selectedFiles,
    bufferedItems,
  } = useFileManagerState();

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: item,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: item.id,
    disabled: isDragging,
    data: item,
  });

  const handleContextMenuClick = useCallback(
    (clickedItem: FolderType, event: React.MouseEvent<HTMLTableRowElement>) => {
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
      handleSelectFolder(clickedItem, true);
    },
    [handleSelectFolder]
  );

  const isCuted = useMemo(
    () =>
      bufferedItems.type === ItemMoveActionTypeEnum.CUT &&
      bufferedItems.files.has(item),
    [item, bufferedItems]
  );

  const isSelected = useMemo(
    () => selectedFiles.has(item),
    [selectedFiles, item]
  );

  return (
    <TableRow
      ref={(node: HTMLTableRowElement | null) => {
        if (node) {
          setDraggableRef(node);
          setDroppableRef(node);
        }
      }}
      className={classNames({
        tableListRow: true,
        selected: selectedFiles?.has(item),
        selectmodeTable: selectedFiles?.size > 0,
        fileCuted: isCuted,
      })}
      onDoubleClick={() => doubleClick(item)}
      onContextMenu={(event: React.MouseEvent<HTMLTableRowElement>) =>
        handleContextMenuClick(item, event)
      }
      {...listeners}
      {...attributes}
    >
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
            isOver
              ? toAbsoluteUrl(config.icons.folderopen)
              : toAbsoluteUrl(config.icons.folder)
          }
        />
      </StyledListTableCell>
      <StyledListTableCell align="left">
        <div>{item.name}</div>
      </StyledListTableCell>
      <StyledListTableCell align="left">
        {formatBytes(item.size)}
      </StyledListTableCell>
      <StyledListTableCell align="left">
        {convertDate(item.created)}
      </StyledListTableCell>
    </TableRow>
  );
};

export default memo(ListFolderItem);