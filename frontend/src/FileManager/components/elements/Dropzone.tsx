import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import ButtonList, { type ButtonItemType } from "./ButtonGroup";
import { type DroppedFile, organizeFiles } from "../../utils/helpers";
import { StyledDropZoneSection, StyledAcceptedFilesList } from "./styled";
import { useFileManagerState } from "../../store/FileManagerContext";
import DropzoneFileList from "./DropzoneFileList";

export default function UploadFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const {
    operations: { handleUploadFiles, handleToggleUploadPopUp },
    selectedFolder,
  } = useFileManagerState();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "text/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const removeFolder = useCallback((path: string) => {
    setFiles((prev) => {
      const regex = new RegExp(`${path}(\\/|[^\\s]+)`);
      return prev.filter((file: any) => {
        if (file?.path) {
          return !regex.test(file.path);
        }
        return true;
      });
    });
  }, []);

  const acceptedFiles = useMemo(() => {
    const fileTree = organizeFiles(files as unknown as DroppedFile[]);
    return <DropzoneFileList tree={fileTree} onRemove={removeFile} onRemoveFolder={removeFolder} />;
  }, [files, removeFile, removeFolder]);

  const buttons: ButtonItemType[] = useMemo(
    () => [
      {
        icon: "Save",
        label: "Upload Files To Server",
        onClick: () => handleUploadFiles(files, selectedFolder!),
        disabled: !(files.length > 0),
        color: "success",
        variant: "outlined",
      },
      {
        icon: "Ban",
        label: "Cancel",
        color: "error",
        variant: "outlined",
        onClick: () => handleToggleUploadPopUp(),
      },
    ],
    [handleUploadFiles, files, selectedFolder, handleToggleUploadPopUp]
  );

  return (
    <StyledDropZoneSection>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag `&apos;n`&apos; drop some files here, or click to select files</p>
      </div>
      <StyledAcceptedFilesList>{acceptedFiles}</StyledAcceptedFilesList>
      <ButtonList buttons={buttons} />
    </StyledDropZoneSection>
  );
}
