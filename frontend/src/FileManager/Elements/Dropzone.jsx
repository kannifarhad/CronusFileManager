import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import ButtonList from './ButtonGroupSimple';
import {formatBytes} from '../../Utils/Utils';
import {StyledDropZoneSection, StyledAcceptedFilesList} from './styled';

export default function UploadFiles(props) {
    const {handleCancel} = props;
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            console.log('acceptedFiles', acceptedFiles);
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        }
    });
  
  const removeFile = index => {
    var newFiles = [...files];
    newFiles.splice(index, 1);
    console.log(newFiles, files);
    setFiles(newFiles);
  }

  const acceptedFiles = files.map((file, index) => 
    <li key={file.path}>
      {file.name} - {formatBytes(file.size)} ( <button onClick={()=>removeFile(index)}><span>Remove</span></button>)
    </li>
  );
  
  const handleSubmitUpload = () =>{
    var formData = new FormData();
    formData.append('path', props.currentFolder);
    files.map((file) => {
      formData.append('files', file, file.name);
    });
    props.uploadFile(formData).then(()=>{
      props.handleReload();
      handleCancel();
    });
  }

  const handleCancelUpload = () =>{
    handleCancel();
  }
  
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

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <StyledDropZoneSection>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <StyledAcceptedFilesList>
        {acceptedFiles}
      </StyledAcceptedFilesList>
      <ButtonList buttons={buttons} />
    </StyledDropZoneSection>
  );
}