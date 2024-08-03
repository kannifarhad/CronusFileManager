import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import ButtonList, { ButtonGroupProps } from "./ButtonGroup";
import { formatBytes } from "../helpers";
import { StyledDropZoneSection, StyledAcceptedFilesList } from "./styled";
import { useFileManagerState } from "../ContextStore/FileManagerContext";

export interface FileWithPreview extends File {
  preview: string;
}

export default function UploadFiles() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
  });

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const acceptedFiles = useMemo(
    () =>
      files.map((file, index) => (
        <li key={file.name}>
          {file.name} -{formatBytes(file.size)}
          <button onClick={() => removeFile(index)}>
            <span>Remove</span>
          </button>
        </li>
      )),
    [files, removeFile],
  );

  const buttons: ButtonGroupProps["buttons"] = useMemo(
    () => [
      {
        icon: "icon-save",
        label: "Upload Files To Server",
        onClick: () => handleUploadFiles(files, selectedFolder!),
        disabled: !(files.length > 0),
        color: "success",
        variant: "outlined",
      },
      {
        icon: "icon-ban",
        label: "Cancel",
        color: "error",
        variant: "outlined",
        onClick: handleToggleUploadPopUp,
      },
    ],
    [handleUploadFiles, files, selectedFolder, handleToggleUploadPopUp],
  );

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  return (
    <StyledDropZoneSection>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <StyledAcceptedFilesList>{acceptedFiles}</StyledAcceptedFilesList>
      <ButtonList buttons={buttons} />
    </StyledDropZoneSection>
  );
}
