import React from "react";
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

const FileItem = ({ item, index }) => {
  let fileCuted = isCuted(item);
  let isSelected = checkIsSelected(item);

  return (
    <Draggable
      draggableId={item.id}
      index={index}
      isDragDisabled={item.private}
    >
      {(provided, snapshot) => (
        <Box
          onContextMenu={(event) => handleContextMenuClick(item, event)}
          className={clsx(classes.itemFile, {
            selected: selectedFiles.includes(item.path),
            selectmode: selectedFiles.length > 0,
            notDragging: !snapshot.isDragging,
            fileCuted: fileCuted,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {(item.private && (
            <span className={`icon-lock ${classes.locked}`} />
          )) || (
            <Checkbox
              className={classes.checkbox}
              checked={isSelected}
              onChange={() => addSelect(item)}
              value={item.id}
            />
          )}
          <span className={classes.extension}>{item.extension}</span>

          <div className={classes.infoBox}>
            <img src={getThumb(item)} />
          </div>
          <Tooltip title={item.name}>
            <div className={classes.itemTitle}>
              <span>{item.name}</span>
            </div>
          </Tooltip>
        </Box>
      )}
    </Draggable>
  );
};

export default memo(FileItem);
