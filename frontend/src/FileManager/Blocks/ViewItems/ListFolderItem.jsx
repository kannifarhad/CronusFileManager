import { memo } from "react";
import {
  TableRow,
  Checkbox,
} from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { toAbsoluteUrl, convertDate, formatBytes } from "../../../Utils/Utils";
import config from "../../Elements/config.json";
import { StyledListTableCell } from "./styled";

const ListFolderItem = ({ item, index }) => {
  const doubleClick = ()=>{};
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

  const addSelect = ()=>{

  }
   const checkIsSelected = (item) => {
    return selectedFiles?.has (item);
  };
  let isSelected = checkIsSelected(item);

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
    <Draggable index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          className={{
            'tableListRow': true,
            'selected': selectedFiles?.has (item.path),
            'fileCuted': fileCuted,
            'selectmodeTable': selectedFiles.size > 0,
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
              <>
                <StyledListTableCell>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => addSelect(item)}
                    value={item.id}
                  />
                </StyledListTableCell>
                <StyledListTableCell>
                  <img
                    alt={item.name}
                    style={{ width: "20px" }}
                    src={
                      snapshot.isDraggingOver
                        ? toAbsoluteUrl(config.icons.folderopen)
                        : toAbsoluteUrl(config.icons.folder)
                    }
                  />
                </StyledListTableCell>
                <StyledListTableCell align="left">
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={getStyle(provided.droppableProps.style, snapshot)}
                  >
                    {item.name}
                    {provided.placeholder}
                  </div>
                </StyledListTableCell>
                <StyledListTableCell align="left">
                  {formatBytes(item.size)}
                </StyledListTableCell>
                <StyledListTableCell align="left">
                  {convertDate(item.created)}
                </StyledListTableCell>
              </>
            )}
          </Droppable>
        </TableRow>
      )}
    </Draggable>
  );
};

export default memo(ListFolderItem);
