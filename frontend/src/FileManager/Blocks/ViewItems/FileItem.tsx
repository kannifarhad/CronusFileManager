import React, { memo, useMemo } from "react";
import { Tooltip } from "@mui/material";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { getThumb, classNames } from "../../helpers";
import ItemSelectButton from './ItemSelectButton';
import { StyledFileItem, StyledItemExtension, StyledItemTitle, StyledItemInfoBox } from './styled';
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { Items , FileType,  ItemMoveActionTypeEnum  } from "../../types";

interface FileItemProps {
  item: FileType;
  index: number;
}

const FileItem: React.FC<FileItemProps> = ({ item, index }) => {
  const { operations, selectedFiles, bufferedItems, showImages } = useFileManagerState();

  const handleContextMenuClick = (item: FileType, event: React.MouseEvent) => {
    // Context menu click handling logic here
  };

  const isCuted = useMemo(() => {
    return bufferedItems.type === ItemMoveActionTypeEnum.CUT  && bufferedItems.files.has(item);
  }, [item, bufferedItems]);

  return (
    <Draggable
      draggableId={item.id}
      index={index}
      isDragDisabled={item.private}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <StyledFileItem
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          className={classNames({
            'selected': selectedFiles?.has (item),
            'selectmode': selectedFiles.size > 0,
            'notDragging': !snapshot.isDragging,
            'fileCuted': isCuted,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ItemSelectButton item={item} />
          <StyledItemExtension>{item.extension}</StyledItemExtension>

          <StyledItemInfoBox>
            <img alt={item.name} src={getThumb(item, showImages)} />
          </StyledItemInfoBox>
          <Tooltip title={item.name}>
            <StyledItemTitle>
              <span>{item.name}</span>
            </StyledItemTitle>
          </Tooltip>
        </StyledFileItem>
      )}
    </Draggable>
  );
};

export default memo(FileItem);
