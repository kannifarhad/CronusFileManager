import React, { memo } from "react";
import GridView from "./GridView/GridView";
import ListView from "./ListView/ListView";
import { ViewTypeEnum } from "../../types";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { StyledEmptyFolderContainer } from "./styled";

const ViewItems: React.FC = () => {
  const { itemsViewType, selectedFolder } = useFileManagerState();
  if (!selectedFolder) {
    return (
      <StyledEmptyFolderContainer>
        <h6>Please select folder to view!</h6>
      </StyledEmptyFolderContainer>
    );
  }
  return itemsViewType === ViewTypeEnum.GRID ? <GridView /> : <ListView />;
};

export default memo(ViewItems);
