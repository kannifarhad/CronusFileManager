import { sortFilter } from "../helpers";
import { ItemMoveActionTypeEnum, HistoryStepTypeEnum } from "../types";
import { FileManagerAction, FileManagerState, ActionTypes } from './types'

export const fileManagerReducer = (
  state: FileManagerState,
  action: FileManagerAction
): FileManagerState => {
  switch (action.type) {
    case ActionTypes.SET_FOLDERS_LIST:
      return { ...state, foldersList: action.payload };

    case ActionTypes.SET_SELECTED_FOLDER: {
      const {folder, history, loading, clearBuffer} = action.payload;
      const newState = {
        ...state,
        selectedFolder: folder,
        loading: loading !== undefined ? loading : state.loading
      };

      if (!history) {
        newState.history.steps.push({
          action: HistoryStepTypeEnum.FOLDERCHANGE,
          payload: folder,
        });
        newState.history.currentIndex = Math.max(0, newState.history.steps.length - 1);
      }
      if(clearBuffer){
        newState.bufferedItems = {
          type: null,
          files: new Set([]),
        };
        newState.selectedFiles = new Set([])
      }
      return newState;
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
        messages: Boolean(message) ? [...state.messages, message] : state.messages,
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
          files: new Set([]),
        };
        return { ...state, bufferedItems };
      }

    case ActionTypes.SET_ITEM_VIEW:
        return { ...state, itemsViewType: action.payload };
    case ActionTypes.SET_POPUP_DATA:
          return { ...state, popUpData: action.payload };

    case ActionTypes.SET_IMAGE_SETTINGS:
        return { ...state, showImages: action.payload };
    
    case ActionTypes.UNSET_SELECTED_FILES:
      return { ...state, selectedFiles: new Set() };

    case ActionTypes.SELECT_ALL_FILES: {
      const newSelected = state.filesList.filter(file => !file.private);
      return {
        ...state,
        selectedFiles: new Set(newSelected),
      };
    }

    case ActionTypes.INVERSE_SELECTED_FILES: {
      const selectedFiles = state.selectedFiles;
      const inversedSelected = state.filesList.filter(file => !selectedFiles.has(file));
      return {
        ...state,
        selectedFiles: new Set(inversedSelected),
      };
    }

    case ActionTypes.SET_SORT_ORDER_BY: {
      return {
        ...state,
        filesList: sortFilter(state.filesList, state.orderFiles),
        orderFiles: {
          field: action.payload.field,
          orderBy: action.payload.orderBy,
        },
      };
    }
    case ActionTypes.SET_HISTORY_INDEX: {
      return { ...state, history: { ...state.history, currentIndex: action.payload.index}};
    }
    case ActionTypes.COPY_FILES_TOBUFFER: {
      const files = state.selectedFiles.size > 0 ? state.selectedFiles : state.contextMenu?.item ? new Set([state.contextMenu?.item]): new Set([]);
      const bufferedItems = {
        type: ItemMoveActionTypeEnum.COPY,
        files,
      };
      return { ...state, bufferedItems, selectedFiles: new Set([]) };
    }

    case ActionTypes.CUT_FILES_TOBUFFER: {
      const files = state.selectedFiles.size > 0 ? state.selectedFiles : state.contextMenu?.item ? new Set([state.contextMenu?.item]): new Set([]);
      const bufferedItems = {
        type: ItemMoveActionTypeEnum.CUT,
        files,
      };
      return { ...state, bufferedItems, selectedFiles: new Set([]) };
    }

    case ActionTypes.SET_FILEEDIT_DATA:
      return { ...state, fileEdit: action.payload };
      
    default:
      return state;
  }
};

export default fileManagerReducer;
