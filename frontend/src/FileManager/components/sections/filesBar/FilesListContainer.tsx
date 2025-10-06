import React, { memo, useCallback, type MouseEvent } from "react";
import ViewItems from "../viewItems/ViewItems";
import { StyledFilesListContainer, StyledFilesListWrapper } from "./styled";
import OverlayBlocks from "./OverlayBlocks";
import { useFileManagerState } from "../../../store/FileManagerContext";
import { ContextMenuTypeEnum } from "../../../types";
import { StyledEmptyFolderContainer } from "../viewItems/styled";
import useText from "../../../utils/hooks/useTexts";

const ContainerBar: React.FC = () => {
  const {
    operations: { handleContextClick },
    selectedFolder,
    search,
  } = useFileManagerState();
  const texts = useText();

  const handleContextMenuClick = useCallback(
    (event: MouseEvent) => {
      handleContextClick({
        item: null,
        event,
        menuType: ContextMenuTypeEnum.CONTENT,
      });
    },
    [handleContextClick]
  );

  if (!selectedFolder && !search.text) {
    return (
      <StyledEmptyFolderContainer>
        <h6>{texts.selectFolderWarn}</h6>
      </StyledEmptyFolderContainer>
    );
  }

  return (
    <StyledFilesListWrapper>
      <OverlayBlocks />
      <StyledFilesListContainer onContextMenu={handleContextMenuClick}>
        <ViewItems />
      </StyledFilesListContainer>
    </StyledFilesListWrapper>
  );
};

export default memo(ContainerBar);
