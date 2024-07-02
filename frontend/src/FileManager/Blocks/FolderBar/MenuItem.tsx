import { useState, useRef, FC } from "react";
import { ListItem } from "@mui/material";
import MenuSubmenu from "./MenuSubmenu";
import { StyledFolderMenuItem } from "./styled";
import { FolderList } from "../../types";

interface MenuItemProps {
  item: FolderList;
  currentUrl: string;
  onFolderClick: (path: string) => void;
}

const MenuItem: FC<MenuItemProps> = ({ item, currentUrl, onFolderClick }) => {
  const asideLeftLIRef = useRef<HTMLLIElement>(null);
  const [expand, setExpand] = useState(false);

  const mouseClick = () => {
    onFolderClick(item.path);
  };

  const handleExpand = () => {
    setExpand(!expand);
  };

  const isMenuItemIsActive = (item: MenuItemProps["item"]): boolean => {
    if (item.children && item.children.length > 0) {
      return isMenuRootItemIsActive(item);
    }
    return currentUrl.indexOf(item.path) !== -1;
  };

  const isMenuRootItemIsActive = (item: MenuItemProps["item"]): boolean => {
    if (Array.isArray(item.children)) {
      for (const subItem of item.children) {
        if (isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    return false;
  };

  const isActive = isMenuItemIsActive(item);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  return (
    <StyledFolderMenuItem
      ref={asideLeftLIRef}
      className="folderItem"
      isOpen={(isActive && hasChildren) || expand}
      isActive={item.path === currentUrl}
    >
      {hasChildren ? (
        <>
          <ListItem button className="folderTitle">
            <i className="icon-next iconArrow" onClick={handleExpand} />
            <span className="titleWrap" onClick={mouseClick}>
              {isActive ? (
                <i className="icon-folder" />
              ) : (
                <i className="icon-folder-1" />
              )}
              <span className="title">{item.name}</span>
            </span>
          </ListItem>

          <MenuSubmenu
            item={item}
            onFolderClick={onFolderClick}
            // parentItem={item}
            currentUrl={currentUrl}
          />
        </>
      ) : (
        <ListItem button className="folderTitle">
          <span className="titleWrap" onClick={mouseClick}>
            <i className="icon-folder-1" />
            <span className="title">{item.name}</span>
          </span>
        </ListItem>
      )}
    </StyledFolderMenuItem>
  );
};

export default MenuItem;
