import React, { createContext, useReducer, ReactNode } from "react";
import { sortFilter } from "./helpers";

interface FileManagerState {
  selectedFiles: string[];
  bufferedItems: { files: string[]; type: string };
  foldersList: any[];
  history: { currentIndex: number; steps: any[] };
  selectedFolder: string;
  filesList: any[];
  itemsView: string;
  showImages: string;
  orderFiles: { field: string; orderBy: string };
}

interface FileManagerAction {
  type: string;
  payload?: any;
}

const initialState: FileManagerState = {
  selectedFiles: [],
  bufferedItems: { files: [], type: "" },
  foldersList: [],
  history: { currentIndex: 0, steps: [] },
  selectedFolder: "",
  filesList: [],
  itemsView: "list",
  showImages: "icons",
  orderFiles: {
    field: "name",
    orderBy: "asc",
  },
};

const FileManagerStateContext = createContext<FileManagerState>(initialState);
const FileManagerDispatchContext = createContext<
  React.Dispatch<FileManagerAction>
>(() => {});

export enum ActionTypes {
  SET_SELECTED_FILES = "SET_SELECTED_FILES",
  UNSET_SELECTED_FILES = "UNSET_SELECTED_FILES",
  SELECT_ALL_FILES = "SELECT_ALL_FILES",
  INVERSE_SELECTED_FILES = "INVERSE_SELECTED_FILES",
  COPY_FILES_TOBUFFER = "COPY_FILES_TOBUFFER",
  CUT_FILES_TOBUFFER = "CUT_FILES_TOBUFFER",
  PASTE_FILES = "PASTE_FILES",
  SET_SELECTED_FOLDER = "SET_SELECTED_FOLDER",
  GET_FOLDERS_LIST = "GET_FOLDERS_LIST",
  GET_FILES_LIST = "GET_FILES_LIST",
  SET_HISTORY_INDEX = "SET_HISTORY_INDEX",
  SET_ITEM_VIEW = "SET_ITEM_VIEW",
  SET_SORT_ORDER_BY = "SET_SORT_ORDER_BY",
  RUN_SORTING_FILTER = "RUN_SORTING_FILTER",
  SET_IMAGE_SETTINGS = "SET_IMAGE_SETTINGS",
  CLEAR_FILES_TOBUFFER = "CLEAR_FILES_TOBUFFER",
}

const fileManagerReducer = (
  state: FileManagerState,
  action: FileManagerAction
): FileManagerState => {
  switch (action.type) {
    case ActionTypes.SET_IMAGE_SETTINGS:
      return { ...state, showImages: action.payload };

    case ActionTypes.RUN_SORTING_FILTER: {
      let sortedFiles = sortFilter(state.filesList, state.orderFiles);
      return { ...state, filesList: sortedFiles };
    }
    case ActionTypes.SET_SORT_ORDER_BY: {
      return {
        ...state,
        orderFiles: {
          field: action.payload.field,
          orderBy: action.payload.orderBy,
        },
      };
    }
    case ActionTypes.UNSET_SELECTED_FILES:
      return { ...state, selectedFiles: [] };

    case ActionTypes.SET_SELECTED_FILES: {
      let selectedFilesNew = [...state.selectedFiles];
      let index = selectedFilesNew.indexOf(action.payload.item);
      if (index !== -1) {
        selectedFilesNew.splice(index, 1);
      } else {
        selectedFilesNew = [...selectedFilesNew, action.payload.item];
      }
      return { ...state, selectedFiles: selectedFilesNew };
    }
    case ActionTypes.SELECT_ALL_FILES: {
      let newSelected = state.filesList.reduce(function (result, file) {
        if (file.private !== true) {
          result.push(file);
        }
        return result;
      }, []);
      return { ...state, selectedFiles: newSelected };
    }
    case ActionTypes.INVERSE_SELECTED_FILES: {
      let selectedFiles = state.selectedFiles;
      const inversedSelected = state.filesList.reduce((nextSelected, file) => {
        if (!selectedFiles.find((selectedFile) => selectedFile === file.id)) {
          nextSelected.push(file);
        }
        return nextSelected;
      }, []);

      return { ...state, selectedFiles: inversedSelected };
    }
    case ActionTypes.COPY_FILES_TOBUFFER: {
      let bufferedItems = {
        type: "copy",
        files: state.selectedFiles,
      };
      return { ...state, bufferedItems, selectedFiles: [] };
    }

    case ActionTypes.CUT_FILES_TOBUFFER: {
      let bufferedItems = {
        type: "cut",
        files: state.selectedFiles,
      };
      return { ...state, bufferedItems, selectedFiles: [] };
    }

    case ActionTypes.CLEAR_FILES_TOBUFFER: {
      let bufferedItems = {
        type: "",
        files: [],
      };
      return { ...state, bufferedItems };
    }

    case ActionTypes.PASTE_FILES: {
      let bufferedItems = {
        type: "",
        files: [],
      };
      return { ...state, bufferedItems };
    }

    case ActionTypes.SET_SELECTED_FOLDER: {
      let newHistory = { ...state.history };
      if (!action.payload.history) {
        newHistory.steps.push({
          action: "folderChange",
          path: action.payload.path,
        });
        newHistory.currentIndex =
          newHistory.steps.length === 0 ? 0 : newHistory.steps.length - 1;
      }
      return {
        ...state,
        history: newHistory,
        selectedFolder: action.payload.path,
      };
    }

    case ActionTypes.GET_FILES_LIST: {
      let filesList = Array.isArray(action.payload.data.children)
        ? action.payload.data.children
        : [];
      filesList = sortFilter(filesList, state.orderFiles);
      return { ...state, filesList };
    }

    case ActionTypes.GET_FOLDERS_LIST:
      return { ...state, foldersList: action.payload.data };

    case ActionTypes.SET_HISTORY_INDEX: {
      const newHistoryIndex = { ...state.history };
      newHistoryIndex.currentIndex = action.payload.index;
      return { ...state, history: newHistoryIndex };
    }
    case ActionTypes.SET_ITEM_VIEW:
      return { ...state, itemsView: action.payload.iew };

    default:
      return state;
  }
};

export const FileManagerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(fileManagerReducer, initialState);

  return (
    <FileManagerStateContext.Provider value={state}>
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
