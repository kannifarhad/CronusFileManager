import React, { createContext, useReducer, ReactNode } from "react";
import { sortFilter } from "../helpers";
import useGenerateActionButtons from "../Hooks/useGenerateActionButtons";
import { FileManagerAction, FileManagerState, ActionTypes } from './types'

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
  loading: false,
  popUpData: {
    open: false,
  },
  messages: [],
};

const FileManagerStateContext = createContext<FileManagerState & {aviableButtons?:any, operations?: any}>(initialState);
const FileManagerDispatchContext = createContext<
  React.Dispatch<FileManagerAction>
>(() => {});

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
  const { aviableButtons, operations } = useGenerateActionButtons({});

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
