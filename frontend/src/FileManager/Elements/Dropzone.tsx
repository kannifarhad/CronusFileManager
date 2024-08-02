import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ButtonList from './ButtonGroupSimple';
import { formatBytes } from '../../Utils/Utils';
import { StyledDropZoneSection, StyledAcceptedFilesList } from './styled';
import { useFileManagerState } from "../ContextStore/FileManagerContext";

interface FileWithPreview extends File {
  preview: string;
}

export default function UploadFiles() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { operations: {}, selectedFolder } = useFileManagerState();
  const handleCancel = () => {};

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 
      'image/*': [],
      'text/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
    onDrop: (acceptedFiles: File[]) => {
      console.log('acceptedFiles', acceptedFiles);
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    console.log(newFiles, files);
    setFiles(newFiles);
  };

  const acceptedFiles = files.map((file, index) => (
    <li key={file.name}>
      {file.name} - {formatBytes(file.size)}
      <button onClick={() => removeFile(index)}>
        <span>Remove</span>
      </button>
    </li>
  ));

  const handleSubmitUpload = () => {
    const formData = new FormData();
    formData.append('path', selectedFolder?.path!);
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
    // props.uploadFile(formData).then(()=>{
    //   props.handleReload();
    //   handleCancel();
    // });
  };

  const handleCancelUpload = () => {
    handleCancel();
  };

  const buttons = [
    {
      name: 'submit',
      icon: 'icon-save',
      label: 'Upload Files To Server',
      class: 'green',
      onClick: handleSubmitUpload,
      disabled: !(files.length > 0)
    },
    {
      name: 'submit',
      icon: 'icon-ban',
      label: 'Cancel',
      type: 'link',
      onClick: handleCancelUpload
    }
  ];

  useEffect(() => {
    return () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <StyledDropZoneSection>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <StyledAcceptedFilesList>{acceptedFiles}</StyledAcceptedFilesList>
      <ButtonList buttons={buttons} />
    </StyledDropZoneSection>
  );
}
