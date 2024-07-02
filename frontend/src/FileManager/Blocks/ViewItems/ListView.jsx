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

const ListView = () => {
  return (
    <TableContainer component={Box}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow className={classes.tableHead}>
            <TableCell style={{ width: "20px" }}></TableCell>
            <TableCell style={{ width: "35px" }} align="left"></TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell style={{ width: "100px" }} align="left">
              Size
            </TableCell>
            <TableCell style={{ width: "150px" }} align="left">
              Created
            </TableCell>
          </TableRow>
        </TableHead>

        <Droppable
          droppableId="listDroppablContainer"
          type="CONTAINERITEM"
          isCombineEnabled
        >
          {(provided, snapshot) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {props.filesList.map(
                (item, index) =>
                  item.type === "folder" && (
                    <ListFolderItem key={index} index={index} item={item} />
                  )
              )}

              {props.filesList.map(
                (item, index) =>
                  item.type === "file" && (
                    <ListFileItem key={index} index={index} item={item} />
                  )
              )}

              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </TableContainer>
  );
};

export default memo(ListView);
