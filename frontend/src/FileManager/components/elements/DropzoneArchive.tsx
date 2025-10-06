/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ButtonList from "./ButtonGroupSimple";
import { formatBytes } from "../../helpers";
import { StyledDropZoneSection, StyledAcceptedFilesList } from "./styled";
import { useFileManagerState } from "../../store/FileManagerContext";

interface FileWithPreview extends File {
  preview: string;
  relativePath: string;
}

export default function UploadFiles() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const {
    // operations: {},
    selectedFolder,
  } = useFileManagerState();
  const handleCancel = () => {};

  const traverseFileTree = async (item: any, path: string = ""): Promise<FileWithPreview[]> =>
    new Promise((resolve, reject) => {
      if (item.isFile) {
        item.file((file: File) => {
          resolve([
            {
              ...file,
              relativePath: path + file.name,
              preview: URL.createObjectURL(file),
            } as FileWithPreview,
          ]);
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries: any[]) => {
          const promises = entries.map((entry) => traverseFileTree(entry, `${path + item.name}/`));
          const results = await Promise.all(promises);
          resolve(results.flat());
        });
      } else {
        reject("Unsupported item type");
      }
    });

  const onDrop = async (acceptedFiles: File[]) => {
    const filePromises = acceptedFiles.map((file) => {
      if ((file as any).webkitGetAsEntry) {
        const entry = (file as any).webkitGetAsEntry();
        return traverseFileTree(entry);
      }
      return Promise.resolve([
        {
          ...file,
          relativePath: file.name,
          preview: URL.createObjectURL(file),
        } as FileWithPreview,
      ]);
    });

    const newFiles = (await Promise.all(filePromises)).flat();
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "text/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
    onDrop,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const acceptedFiles = files.map((file, index) => (
    <li key={file.relativePath}>
      {file.relativePath} -{formatBytes(file.size)}
      <button onClick={() => removeFile(index)}>
        <span>Remove</span>
      </button>
    </li>
  ));

  const handleSubmitUpload = () => {
    const formData = new FormData();
    formData.append("path", selectedFolder?.path ?? "/");

    files.forEach((file) => {
      // Debugging: Log the file type
      console.log("Appending file:", file);

      // Ensure that `file` is indeed an instance of `File`
      if (file instanceof File) {
        formData.append("files", file, file.relativePath);
      } else {
        console.error("Invalid file type:", file);
      }
    });

    // Debugging: Log FormData contents
    console.log("FormData contents:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Uncomment to handle file upload
    // props.uploadFile(formData).then(() => {
    //   props.handleReload();
    //   handleCancel();
    // });
  };

  const handleCancelUpload = () => {
    handleCancel();
  };

  const buttons = [
    {
      name: "submit",
      icon: "icon-save",
      label: "Upload Files To Server",
      class: "green",
      onClick: handleSubmitUpload,
      disabled: !(files.length > 0),
    },
    {
      name: "submit",
      icon: "Ban",
      label: "Cancel",
      type: "link",
      onClick: handleCancelUpload,
    },
  ];

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <StyledDropZoneSection>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} data-webkitdirectory="true" />
        <p>Drag 'n' drop some files or folders here, or click to select files</p>
      </div>
      <StyledAcceptedFilesList>{acceptedFiles}</StyledAcceptedFilesList>
      <ButtonList buttons={buttons} />
    </StyledDropZoneSection>
  );
}
