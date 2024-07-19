import React, { memo } from "react";
import GridView from "./GridView";
import ListView from "./ListView";

function ViewItems() {
  const itemsView = 'grid';
  return itemsView === "grid" ? <GridView /> : <ListView />;
}

export default memo(ViewItems);
