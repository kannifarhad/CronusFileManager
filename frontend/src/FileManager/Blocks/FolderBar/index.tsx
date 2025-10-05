import { memo } from "react";
import { StyledFolderBar, FileManagerFolderBarGrid, FileManagerFolderBarWrapper } from "./styled";
import VolumesList from "./VolumesList";

function FolderBar() {
  return (
    <FileManagerFolderBarGrid item xs={8} sm={4}>
      <FileManagerFolderBarWrapper>
        <StyledFolderBar key="folderRoot">
          <VolumesList />
        </StyledFolderBar>
      </FileManagerFolderBarWrapper>
    </FileManagerFolderBarGrid>
  );
}
export default memo(FolderBar);
