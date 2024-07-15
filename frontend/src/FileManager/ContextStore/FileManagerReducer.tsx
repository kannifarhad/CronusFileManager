import { sortFilter } from "../helpers";
import { FileManagerAction, FileManagerState, ActionTypes } from './types'

export const fileManagerReducer = (
  state: FileManagerState,
  action: FileManagerAction
): FileManagerState => {
  // console.log('action', action);
  switch (action.type) {
    case ActionTypes.SET_FOLDERS_LIST:
      return { ...state, foldersList: action.payload };

    case ActionTypes.SET_SELECTED_FOLDER: {
      let newHistory = { ...state.history };
      const {path, history, loading} = action.payload;
      if (!history) {
        newHistory.steps.push({
          action: "folderChange",
          path,
        });
        newHistory.currentIndex =
          newHistory.steps.length === 0 ? 0 : newHistory.steps.length - 1;
      }
      return {
        ...state,
        history: newHistory,
        selectedFolder: path,
        loading: loading !== undefined ? loading : state.loading
      };
    }

    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_FILES_LIST: {
      const { data, message, loading } = action.payload;
      let filesList = Array.isArray(data.children)
        ? data.children
        : [];
      filesList = sortFilter(filesList, state.orderFiles);
      return { 
        ...state, 
        filesList, 
        messages: [...state.messages, message],
        loading: loading !== undefined ? loading : state.loading
      };
    }

    case ActionTypes.SET_MESSAGES:
      return { ...state, messages: [...state.messages, action.payload ]};

    case ActionTypes.ADD_SELECTED_FILE:
      return { ...state, selectedFiles: [...state.selectedFiles, action.payload ]};
    
      

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

export default fileManagerReducer;
