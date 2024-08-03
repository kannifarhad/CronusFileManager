import { memo, FC } from "react";
import { StyledFilesLoadingOverlay } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

const FilesLoadingOverlay: FC = () => {
  const { loading } = useFileManagerState();

  if (!loading) return null;

  return (
    <StyledFilesLoadingOverlay>
      <div className="opaOverlaw" />
    </StyledFilesLoadingOverlay>
  );
};

export default memo(FilesLoadingOverlay);
