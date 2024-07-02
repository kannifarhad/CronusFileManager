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

const FolderItem = ({ item, index }) => {
  let fileCuted = isCuted(item);
  let isSelected = checkIsSelected(item);
  return (
    <Draggable
      index={index}
      draggableId={item.id}
      isDragDisabled={item.private}
    >
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          className={clsx(classes.itemFile, {
            selected: selectedFiles.includes(item.path),
            selectmode: selectedFiles.length > 0,
            notDragging: !snapshot.isDragging,
            fileCuted: fileCuted,
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
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getStyle(provided.droppableProps.style, snapshot)}
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
                <div className={classes.infoBox}>
                  <img
                    src={
                      snapshot.isDraggingOver
                        ? toAbsoluteUrl(config.icons.folderopen)
                        : toAbsoluteUrl(config.icons.folder)
                    }
                  />
                </div>
                <Tooltip
                  title={
                    <>
                      <b>Name :</b> {item.name} <br />
                      <b>Created :</b> {convertDate(item.created)}
                    </>
                  }
                >
                  <div className={classes.itemTitle}>
                    <span>{item.name}</span>
                  </div>
                </Tooltip>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      )}
    </Draggable>
  );
};

export default memo(FolderItem);
