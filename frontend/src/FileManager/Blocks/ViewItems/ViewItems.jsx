import React, { memo } from "react";
import GridView from "./GridView";
import ListView from "./ListView";

function ViewItems() {
  const itemsView = 'grid';
  // const {
  //   onContextMenuClick,
  //   addSelect,
  //   selectedFiles,
  //   bufferedItems,
  //   showImages,
  // } = props;
  // const classes = useStyles();


  // const handleContextMenuClick = async (item, event) => {
  //   addSelect(item);
  //   onContextMenuClick(event);
  // };

  // const checkIsSelected = (item) => {
  //   return selectedFiles.includes(item);
  // };

  // const isCuted = (item) => {
  //   if (bufferedItems.type === "cut") {
  //     return (
  //       bufferedItems.files.filter((file) => file.id === item.id).length > 0
  //     );
  //   }
  //   return false;
  // };

  // function getStyle(style, snapshot) {
  //   if (!snapshot.isDraggingOver) {
  //     return style;
  //   }
  //   return {
  //     ...style,
  //     background: "#f00 !important",
  //   };
  // }

  return itemsView === "grid" ? <GridView /> : <ListView />;
}

export default memo(ViewItems);
