import React, { memo, useCallback, MouseEvent } from "react";
import ViewItems from "../ViewItems/ViewItems";
import { StyledFilesListContainer, StyledFilesListWrapper } from "./styled";
import OverlayBlocks from "./OverlayBlocks";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ContextMenuTypeEnum } from "../../types";
import { StyledEmptyFolderContainer } from "../ViewItems/styled";

const ContainerBar: React.FC = () => {
  const {
    operations: { handleContextClick },
    selectedFolder,
  } = useFileManagerState();

  const handleContextMenuClick = useCallback(
    (event: MouseEvent) => {
      handleContextClick({
        item: null,
        event,
        menuType: ContextMenuTypeEnum.CONTENT,
      });
    },
    [handleContextClick],
  );

  if (!selectedFolder) {
    return (
      <StyledEmptyFolderContainer>
        <h6>Please select folder to view!</h6>
      </StyledEmptyFolderContainer>
    );
  }

  return (
    <StyledFilesListWrapper>
      <StyledFilesListContainer onContextMenu={handleContextMenuClick}>
        <OverlayBlocks />
        <ViewItems />
      </StyledFilesListContainer>
    </StyledFilesListWrapper>
  );
};

export default memo(ContainerBar);
