import React, { memo } from "react";
import { StyledFilesBarWrapper } from "./styled";
import StatusBar from "./StatusBar";
import FilesListContainer from "./FilesListContainer";

const FileBarWrapper: React.FC = () => {
  return (
    <StyledFilesBarWrapper size={16}>
      <FilesListContainer />
      <StatusBar />
    </StyledFilesBarWrapper>
  );
};

export default memo(FileBarWrapper);
