import React, { memo, useCallback, useMemo } from "react";
import { TableRow, Checkbox } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { StyledListTableCell } from "../styled";
import {
  convertDate,
  formatBytes,
  getThumb,
  classNames,
} from "../../../helpers";
import {
  FileType,
  ItemMoveActionTypeEnum,
  ContextMenuTypeEnum,
} from "../../../types";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";

const ListFileItem: React.FC<{
  item: FileType;
}> = ({ item }) => {
  const {
    operations: { handleContextClick, handleAddSelected },
    selectedFiles,
    bufferedItems,
    showImages,
  } = useFileManagerState();

  const handleContextMenuClick = useCallback(
    (clickedItem: FileType, event: React.MouseEvent) => {
      handleContextClick({
        item: clickedItem,
        event,
        menuType: ContextMenuTypeEnum.ITEM,
      });
    },
    [handleContextClick],
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

  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  return (
    <TableRow
      onContextMenu={(event) => handleContextMenuClick(item, event)}
      className={classNames({
        tableListRow: true,
        selected: selectedFiles.has(item),
        selectmodeTable: selectedFiles.size > 0,
        fileCuted: isCuted || isDragging,
      })}
      ref={setNodeRef}
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
          style={{ width: "20px", maxHeight: "30px" }}
          src={getThumb(item, showImages)}
        />
      </StyledListTableCell>
      <StyledListTableCell align="left">{item.name}</StyledListTableCell>
      <StyledListTableCell align="left">
        {formatBytes(item.size)}
      </StyledListTableCell>
      <StyledListTableCell align="left">
        {convertDate(item.created)}
      </StyledListTableCell>
    </TableRow>
  );
};

export default memo(ListFileItem);
