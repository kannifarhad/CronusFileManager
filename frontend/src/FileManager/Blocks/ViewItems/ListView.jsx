import React, { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import ListFolderItem from './ListFolderItem';
import ListFileItem from './ListFileItem';
import {StyledListTable} from './styled';

const ListView = () => {
  const filesList = [];
  return (
    <TableContainer component={Box}>
      <StyledListTable size="small" aria-label="a dense table">
        <TableHead>
          <TableRow className='tableHead'>
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
              {filesList.map(
                (item, index) => {
                  item.type === "folder" && (
                    <ListFolderItem key={index} index={index} item={item} />
                  )
                  item.type === "file" && (
                    <ListFileItem key={index} index={index} item={item} />
                  )
})}

              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </StyledListTable>
    </TableContainer>
  );
};

export default memo(ListView);
