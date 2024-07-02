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

const ListFileItem = ({ item, index }) => {
  let fileCuted = isCuted(item);
  let isSelected = checkIsSelected(item);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <TableRow
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          className={clsx(classes.tableListRow, {
            selected: selectedFiles.includes(item.path),
            fileCuted: fileCuted,
            selectmodeTable: selectedFiles.length > 0,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TableCell className={classes.tableCell}>
            <Checkbox
              checked={isSelected}
              onChange={() => addSelect(item)}
              value={item.id}
            />
          </TableCell>
          <TableCell className={classes.tableCell}>
            <img
              style={{ width: "20px", maxHeight: "30px" }}
              src={getThumb(item)}
            />
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {item.name}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {formatBytes(item.size)}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {convertDate(item.created)}
          </TableCell>
        </TableRow>
      )}
    </Draggable>
  );
};

export default memo(ListFileItem);
