
import React, { memo, useState } from "react";
import { connect } from "react-redux";
import { Menu, MenuItem, Divider, Box } from "@mui/material";
import { uploadFile, pasteFiles } from "../../../Redux/actions";
import useStyles from "../../Elements/Styles";

const contextMenuInital = {
  mouseX: null,
  mouseY: null,
  selected: null,
};

function ContextMenu() {
  const buttons = {};
  const classes = useStyles();
  const [itemContext, itemContexSet] = useState(contextMenuInital);
  const [contentContex, contentContexSet] = useState(contextMenuInital);

  const handleContextClose = () => {
    itemContexSet(contextMenuInital);
    contentContexSet(contextMenuInital);
  };

  return (
<>

      <Menu
        keepMounted
        open={itemContext.mouseY !== null}
        className={classes.menu}
        onContextMenu={handleContextClose}
        onClose={handleContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          itemContext.mouseY !== null && itemContext.mouseX !== null
            ? { top: itemContext.mouseY, left: itemContext.mouseX }
            : undefined
        }
      >
        {buttons.file.map((buttonGroup, index) => [
          buttonGroup.map((button, index) => (
            <MenuItem
              key={index}
              disabled={button.disable}
              className={classes.menuItem}
              onClick={button.onClick}
            >
              <span className={`${button.icon}`}></span>
              {button.title}
            </MenuItem>
          )),
          <Divider />,
        ])}
      </Menu>

      <Menu
        keepMounted
        open={contentContex.mouseY !== null}
        className={classes.menu}
        onContextMenu={handleContextClose}
        onClose={handleContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contentContex.mouseY !== null && contentContex.mouseX !== null
            ? { top: contentContex.mouseY, left: contentContex.mouseX }
            : undefined
        }
      >
        {buttons?.container?.map((buttonGroup, index) => [
          buttonGroup.map((button, index) => (
            <MenuItem
              key={index}
              disabled={button.disable}
              className={classes.menuItem}
              onClick={button.onClick}
            >
              <span className={`${button.icon}`}></span>
              {button.title}
            </MenuItem>
          )),
          <Divider />,
        ])}
      </Menu>
    </>
  );
}

export default memo(ContextMenu);
