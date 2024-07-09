import { memo } from "react";
import { StyledFilesLoadingOverlay } from "./styled";
function FilesLoadingOverlay(props) {
  const { isloading } = props;

  if (!isloading) return null;
  return (
    <StyledFilesLoadingOverlay>
      <div className="opaOverlaw"></div>
    </StyledFilesLoadingOverlay>
  );
}

export default memo(FilesLoadingOverlay);
