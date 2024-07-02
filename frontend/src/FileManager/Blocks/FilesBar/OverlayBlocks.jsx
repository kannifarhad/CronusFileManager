import React, { memo, useState } from "react";
import { connect } from "react-redux";
import { Menu, MenuItem, Divider, Box } from "@material-ui/core";
import { DragDropContext } from "react-beautiful-dnd";
import { uploadFile, pasteFiles } from "../../../Redux/actions";
import useStyles from "../../Elements/Styles";
import InfoBoxes from "../../Elements/InfoBoxes";
import DropZoneWrapper from "./DropZoneWrapper";
import FilesLoadingOverlay from "./FilesLoadingOverlay";
import ContextMenu from "./ContextMenu";

function OverlayBlocks(props) {
  const { messages, operations, isloading, uploadBox, buttons } = props;
  const classes = useStyles();

  return (
    <>
      <div className={classes.messagesBox}>
        {messages.map((alert, index) => (
          <InfoBoxes key={index} alert={alert} />
        ))}
      </div>

      <FilesLoadingOverlay />

      <DropZoneWrapper />

      <ContextMenu />
    </>
  );
}

export default memo(OverlayBlocks);
