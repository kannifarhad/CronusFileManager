import React, { memo } from "react";
import GridView from "./GridView/GridView";
import ListView from "./ListView/ListView";
import { ViewTypeEnum } from "../../types";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

const ViewItems: React.FC = () => {
  const { settings } = useFileManagerState();
  return settings.itemsViewType === ViewTypeEnum.GRID ? (
    <GridView />
  ) : (
    <ListView />
  );
};

export default memo(ViewItems);
