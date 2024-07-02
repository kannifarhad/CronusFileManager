import React, { useState, useEffect } from "react";
import { StyledFolderBar } from "./styled";
import MenuItem from "./MenuItem";
import { FolderList } from "../../types";
const FolderBar = ({
  foldersList,
  onFolderClick,
  selectedFolder,
}: {
  foldersList: FolderList;
  onFolderClick: (value: string, history?: boolean) => void;
  selectedFolder: string;
}) => {

  useEffect(() => {
    // getFoldersList({ path: "/" }).then((result) => {
    //   dispatch({
    //     type: ActionTypes.SET_SELECTED_FOLDER,
    //     payload: result.data.path,
    //   });
    // });
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
