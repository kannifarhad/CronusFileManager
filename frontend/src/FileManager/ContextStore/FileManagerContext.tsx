import React, { createContext, useReducer, ReactNode, useMemo } from "react";
import useFileManagerOperations from "../Hooks/useFileManagerOperations";
import {
  FileManagerAction,
  CreateContextType,
  ImagesThumbTypeEnum,
  FileManagerState,
  OrderByFieldEnum,
  SortByFieldEnum,
  ViewTypeEnum,
  VolumeListType,
} from "../types";
import fileManagerReducer from "./FileManagerReducer";
import { readJsonFromLocalStorage } from "../helpers";
import { LOCASTORAGE_SETTINGS_KEY } from "../config";

const settingsInitalState = {
  selectedTheme: null,
  itemsViewType: ViewTypeEnum.GRID,
  showImages: ImagesThumbTypeEnum.ICONS,
  orderFiles: {
    field: OrderByFieldEnum.NAME,
    orderBy: SortByFieldEnum.ASC,
  },
};
export const initialState = {
  selectedFiles: new Set([]),
  bufferedItems: { files: new Set([]), type: null },
  contextMenu: null,
  messages: [],
  loading: false,
  selectedFolder: null,
  filesList: [],
  foldersList: null,
  history: { currentIndex: 0, steps: [] },
  popUpData: null,
  fileEdit: null,
  fullScreen: false,
  uploadPopup: null,
  volumesList: [],
  selectedVolume: null,
  settings: {
    ...settingsInitalState,
    ...readJsonFromLocalStorage<FileManagerState["settings"]>(
      LOCASTORAGE_SETTINGS_KEY
    ),
  },
};

const FileManagerStateContext = createContext<CreateContextType | undefined>(
  undefined
);
const FileManagerDispatchContext = createContext<
  React.Dispatch<FileManagerAction>
>(() => {});

export function FileManagerProvider({
  children,
  selectItemCallback,
  volumesList,
}: {
  children: ReactNode;
  selectItemCallback: ((filePath: string) => void) | undefined;
  volumesList: VolumeListType;
}) {
  const [state, dispatch] = useReducer(fileManagerReducer, {
    ...initialState,
    volumesList,
  });
  const operations = useFileManagerOperations({
    dispatch,
    selectItemCallback,
    selectedVolume: state.selectedVolume,
  });
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
