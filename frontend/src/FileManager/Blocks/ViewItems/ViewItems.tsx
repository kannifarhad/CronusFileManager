import React, { memo } from "react";
import GridView from "./GridView";
import ListView from "./ListView";
import { ViewTypeEnum } from "../../types";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

const ViewItems: React.FC = () => {
  const { itemsViewType } = useFileManagerState();
  return itemsViewType === ViewTypeEnum.GRID ? <GridView /> : <ListView />;
};

export default memo(ViewItems);