import React, { memo, forwardRef, useImperativeHandle } from "react";
import type { FileManagerProps } from "./types";
import { FileManagerProvider } from "./ContextStore/FileManagerContext";
import FileManager from "./FileManager";

const FileManagerWithProvider: React.FC<FileManagerProps> = forwardRef(
  ({ selectItemCallback, height, volumesList }, ref) => {
    useImperativeHandle(ref, () => ({
      refresh: () => {
        console.log("refresh requested");
      },
    }));
    console.log("FileManagerWithProvider rerender");

    return (
      <FileManagerProvider selectItemCallback={selectItemCallback} volumesList={volumesList}>
        <FileManager height={height ?? 300} />
      </FileManagerProvider>
    );
  }
);

export default memo(FileManagerWithProvider);
