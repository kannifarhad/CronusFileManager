
import { memo, useState } from "react";
import { Divider } from "@mui/material";
import { StyledContextMenu, StyledContextMenuItem } from "../../Elements/styled";
const contextMenuInital = {
  mouseX: null,
  mouseY: null,
  selected: null,
};

function ContextMenu() {
  const buttons = {file:[]};
  const [itemContext, itemContexSet] = useState(contextMenuInital);
  const [contentContex, contentContexSet] = useState(contextMenuInital);

  const handleContextClose = () => {
    itemContexSet(contextMenuInital);
    contentContexSet(contextMenuInital);
  };

  return (
<>

      <StyledContextMenu
        keepMounted
        open={itemContext.mouseY !== null}
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
            <StyledContextMenuItem
              key={index}
              disabled={button.disable}
              onClick={button.onClick}
            >
              <span className={`${button.icon}`}></span>
              {button.title}
            </StyledContextMenuItem>
          )),
          <Divider />,
        ])}
      </StyledContextMenu>

      <StyledContextMenu
        keepMounted
        open={contentContex.mouseY !== null}
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
            <StyledContextMenuItem
              key={index}
              disabled={button.disable}
              onClick={button.onClick}
            >
              <span className={`${button.icon}`}></span>
              {button.title}
            </StyledContextMenuItem>
          )),
          <Divider />,
        ])}
      </StyledContextMenu>
    </>
  );
}

export default memo(ContextMenu);
