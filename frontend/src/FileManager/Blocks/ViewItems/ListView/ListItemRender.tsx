/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import React, { memo } from "react";
import FolderItem from "./ListFolderItem";
import FileItem from "./ListFileItem";
import { Items, ItemType } from "../../../types";

const ListItemRender = ({ item }: { item: Items }) =>
  item.type === ItemType.FOLDER ? (
    <FolderItem key={item.id} item={item} />
  ) : item.type === ItemType.FILE ? (
    <FileItem key={item.id} item={item} />
  ) : null;

export default memo(ListItemRender);
