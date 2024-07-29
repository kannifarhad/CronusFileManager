import React, { memo, useMemo, useCallback } from "react";
import { Tooltip } from "@mui/material";
import { Droppable, Draggable, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import ItemSelectButton from './ItemSelectButton';
import { toAbsoluteUrl, convertDate } from "../../../Utils/Utils";
import { StyledFileItem, StyledItemTitle, StyledItemInfoBox } from './styled';
import config from "../../Elements/config.json";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { FolderType,  ItemMoveActionTypeEnum, ContextMenuTypeEnum  } from "../../types";
import { classNames } from "../../helpers";

const FolderItem:  React.FC<{
  item: FolderType;
  index: number;
}> = ({ item, index }) => {
  const { operations:{ handleContextClick, handleSelectFolder}, selectedFiles, bufferedItems } = useFileManagerState();

  const handleContextMenuClick = useCallback((item: FolderType, event: React.MouseEvent) => {
    handleContextClick({ item, event, menuType: ContextMenuTypeEnum.ITEM });
  },[handleContextClick]);

  const doubleClick = useCallback((item: FolderType) => {
    handleSelectFolder(item);
  },[handleSelectFolder]);

  const isCuted = useMemo(() => bufferedItems.type === ItemMoveActionTypeEnum.CUT  && bufferedItems.files.has(item)
  , [item, bufferedItems]);

  // const getStyle = (style: React.CSSProperties, snapshot: DroppableStateSnapshot): React.CSSProperties => {
  //   if (!snapshot.isDraggingOver) {
  //     return style;
  //   }
  //   return {
  //     ...style,
  //     background: "#f00 !important",
  //   };
  // };

  return (
    <Draggable index={index} draggableId={item.id} isDragDisabled={item.private}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <StyledFileItem
          ref={provided.innerRef}
          className={classNames({
            'selected': selectedFiles?.has(item),
            'selectmode': selectedFiles?.size > 0,
            'notDragging': !snapshot.isDragging,
            'fileCuted': isCuted,
          })}
          onDoubleClick={() => doubleClick(item)}
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={item.id} type="CONTAINERITEM" isCombineEnabled>
            {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                // style={getStyle(provided.droppableProps?.style as React.CSSProperties, snapshot)}
              >
                <ItemSelectButton item={item} />

                <StyledItemInfoBox>
                  <img
                    alt={item.name}
                    src={
                      snapshot.isDraggingOver
                        ? toAbsoluteUrl(config.icons.folderopen)
                        : toAbsoluteUrl(config.icons.folder)
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
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </StyledFileItem>
      )}
    </Draggable>
  );
};

export default memo(FolderItem);
