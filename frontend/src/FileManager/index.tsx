import React, { memo, forwardRef, useImperativeHandle } from "react";
import { ThemeProvider } from "@mui/system";
import { FileManagerProps } from "./types";
import { FileManagerProvider } from "./ContextStore/FileManagerContext";
import customTheme from "./theme";
import FileManager from "./FileManager";

const FileManagerWithProvider: React.FC<FileManagerProps> = forwardRef(
  (props, ref) => {
    const { selectItemCallback, height } = props;
    useImperativeHandle(ref, () => ({
      refresh: () => {
        console.log("refresh requested");
      },
    }));

    return (
      <ThemeProvider theme={customTheme}>
        <FileManagerProvider selectItemCallback={selectItemCallback}>
          <FileManager height={height ?? 300} />
        </FileManagerProvider>
      </ThemeProvider>
    );
  },
);

export default memo(FileManagerWithProvider);
