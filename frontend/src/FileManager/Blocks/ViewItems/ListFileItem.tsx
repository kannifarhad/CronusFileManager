import React, { memo, useCallback, useMemo } from "react";

import {
  TableRow,
  Checkbox,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { StyledListTableCell } from "./styled";
import { convertDate, formatBytes } from "../../../Utils/Utils";
import { getThumb, classNames } from "../../helpers";
import { FileType , ItemMoveActionTypeEnum, ContextMenuTypeEnum } from "../../types"; // Assuming you have a FileType defined in your types file
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

const ListFileItem: React.FC<{
  item: FileType;
  index: number;
}> = ({ item, index }) => {
  const { operations:{ handleContextClick, handleAddSelected}, selectedFiles, bufferedItems, showImages } = useFileManagerState();
  
  const handleContextMenuClick = useCallback((item: FileType, event: React.MouseEvent) => {
    handleContextClick({ item, event, menuType: ContextMenuTypeEnum.ITEM });
  },[handleContextClick]);

  const isCuted = useMemo(() => bufferedItems.type === ItemMoveActionTypeEnum.CUT  && bufferedItems.files.has(item)
  , [item, bufferedItems]);


  const isSelected = useMemo(()=> selectedFiles.has(item),[selectedFiles, item]);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <TableRow
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          className={classNames({
            'tableListRow': true,
            'selected': selectedFiles.has(item),
            'selectmodeTable': selectedFiles.size > 0,
            'notDragging': !snapshot.isDragging,
            'fileCuted': isCuted,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
