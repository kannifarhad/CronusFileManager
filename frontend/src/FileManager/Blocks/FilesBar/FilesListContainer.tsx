import React, { memo, useCallback, MouseEvent } from "react";
import ViewItems from "../ViewItems/ViewItems";
import { StyledFilesListContainer, StyledFilesListWrapper } from "./styled";
import OverlayBlocks from "./OverlayBlocks";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ContextMenuTypeEnum } from "../../types";
import { StyledEmptyFolderContainer } from "../ViewItems/styled";
import useText from "../../Hooks/useTexts";

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
