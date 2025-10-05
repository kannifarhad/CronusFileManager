import { memo, useCallback, useEffect } from "react";
import Dropzone from "../../Elements/Dropzone";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

function DropZoneWrapper() {
  const {
    uploadPopup,
    operations: { handleToggleUploadPopUp },
  } = useFileManagerState();

  const handleDragEnter = useCallback(() => {
    handleToggleUploadPopUp(true);
  }, [handleToggleUploadPopUp]);

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
    };
  }, [handleDragEnter]);
  if (!uploadPopup) return null;

  return <Dropzone />;
}

export default memo(DropZoneWrapper);
