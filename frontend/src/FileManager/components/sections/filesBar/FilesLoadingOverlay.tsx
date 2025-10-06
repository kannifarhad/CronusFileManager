import { memo, type FC } from "react";
import { StyledFilesLoadingOverlay } from "./styled";
import { useFileManagerState } from "../../../store/FileManagerContext";
import useText from "../../../utils/hooks/useTexts";

const FilesLoadingOverlay: FC = () => {
  const { loading } = useFileManagerState();
  const texts = useText();

  if (!loading) return null;

  return (
    <StyledFilesLoadingOverlay>
      <div className="opaOverlaw">{texts.loading}</div>
    </StyledFilesLoadingOverlay>
  );
};

export default memo(FilesLoadingOverlay);
