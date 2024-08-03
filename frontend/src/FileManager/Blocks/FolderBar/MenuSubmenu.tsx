import React, { FC } from "react";
import { List } from "@mui/material";
import MenuItem from "./MenuItem";
import { FolderList, FolderType } from "../../types";

interface MenuSubmenuProps {
  folderList: FolderList["children"];
}

const MenuSubmenu: FC<MenuSubmenuProps> = ({ folderList }) => (
  <List className="folderSubmenu">
    {Array.isArray(folderList) &&
      folderList.map((child) => <MenuItem key={child.name} item={child} />)}
  </List>
);

export default MenuSubmenu;
