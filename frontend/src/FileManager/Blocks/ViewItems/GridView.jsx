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

const GridView = () => {
  return (
    <div className={classes.itemsList}>
      <Droppable
        droppableId="mainDroppablContainer"
        type="CONTAINERITEM"
        isCombineEnabled
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {props.filesList.map(
              (item, index) =>
                item.type === "folder" && (
                  <FolderItem key={index} index={index} item={item} />
                )
            )}

            {props.filesList.map(
              (item, index) =>
                item.type === "file" && (
                  <FileItem key={index} index={index} item={item} />
                )
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(GridView);
