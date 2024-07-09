import React, { memo } from "react";
import {
  Tooltip,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { getThumb } from "../../helpers";
import ItemSelectButton from './ItemSelectButton';
import {StyledFileItem, StyledItemExtension, StyledItemTitle, StyledItemInfoBox} from './styled';

const FileItem = ({ item, index }) => {
  const selectedFiles = [];
  const bufferedItems = {files:[]};
  const handleContextMenuClick = ()=>{
  }
    const isCuted = (item) => {
    if (bufferedItems.type === "cut") {
      return (
        bufferedItems.files.filter((file) => file.id === item.id).length > 0
      );
    }
    return false;
  };
  let fileCuted = isCuted(item);

  return (
    <Draggable
      draggableId={item.id}
      index={index}
      isDragDisabled={item.private}
    >
      {(provided, snapshot) => (
        <StyledFileItem
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          className={{
            'selected': selectedFiles.includes(item.path),
            'selectmode': selectedFiles.length > 0,
            'notDragging': !snapshot.isDragging,
            'fileCuted': fileCuted,
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ItemSelectButton item={item} />
          <StyledItemExtension>{item.extension}</StyledItemExtension>

          <StyledItemInfoBox>
            <img alt={item.name} src={getThumb(item)} />
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
