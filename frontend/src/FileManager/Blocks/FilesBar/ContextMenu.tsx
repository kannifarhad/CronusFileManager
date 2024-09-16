/* eslint-disable react/no-array-index-key */
import React, { memo } from "react";
import { Divider } from "@mui/material";
import {
  StyledContextMenu,
  StyledContextMenuItem,
} from "../../Elements/styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ContextMenuTypeEnum } from "../../types";
import useGenerateActionButtons from "../../Hooks/useGenerateActionButtons";

const ContextMenu: React.FC = () => {
  const state = useFileManagerState();
  const {
    operations: { handleContextClose },
    contextMenu,
  } = state;
  const { file: fileButtons, container: containerButtons } =
    useGenerateActionButtons({ state });

  if (!contextMenu) return null;

  return (
    <StyledContextMenu
      keepMounted
      open={Boolean(contextMenu)}
      onContextMenu={handleContextClose}
      onClose={handleContextClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu.mouseY !== null && contextMenu.mouseX !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      {contextMenu.menuType === ContextMenuTypeEnum.ITEM
        ? fileButtons.map((buttonGroup, index) => (
            <React.Fragment key={index}>
              {buttonGroup.map((button) => (
                <StyledContextMenuItem
                  key={button.title}
                  disabled={button.disabled}
                  onClick={(e) => {
                    handleContextClose();
                    button.onClick(e);
                  }}
                >
                  <span className={`${button.icon}`} />
                  {button.title}
                </StyledContextMenuItem>
              ))}
              {fileButtons.length !== index + 1 && <Divider />}
            </React.Fragment>
          ))
        : containerButtons.map((buttonGroup, index) => (
            <React.Fragment key={index}>
              {buttonGroup.map((button) => (
                <StyledContextMenuItem
                  key={button.title}
                  disabled={button.disabled}
                  onClick={(e) => {
                    button.onClick(e);
                    handleContextClose();
                  }}
                >
                  <span className={`${button.icon}`} />
                  {button.title}
                </StyledContextMenuItem>
              ))}
              {containerButtons.length !== index + 1 && <Divider />}
            </React.Fragment>
          ))}
    </StyledContextMenu>
  );
};

export default memo(ContextMenu);
