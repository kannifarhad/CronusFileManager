import { memo } from "react";
import Dropzone from "../../Elements/Dropzone";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

function DropZoneWrapper() {
  const { uploadPopup } = useFileManagerState();

  if (!uploadPopup) return null;
  return <Dropzone />;
}

export default memo(DropZoneWrapper);
