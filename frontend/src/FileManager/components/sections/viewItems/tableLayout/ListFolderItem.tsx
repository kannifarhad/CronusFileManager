import React, { memo, useMemo, useCallback, type CSSProperties } from "react";
import { Checkbox } from "@mui/material";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { convertDate, formatBytes, classNames } from "../../../../utils";
import { useFileManagerState } from "../../../../store/FileManagerContext";
import { type FolderType, ItemMoveActionTypeEnum, ContextMenuTypeEnum } from "../../../../types";
import { StyledListTableCell, StyledListTableRow } from "../styled";
import ContentIcons from "../../../elements/ContentIcons";

const ListFolderItem: React.FC<{
  item: FolderType;
  style: CSSProperties;
}> = ({ item, style }) => {
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
    () => bufferedItems.type === ItemMoveActionTypeEnum.CUT && bufferedItems.files.has(item),
    [item, bufferedItems]
  );

  const isSelected = useMemo(() => selectedFiles.has(item), [selectedFiles, item]);

  return (
    <StyledListTableRow
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
      onContextMenu={(event: React.MouseEvent<HTMLTableRowElement>) => handleContextMenuClick(item, event)}
      {...listeners}
      {...attributes}
      style={style}
    >
      <StyledListTableCell style={{ width: "40px" }}>
        <Checkbox checked={isSelected} onChange={() => handleAddSelected(item)} value={item.id} />
      </StyledListTableCell>
      <StyledListTableCell style={{ width: "40px" }}>
        <ContentIcons name={isOver ? "folderopen" : "folder"} size={50} />
      </StyledListTableCell>
      <StyledListTableCell style={{ flexGrow: 1 }}>
        <div>{item.name}</div>
      </StyledListTableCell>
      <StyledListTableCell style={{ width: "100px" }}>{formatBytes(item.size)}</StyledListTableCell>
      <StyledListTableCell style={{ width: "150px", fontSize: "12px" }}>
        {convertDate(item.created)}
      </StyledListTableCell>
    </StyledListTableRow>
  );
};

export default memo(ListFolderItem);
