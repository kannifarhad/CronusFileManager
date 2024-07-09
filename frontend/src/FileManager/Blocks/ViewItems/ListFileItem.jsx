import { memo } from "react";
import {
  TableRow,
  Checkbox,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { StyledListTableCell } from "./styled";
import { convertDate, formatBytes } from "../../../Utils/Utils";
import { getThumb } from "../../helpers";

const ListFileItem = ({ item, index }) => {
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
  const addSelect = ()=>{

  }
   const checkIsSelected = (item) => {
    return selectedFiles.includes(item);
  };
  let fileCuted = isCuted(item);
  let isSelected = checkIsSelected(item);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <TableRow
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          className={{
            'tableListRow': true,
            'selected': selectedFiles.includes(item.path),
            'fileCuted': fileCuted,
            'selectmodeTable': selectedFiles.length > 0,
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
              style={{ width: "20px", maxHeight: "30px" }}
              src={getThumb(item)}
            />
          </StyledListTableCell>
          <StyledListTableCell align="left">
            {item.name}
          </StyledListTableCell>
          <StyledListTableCell align="left">
            {formatBytes(item.size)}
          </StyledListTableCell>
          <StyledListTableCell align="left">
            {convertDate(item.created)}
          </StyledListTableCell>
        </TableRow>
      )}
    </Draggable>
  );
};

export default memo(ListFileItem);
