import React, { createContext, useReducer, ReactNode } from "react";
import useGenerateActionButtons from "../Hooks/useGenerateActionButtons";
import { FileManagerAction, CreateContextType } from './types'
import fileManagerReducer from './FileManagerReducer';
import { Items } from "../types";

const initialState: CreateContextType = {
  selectedFiles: new Set(),
  bufferedItems: { files: new Set([]), type: null },
  foldersList: null,
  history: { currentIndex: 0, steps: [] },
  selectedFolder: "/",
  filesList: [],
  itemsView: "list",
  showImages: "icons",
  orderFiles: {
    field: "name",
    orderBy: "asc",
  },
  loading: false,
  popUpData: {
    open: false,
  },
  messages: [],
  operations:{
    handleSelectFolder: (value: string, history?: boolean) => null,
    handleAddSelected: (item: Items) => null,
    handleUnsetSelected: () => null,
    handleInverseSelected: () => null,
    handleSelectAll: () => null,
    handleGotoParent: () => null,
    handleGoBackWard: () => null,
    handleGoForWard: () => null,
    handleCopy: () => null,
    handleCut: () => null,
    handlePaste: () => null,
    handleSetMainFolder: (value: string, history?: boolean) => null,
    handleDelete: () => null,
    handleEmptyFolder: () => null,
    handleNewFile: () => null,
    handleNewFolder: () => null,
    handleRename: () => null,
    handleDuplicate: () => null,
    handleReload: () => null,
    handleCreateZip: () => null,
    handleExtractZip: () => null,
    handleEdit: () => null,
  },
  aviableButtons :{
    topbar: [],
    file: [],
    container: [],
  }
};


const FileManagerStateContext = createContext<CreateContextType>(initialState);
const FileManagerDispatchContext = createContext<
  React.Dispatch<FileManagerAction>
>(() => {});


export const FileManagerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(fileManagerReducer, initialState);
  const { aviableButtons, operations } = useGenerateActionButtons({ dispatch });

  return (
    <FileManagerStateContext.Provider value={{ ...state, aviableButtons, operations }}>
      <FileManagerDispatchContext.Provider value={dispatch}>
        {children}
      </FileManagerDispatchContext.Provider>
    </FileManagerStateContext.Provider>
  );
};

export const useFileManagerState = () => {
  const context = React.useContext(FileManagerStateContext);
  if (context === undefined) {
    throw new Error(
      "useFileManagerState must be used within a FileManagerProvider"
    );
  }
  return context;
};

export const useFileManagerDispatch = () => {
  const context = React.useContext(FileManagerDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useFileManagerDispatch must be used within a FileManagerProvider"
    );
  }
  return context;
};
