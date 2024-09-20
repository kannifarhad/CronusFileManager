/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, FC, memo, useMemo } from "react";
import { ListItem } from "@mui/material";
import MenuSubmenu from "./MenuSubmenu";
import { StyledFolderMenuItem } from "./styled";
import { FolderList } from "../../types";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import Icon from "../../Elements/Icon";
import { classNames } from "../../helpers";

interface MenuItemProps {
  item: FolderList | null;
}

const isMenuItemIsActive = (
  item: FolderList,
  currentFolder: string = "",
): boolean => {
  // Helper function to recursively check for active state
  const isMenuRootItemIsActive = (curremtItem: FolderList): boolean => {
    // Check if the current item's path is exactly the currentFolder
    if (
      Boolean(currentFolder) &&
      currentFolder.indexOf(curremtItem.path) === 0
    ) {
      return true;
    }
    // Recursively check children
    if (Array.isArray(curremtItem.children)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const subItem of curremtItem.children) {
        if (isMenuItemIsActive(subItem, currentFolder)) {
          return true;
        }
      }
    }
    return false;
  };

  // Return the result of the helper function
  return isMenuRootItemIsActive(item);
};

const MenuItem: FC<MenuItemProps> = ({ item }) => {
  const {
    selectedFolder,
    operations: { handleSelectFolder },
  } = useFileManagerState();

  const asideLeftLIRef = useRef<HTMLLIElement>(null);
  const [expand, setExpand] = useState(false);

  const isActive = useMemo(
    () => item && isMenuItemIsActive(item, selectedFolder?.path),
    [item, selectedFolder?.path]
  );

  if (!item) return null;

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <StyledFolderMenuItem
      ref={asideLeftLIRef}
      className={classNames({
        folderItem: true,
        isOpen: (isActive && hasChildren) || expand,
        isActive: item.path === selectedFolder?.path,
        hasChildren,
      })}
    >
      <ListItem button className="folderTitle">
        <Icon
          name="Next"
          size={10}
          color="#ccc"
          className="iconArrow"
          onClick={() => setExpand(!expand)}
        />
        <span className="titleWrap" onClick={() => handleSelectFolder(item)}>
          <Icon name={`${isActive ? "FolderOpen" : "Folder"}`} />
          <span className="title">{item.name}</span>
        </span>
      </ListItem>
      {hasChildren && <MenuSubmenu folderList={item.children} />}
    </StyledFolderMenuItem>
  );
};

export default memo(MenuItem);
