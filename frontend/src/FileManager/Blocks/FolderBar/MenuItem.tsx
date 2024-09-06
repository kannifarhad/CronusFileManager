import React, { useState, useRef, FC, memo, useMemo } from "react";
import { ListItem } from "@mui/material";
import MenuSubmenu from "./MenuSubmenu";
import { StyledFolderMenuItem } from "./styled";
import { FolderList } from "../../types";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

interface MenuItemProps {
  item: FolderList | null;
}

const isMenuItemIsActive = (
  item: FolderList,
  currentFolder: string = ""
): boolean => {
  // Helper function to recursively check for active state
  const isMenuRootItemIsActive = (item: FolderList): boolean => {
    // Check if the current item's path is exactly the currentFolder
    if (Boolean(currentFolder) && currentFolder.indexOf(item.path) === 0) {
      return true;
    }
    // Recursively check children
    if (Array.isArray(item.children)) {
      for (const subItem of item.children) {
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
    [item, selectedFolder?.path],
  );

  if (!item) return null;

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <StyledFolderMenuItem
      ref={asideLeftLIRef}
      className="folderItem"
      isOpen={(isActive && hasChildren) || expand}
      isActive={item.path === selectedFolder?.path}
    >
      <ListItem button className="folderTitle">
        {hasChildren && (
          <i
            className="icon-next iconArrow"
            onClick={() => setExpand(!expand)}
          />
        )}
        <span className="titleWrap" onClick={() => handleSelectFolder(item)}>
          <i className={`${isActive ? "icon-folder" : "icon-folder-1"}`} />
          <span className="title">{item.name}</span>
        </span>
      </ListItem>
      {hasChildren && <MenuSubmenu folderList={item.children} />}
    </StyledFolderMenuItem>
  );
};

export default memo(MenuItem);
