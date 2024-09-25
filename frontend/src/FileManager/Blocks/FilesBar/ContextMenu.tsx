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
import Icon from "../../Elements/Icon";

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
                  <Icon
                    name={button.icon}
                    color={button.disabled ? "#ccc" : "#556cd6"}
                    style={{ marginRight: "5px" }}
                    size={12}
                  />
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
                  onClick={(e: any) => {
                    button.onClick(e);
                    handleContextClose();
                  }}
                >
                  <Icon
                    name={button.icon}
                    color={button.disabled ? "#ccc" : "#556cd6"}
                    size={12}
                    style={{ marginRight: "5px" }}
                  />
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
