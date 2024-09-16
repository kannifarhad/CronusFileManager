import React, { createContext, useReducer, ReactNode, useMemo } from "react";
import useFileManagerOperations from "../Hooks/useFileManagerOperations";
import {
  FileManagerAction,
  CreateContextType,
  ImagesThumbTypeEnum,
  OrderByFieldEnum,
  SortByFieldEnum,
  ViewTypeEnum,
} from "../types";
import fileManagerReducer from "./FileManagerReducer";

const initialState = {
  selectedFiles: new Set([]),
  bufferedItems: { files: new Set([]), type: null },
  contextMenu: null,
  messages: [],
  loading: false,
  selectedFolder: null,
  itemsViewType: ViewTypeEnum.GRID,
  showImages: ImagesThumbTypeEnum.ICONS,
  filesList: [],
  orderFiles: {
    field: OrderByFieldEnum.NAME,
    orderBy: SortByFieldEnum.ASC,
  },
  foldersList: null,
  history: { currentIndex: 0, steps: [] },
  popUpData: null,
  fileEdit: null,
  fullScreen: false,
  uploadPopup: null,
};

const FileManagerStateContext = createContext<CreateContextType | undefined>(
  undefined,
);
const FileManagerDispatchContext = createContext<
  React.Dispatch<FileManagerAction>
>(() => {});

export function FileManagerProvider({
  children,
  selectItemCallback,
}: {
  children: ReactNode;
  selectItemCallback: ((filePath: string) => void) | undefined;
}) {
  const [state, dispatch] = useReducer(fileManagerReducer, initialState);
  const operations = useFileManagerOperations({ dispatch, selectItemCallback });
  const value = useMemo(() => ({ ...state, operations }), [state, operations]);

  return (
    <FileManagerStateContext.Provider value={value}>
      <FileManagerDispatchContext.Provider value={dispatch}>
        {children}
      </FileManagerDispatchContext.Provider>
    </FileManagerStateContext.Provider>
  );
}

export const useFileManagerState = () => {
  const context = React.useContext(FileManagerStateContext);
  if (context === undefined) {
    throw new Error(
      "useFileManagerState must be used within a FileManagerProvider",
    );
  }
  return context;
};

export const useFileManagerDispatch = () => {
  const context = React.useContext(FileManagerDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useFileManagerDispatch must be used within a FileManagerProvider",
    );
  }
  return context;
};
