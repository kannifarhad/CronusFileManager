import React, { FC } from "react";
import { List } from "@mui/material";
import MenuItem from "./MenuItem";
import { FolderList } from "../../types";

interface MenuSubmenuProps {
  item: FolderList;
  currentUrl: string;
  onFolderClick: (path: string) => void;
}

const MenuSubmenu: FC<MenuSubmenuProps> = ({
  item,
  currentUrl,
  onFolderClick,
}) => (
  <List className="folderSubmenu">
    {Array.isArray(item.children) &&
      item.children.map((child) => (
        <MenuItem
          key={child.name}
          item={child}
          onFolderClick={onFolderClick}
          currentUrl={currentUrl}
        />
      ))}
  </List>
);

export default MenuSubmenu;
