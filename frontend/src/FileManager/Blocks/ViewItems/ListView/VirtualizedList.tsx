import React, { memo } from "react";
// import {
//   AutoSizer,
//   Grid,
//   GridCellRenderer,
//   GridProps,
// } from "react-virtualized";
import { ItemsList, Items } from "../../../types";
import ListItemRender from "./ListItemRender";

// const VirtualizedTable = ({ items }: { items: ItemsList }) => {
//   const cellRenderer: GridCellRenderer = ({
//     columnIndex,
//     key,
//     rowIndex,
//     parent,
//   }) => {
//     // Type assertion for parent to include columnCount
//     const { columnCount } = parent.props as GridProps;

//     const itemIndex = rowIndex * columnCount + columnIndex;
//     if (itemIndex >= items.length) return null; // Skip rendering empty cells

//     const item = items[itemIndex];
//     return <ListItemRender item={item} key={key} />;
//   };

//   return (
//     <AutoSizer>
//       {({ width, height }) => {
//         const columnCount = Math.floor(width / ITEM_SIZE);
//         const rowCount = Math.ceil(items.length / columnCount);

//         return (
//           <Grid
//             cellRenderer={cellRenderer}
//             columnCount={columnCount}
//             columnWidth={ITEM_SIZE}
//             height={height}
//             rowCount={rowCount}
//             rowHeight={ITEM_SIZE}
//             width={width}
//           />
//         );
//       }}
//     </AutoSizer>
//   );
// };

const VirtualizedTable = ({ items }: { items: ItemsList }) => {
  return (
    <>
      {items.map((item: Items) => (
        <ListItemRender item={item} key={item.id} />
      ))}
    </>
  );
};
export default memo(VirtualizedTable);
