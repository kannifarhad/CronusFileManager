import React, { useState, useEffect } from "react";
import { StyledFolderBar } from "./styled";
import MenuItem from "./MenuItem";
import { FolderList } from "../../types";
import {
  useFileManagerState,
  useFileManagerDispatch,
  FileManagerProvider,
  
} from "../../ContextStore/FileManagerContext";
import { getFoldersList } from "../../Api/fileManagerServices";
import { ActionTypes } from '../../ContextStore/types';

const FolderBar = ({
  foldersList,
  onFolderClick,
  selectedFolder,
}: {
  foldersList: FolderList;
  onFolderClick: (value: string, history?: boolean) => void;
  selectedFolder: string;
}) => {
  const dispatch = useFileManagerDispatch();
  const state = useFileManagerState();
  console.log('state', state);
  
  useEffect(() => {
    getFoldersList({ path: "/" }).then((result) => {
      dispatch({
        type: ActionTypes.SET_SELECTED_FOLDER,
        payload: result.path,
      });
    });
  }, []);

  return (
    <StyledFolderBar key={`folderRoot`}>
      <MenuItem
        item={foldersList}
        onFolderClick={onFolderClick}
        currentUrl={selectedFolder}
      />
    </StyledFolderBar>
  );
};
export default FolderBar;
