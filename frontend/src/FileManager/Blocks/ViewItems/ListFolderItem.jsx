import React, { memo } from "react";
import { connect } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import clsx from "clsx";

import { toAbsoluteUrl, convertDate, formatBytes } from "../../../Utils/Utils";
import mainconfig from "../../../Data/Config";
import useStyles from "../../Elements/Styles";
import config from "../../Elements/config.json";

const ListFolderItem = ({ item, index }) => {
  let fileCuted = isCuted(item);
  let isSelected = checkIsSelected(item);

  return (
    <Draggable index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          className={clsx(classes.tableListRow, {
            selected: selectedFiles.includes(item.path),
            fileCuted: fileCuted,
            selectmodeTable: selectedFiles.length > 0,
          })}
          onDoubleClick={() => props.doubleClick(item.path)}
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
                <TableCell className={classes.tableCell}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => addSelect(item)}
                    value={item.id}
                  />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <img
                    style={{ width: "20px" }}
                    src={
                      snapshot.isDraggingOver
                        ? toAbsoluteUrl(config.icons.folderopen)
                        : toAbsoluteUrl(config.icons.folder)
                    }
                  />
                </TableCell>
                <TableCell className={classes.tableCell} align="left">
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={getStyle(provided.droppableProps.style, snapshot)}
                  >
                    {item.name}
                    {provided.placeholder}
                  </div>
                </TableCell>
                <TableCell className={classes.tableCell} align="left">
                  {formatBytes(item.size)}
                </TableCell>
                <TableCell className={classes.tableCell} align="left">
                  {convertDate(item.created)}
                </TableCell>
              </>
            )}
          </Droppable>
        </TableRow>
      )}
    </Draggable>
  );
};

export default memo(ListFolderItem);
