import React, { useEffect, memo } from "react";
import {
  StyledFolderBar,
  FileManagerFolderBarGrid,
  FileManagerFolderBarWrapper,
} from "./styled";
import MenuItem from "./MenuItem";
import {
  useFileManagerState,
} from "../../ContextStore/FileManagerContext";

function FolderBar() {
  const { foldersList, operations:{ handleReloadFolderTree } } = useFileManagerState();

  useEffect(() => {
    handleReloadFolderTree();
  }, [handleReloadFolderTree]);

  return (
    <FileManagerFolderBarGrid item xs={3} sm={2}>
      <FileManagerFolderBarWrapper>
        <StyledFolderBar key="folderRoot">
          <MenuItem item={foldersList} />
        </StyledFolderBar>
      </FileManagerFolderBarWrapper>
    </FileManagerFolderBarGrid>
  );
}
export default memo(FolderBar);
