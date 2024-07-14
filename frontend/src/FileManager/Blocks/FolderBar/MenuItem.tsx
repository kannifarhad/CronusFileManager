import { useState, useRef, FC, memo } from "react";
import { ListItem } from "@mui/material";
import MenuSubmenu from "./MenuSubmenu";
import { StyledFolderMenuItem } from "./styled";
import { FolderList } from "../../types";

interface MenuItemProps {
  item: FolderList | null;
  currentUrl: string;
  onFolderClick: (path: string) => void;
}

const MenuItem: FC<MenuItemProps> = ({ item, currentUrl, onFolderClick }) => {
  const asideLeftLIRef = useRef<HTMLLIElement>(null);
  const [expand, setExpand] = useState(false);

  if (!item) return null;
  
  const mouseClick = () => {
    onFolderClick(item.path);
  };

  const handleExpand = () => {
    setExpand(!expand);
  };

  const isMenuItemIsActive = (item: FolderList): boolean => {
    if (item.children && item.children.length > 0) {
      return isMenuRootItemIsActive(item);
    }
    return currentUrl.indexOf(item.path) !== -1;
  };

  const isMenuRootItemIsActive = (item: FolderList): boolean => {
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
      <ListItem button className="folderTitle">
      {hasChildren && <i className="icon-next iconArrow" onClick={handleExpand} />}
        <span className="titleWrap" onClick={mouseClick}>
          <i className={`${isActive ? 'icon-folder' : 'icon-folder-1'}`} />
          <span className="title">{item.name}</span>
        </span>
      </ListItem>

      {hasChildren && <MenuSubmenu
        item={item}
        onFolderClick={onFolderClick}
        currentUrl={currentUrl}
      />
      } 
    </StyledFolderMenuItem>
  );
};

export default memo(MenuItem);
