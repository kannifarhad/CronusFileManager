import { memo, type CSSProperties } from "react";
import { Box } from "@mui/material";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import { type Items, ItemType } from "../../../../types";

const GridItemRender = ({ item, ...rest }: { item: Items; style?: CSSProperties }) => (
  <Box {...rest}>
    {item.type === ItemType.FOLDER ? (
      <FolderItem key={item.id} item={item} />
    ) : item.type === ItemType.FILE ? (
      <FileItem key={item.id} item={item} />
    ) : null}
  </Box>
);

export default memo(GridItemRender);
