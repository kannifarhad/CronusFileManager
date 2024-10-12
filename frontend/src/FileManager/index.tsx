/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { memo, forwardRef, useImperativeHandle } from "react";
import { ThemeProvider } from "@mui/system";
import { FileManagerProps } from "./types";
import { FileManagerProvider } from "./ContextStore/FileManagerContext";
import customTheme from "./Themes/dark";
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
      <FileManagerProvider
        selectItemCallback={selectItemCallback}
        volumesList={volumesList}
      >
        <ThemeProvider theme={customTheme}>
          <FileManager height={height ?? 300} />
        </ThemeProvider>
      </FileManagerProvider>
    );
  }
);

export default memo(FileManagerWithProvider);
