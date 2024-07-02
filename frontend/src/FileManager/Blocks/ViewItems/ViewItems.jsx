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
import GridView from "./GridView";
import ListView from "./ListView";

function ViewItems(props) {
  const {
    onContextMenuClick,
    addSelect,
    selectedFiles,
    bufferedItems,
    showImages,
  } = props;
  const classes = useStyles();


  const handleContextMenuClick = async (item, event) => {
    addSelect(item);
    onContextMenuClick(event);
  };

  const checkIsSelected = (item) => {
    return selectedFiles.includes(item);
  };

  const isCuted = (item) => {
    if (bufferedItems.type === "cut") {
      return (
        bufferedItems.files.filter((file) => file.id === item.id).length > 0
      );
    }
    return false;
  };

  function getStyle(style, snapshot) {
    if (!snapshot.isDraggingOver) {
      return style;
    }
    return {
      ...style,
      background: "#f00 !important",
    };
  }

  return <>{props.itemsView === "grid" ? <GridView /> : <ListView />}</>;
}

export default memo(ViewItems);
