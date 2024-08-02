import { useEffect, memo } from "react";
import { StyledFolderBar } from "./styled";
import MenuItem from "./MenuItem";
import {
  useFileManagerState,
  useFileManagerDispatch,  
} from "../../ContextStore/FileManagerContext";
import { getFolderTree } from "../../Api/fileManagerServices";
import { ActionTypes } from '../../ContextStore/types';
import {
  FileManagerFolderBarGrid,
  FileManagerFolderBarWrapper,
} from "./styled";

const FolderBar = () => {
  const dispatch = useFileManagerDispatch();
  const { foldersList }  = useFileManagerState();
  
  useEffect(() => {
      getFolderTree().then((result) => {
        dispatch({
          type: ActionTypes.SET_FOLDERS_LIST,
          payload: result,
        });
      });
    
  }, [dispatch]);

  return (
      <FileManagerFolderBarGrid item xs={3} sm={2}>
        <FileManagerFolderBarWrapper>
          <StyledFolderBar key={`folderRoot`}>
            <MenuItem item={foldersList} />
          </StyledFolderBar>
        </FileManagerFolderBarWrapper>
    </FileManagerFolderBarGrid>

  );
};
export default memo(FolderBar);
