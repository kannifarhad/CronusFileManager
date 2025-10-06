import React, { memo, useCallback, useMemo, type CSSProperties } from "react";
import { Checkbox } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { StyledListTableCell, StyledListTableRow } from "../styled";
import { convertDate, formatBytes, getFileIcon, classNames } from "../../../../utils/helpers";
import { type FileType, ItemMoveActionTypeEnum, ContextMenuTypeEnum } from "../../../../types";
import { useFileManagerState } from "../../../../store/FileManagerContext";
import ContentIcons from "../../../elements/ContentIcons";

const ListFileItem: React.FC<{
  item: FileType;
  style: CSSProperties;
}> = ({ item, style }) => {
  const {
    operations: { handleContextClick, handleAddSelected },
    selectedFiles,
    bufferedItems,
  } = useFileManagerState();

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

  const isSelected = useMemo(() => selectedFiles.has(item), [selectedFiles, item]);

  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  return (
    <StyledListTableRow
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
      style={style}
    >
      <StyledListTableCell style={{ width: "40px" }}>
        <Checkbox checked={isSelected} onChange={() => handleAddSelected(item)} value={item.id} />
      </StyledListTableCell>
      <StyledListTableCell style={{ width: "40px" }}>
        <ContentIcons name={getFileIcon(item.extension)} />
      </StyledListTableCell>
      <StyledListTableCell style={{ flexGrow: 1 }}>{item.name}</StyledListTableCell>
      <StyledListTableCell style={{ width: "100px" }}>{formatBytes(item.size)}</StyledListTableCell>
      <StyledListTableCell style={{ width: "150px" }}>{convertDate(item.created)}</StyledListTableCell>
    </StyledListTableRow>
  );
};

export default memo(ListFileItem);
