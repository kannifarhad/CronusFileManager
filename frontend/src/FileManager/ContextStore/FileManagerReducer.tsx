import { sortFilter } from "../helpers";
import { ItemMoveActionTypeEnum } from "../types";
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
      const {folder, history, loading} = action.payload;
      if (!history) {
        newHistory.steps.push({
          action: "folderChange",
          folder,
        });
        newHistory.currentIndex =
          newHistory.steps.length === 0 ? 0 : newHistory.steps.length - 1;
      }
      return {
        ...state,
        history: newHistory,
        selectedFolder: folder,
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

    case ActionTypes.REMOVE_MESSAGES:
      return { ...state, messages: state.messages.filter(message=> message.id !== action.payload.id)};

    case ActionTypes.ADD_SELECTED_FILE: {
      const item = action.payload;
      // Create a new Set based on the current state
      const selectedFilesNew = new Set(state.selectedFiles);
    
      // Add or remove the item from the new Set
      if (selectedFilesNew.has(item)) {
        selectedFilesNew.delete(item);
      } else {
        selectedFilesNew.add(item);
      }
      // Return the new state with the updated Set
      return { ...state, selectedFiles: selectedFilesNew };
    }
    
    case ActionTypes.SET_CONTEXT_MENU:
      return { ...state, contextMenu: action.payload };
      
    case ActionTypes.CLEAR_BUFFER: {
        const bufferedItems = {
          type: null,
          files: new Set(),
        };
        return { ...state, bufferedItems };
      }

    case ActionTypes.SET_ITEM_VIEW:
        return { ...state, itemsViewType: action.payload };

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
      return { ...state, selectedFiles: new Set() };

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
        if (!selectedFiles?.has(file)) {
          nextSelected.push(file);
        }
        return nextSelected;
      }, []);

      return { ...state, selectedFiles: inversedSelected };
    }
    case ActionTypes.COPY_FILES_TOBUFFER: {
      const bufferedItems = {
        type: ItemMoveActionTypeEnum.COPY,
        files: new Set(state.selectedFiles),
      };
      return { ...state, bufferedItems, selectedFiles: new Set() };
    }

    case ActionTypes.CUT_FILES_TOBUFFER: {
      const bufferedItems = {
        type: ItemMoveActionTypeEnum.CUT,
        files: new Set(state.selectedFiles),
      };
      return { ...state, bufferedItems, selectedFiles: new Set() };
    }


    case ActionTypes.SET_HISTORY_INDEX: {
      const newHistoryIndex = { ...state.history };
      newHistoryIndex.currentIndex = action.payload.index;
      return { ...state, history: newHistoryIndex };
    }

    default:
      return state;
  }
};

export default fileManagerReducer;
