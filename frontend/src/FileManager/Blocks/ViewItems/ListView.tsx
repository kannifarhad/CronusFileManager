import React, { memo } from "react";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import ListFolderItem from "./ListFolderItem";
import ListFileItem from "./ListFileItem";
import { StyledListTable } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ItemType } from "../../types";

const ListView: React.FC<{}> = () => {
  const { filesList } = useFileManagerState();

  return (
    <TableContainer component={Box}>
      <StyledListTable size="small" aria-label="a dense table">
        <TableHead>
          <TableRow className="tableHead">
            <TableCell style={{ width: "20px" }} />
            <TableCell style={{ width: "35px" }} align="left" />
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
          droppableId="listDroppableContainer"
          type="CONTAINERITEM"
          isCombineEnabled
        >
          {(provided, snapshot) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {filesList.map((item, index) =>
                item.type === ItemType.FOLDER ? (
                  <ListFolderItem key={item.id} index={index} item={item} />
                ) : item.type === ItemType.FILE ? (
                  <ListFileItem key={item.id} index={index} item={item} />
                ) : null,
              )}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </StyledListTable>
    </TableContainer>
  );
};

export default memo(ListView);
