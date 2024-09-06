import React, { memo, useCallback, MouseEvent } from "react";
import ViewItems from "../ViewItems/ViewItems";
import { StyledFilesListContainer, StyledFilesListWrapper } from "./styled";
import OverlayBlocks from "./OverlayBlocks";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ContextMenuTypeEnum } from "../../types";

const ContainerBar: React.FC = () => {
  const {
    operations: { handleContextClick },
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
