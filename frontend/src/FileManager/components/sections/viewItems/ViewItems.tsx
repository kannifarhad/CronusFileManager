import React, { memo } from "react";
import GridView from "./gridLayout/GridView";
import ListView from "./listView/ListView";
import { ViewTypeEnum } from "../../../types";
import { useFileManagerState } from "../../../store/FileManagerContext";
import { Box } from "@mui/system";

const ViewItems: React.FC = () => {
  const { settings } = useFileManagerState();
  return settings.itemsViewType === ViewTypeEnum.GRID ? (
    <Box sx={{ padding: "5px", width: "100%", height: "100%", boxSizing: "border-box" }}>
      <GridView />
    </Box>
  ) : (
    <ListView />
  );
};

export default memo(ViewItems);
