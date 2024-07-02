import Dropzone from "../../Elements/Dropzone";

function DropZoneWrapper(props) {
  const { selectedFolder, operations, uploadFile, uploadBox } = props;

  if (!uploadBox) return null;
  return (
    <Dropzone
      currentFolder={selectedFolder}
      handleReload={operations.handleReload}
      uploadFile={uploadFile}
      handleCancel={operations.handleUpload}
    />
  );
}

export default memo(DropZoneWrapper);
