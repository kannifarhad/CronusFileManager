import React, { createContext, useReducer, ReactNode } from "react";
import useFileManagerOperations from "../Hooks/useFileManagerOperations";
import { FileManagerAction, CreateContextType } from './types'
import fileManagerReducer from './FileManagerReducer';
import { ContextMenuTypeEnum, FolderList, FolderType, HistoryType, ImagesThumbTypeEnum, Items, OrderByFieldEnum, OrderByType, SortByFieldEnum, ViewTypeEnum,} from "../types";
import { DropResult } from "react-beautiful-dnd";

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
  popUpData: {
    open: false,
  },
};


const FileManagerStateContext = createContext<CreateContextType | undefined>(undefined);
const FileManagerDispatchContext = createContext<
  React.Dispatch<FileManagerAction>
>(() => {});


export const FileManagerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(fileManagerReducer, initialState);
  const operations  = useFileManagerOperations({ dispatch });

  return (
    <FileManagerStateContext.Provider value={{ ...state, operations }}>
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
