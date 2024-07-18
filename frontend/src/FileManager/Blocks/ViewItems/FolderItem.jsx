import React, { memo } from "react";
import {
  Tooltip,
} from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ItemSelectButton from './ItemSelectButton';
import { toAbsoluteUrl, convertDate } from "../../../Utils/Utils";
import {StyledFileItem, StyledItemTitle, StyledItemInfoBox} from './styled';
import config from "../../Elements/config.json";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

const FolderItem = ({ item, index }) => {
  const { operations, selectedFiles, bufferedItems, showImages } = useFileManagerState();

  const handleContextMenuClick = ()=>{
  }
  console.log('selectedFiles', selectedFiles);
  const doubleClick = ()=>{};

    const isCuted = (item) => {
    if (bufferedItems.type === "cut") {
      return (
        bufferedItems.files.filter((file) => file.id === item.id).length > 0
      );
    }
    return false;
  };
  let fileCuted = isCuted(item);
  const getStyle = (style, snapshot) => {
    if (!snapshot.isDraggingOver) {
      return style;
    }
    return {
      ...style,
      background: "#f00 !important",
    };
  }
  
  return (
    <Draggable
      index={index}
      draggableId={item.id}
      isDragDisabled={item.private}
    >
      {(provided, snapshot) => (
        <StyledFileItem
          ref={provided.innerRef}
          className={{
            'selected': selectedFiles?.has(item),
            'selectmode': selectedFiles?.size > 0,
            'notDragging': !snapshot.isDragging,
            'fileCuted': fileCuted,
          }}
          onDoubleClick={() => doubleClick(item.path)}
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable
            droppableId={item.id}
            type="CONTAINERITEM"
            isCombineEnabled
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getStyle(provided.droppableProps.style, snapshot)}
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
