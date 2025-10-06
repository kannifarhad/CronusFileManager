import { memo } from "react";
import FolderItem from "./ListFolderItem";
import FileItem from "./ListFileItem";
import { type Items, ItemType } from "../../../../types";

const ListItemRender = ({ item, style }: { item: Items; style?: any }) =>
  item.type === ItemType.FOLDER ? (
    <FolderItem key={item.id} item={item} style={style} />
  ) : item.type === ItemType.FILE ? (
    <FileItem key={item.id} item={item} style={style} />
  ) : null;

export default memo(ListItemRender);
