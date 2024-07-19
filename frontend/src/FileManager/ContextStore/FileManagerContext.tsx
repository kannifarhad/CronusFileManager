import React, { createContext, useReducer, ReactNode } from "react";
import useGenerateActionButtons from "../Hooks/useGenerateActionButtons";
import { FileManagerAction, CreateContextType } from './types'
import fileManagerReducer from './FileManagerReducer';
import { ContextMenuTypeEnum, FolderType, ImagesThumbTypeEnum, Items, OrderByFieldEnum, OrderByType, SortByFieldEnum, ViewTypeEnum,} from "../types";
import { DropResult } from "react-beautiful-dnd";

const initialState: CreateContextType = {
  selectedFiles: new Set(),
  bufferedItems: { files: new Set([]), type: null },
  contextMenu: null, 
  messages: [],
  loading: false,
  selectedFolder: null,
  itemsViewType: ViewTypeEnum.GRID,
  showImages: ImagesThumbTypeEnum.ICONS,
  filesList: [],

  foldersList: null,
  history: { currentIndex: 0, steps: [] },
  orderFiles: {
    field: OrderByFieldEnum.NAME,
    orderBy: SortByFieldEnum.ASC,
  },
  popUpData: {
    open: false,
  },

  operations:{
    handleSelectFolder: (folder: FolderType, history?: boolean) => null,
    handleAddSelected: (item: Items) => null,
    handleContextClick: (args: { item: Items | null, event: React.MouseEvent, menuType: ContextMenuTypeEnum}) => null,
    handleClearBuffer: ()=> null,
    handleContextClose: (event: React.MouseEvent) => null,
    handleDragEnd: (result: DropResult) => null,
    handleSetViewItemType: (view: ViewTypeEnum)=> null,
    handleSetOrder: (order: OrderByType)=> null,
    handleSetThumbView: (view: ImagesThumbTypeEnum)=> null,

    handleUnsetSelected: () => null,
    handleInverseSelected: () => null,
    handleSelectAll: () => null,
    handleGotoParent: () => null,
    handleGoBackWard: () => null,
    handleGoForWard: () => null,
    handleCopy: () => null,
    handleCut: () => null,
    handlePaste: () => null,
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
