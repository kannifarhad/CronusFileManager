import React, { memo } from "react";
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  GridProps,
} from "react-virtualized";
import { ItemsList } from "../../../types";
import GridItemRender from "./GridItemRender";
import { ITEM_SIZE } from "./GridView";

const VirtualizedGrid = ({ items }: { items: ItemsList }) => {
  const cellRenderer: GridCellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
    parent,
  }) => {
    // Type assertion for parent to include columnCount
    const { columnCount } = parent.props as GridProps;

    const itemIndex = rowIndex * columnCount + columnIndex;
    if (itemIndex >= items.length) return null; // Skip rendering empty cells

    const item = items[itemIndex];
    return <GridItemRender item={item} key={key} style={style} />;
  };

  return (
    <AutoSizer>
      {({ width, height }) => {
        const columnCount = Math.floor(width / ITEM_SIZE);
        const rowCount = Math.ceil(items.length / columnCount);

        return (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={columnCount}
            columnWidth={ITEM_SIZE}
            height={height}
            rowCount={rowCount}
            rowHeight={ITEM_SIZE}
            width={width}
            style={{ paddingBottom: "30px" }}
          />
        );
      }}
    </AutoSizer>
  );
};

export default memo(VirtualizedGrid);
