/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import React, { memo } from "react";
import FolderItem from "./ListFolderItem";
import FileItem from "./ListFileItem";
import { Items, ItemType } from "../../../types";

const ListItemRender = ({ item, style }: { item: Items }) =>
  item.type === ItemType.FOLDER ? (
    <FolderItem key={item.id} item={item} style={style} />
  ) : item.type === ItemType.FILE ? (
    <FileItem key={item.id} item={item} style={style} />
  ) : null;

export default memo(ListItemRender);
