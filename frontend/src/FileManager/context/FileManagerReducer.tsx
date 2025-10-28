// import { sortFilter } from "../utils";
import { ItemMoveActionTypeEnum, HistoryStepTypeEnum, ActionTypes } from "../types";
import type { FileManagerAction, FileManagerState } from "../types";

import { initialState } from "./index";

export const fileManagerReducer = (state: FileManagerState, action: FileManagerAction): FileManagerState => {
  switch (action.type) {
    
    case ActionTypes.TOGGLE_UPLOAD_POPUP:
      if (action.payload && state.uploadPopup) {
        return state;
      }
      return { ...state, uploadPopup: !state.uploadPopup };

    // BELOW NOT REFACTORED

    case ActionTypes.SET_FOLDERS_LIST:
      return { ...state, foldersList: action.payload };

    case ActionTypes.SET_SELECTED_FOLDER: {
      const { folder, history, loading, clearBuffer } = action.payload;
      const newState = {
        ...state,
        selectedFolder: folder,
        loading: loading !== undefined ? loading : state.loading,
        search: initialState.search,
      };

      if (!history) {
        newState.history.steps.push({
          action: HistoryStepTypeEnum.FOLDERCHANGE,
          payload: folder,
        });
        newState.history.currentIndex = Math.max(0, newState.history.steps.length - 1);
      }
      if (clearBuffer) {
        newState.bufferedItems = {
          type: null,
          files: new Set([]),
        };
        newState.selectedFiles = new Set([]);
      }
      return newState;
    }

    case ActionTypes.SET_FILES_LIST: {
      const { data, message, loading } = action.payload;
      let filesList = Array.isArray(data) ? data : [];
      // filesList = sortFilter(filesList, state.settings.orderFiles);
      let newfoldersList = state.foldersList;

      return {
        ...state,
        filesList,
        selectedFiles: new Set([]),
        foldersList: newfoldersList,
        messages: message ? [...state.messages, message] : state.messages,
        loading: loading !== undefined ? loading : state.loading,
      };
    }

    case ActionTypes.SET_SEARCH_RESULTS: {
      const { result, text } = action.payload;
      let filesList = Array.isArray(result) ? result : [];
      // filesList = sortFilter(filesList, state.settings.orderFiles);
      // let newfoldersList = state.foldersList;
      // if (
      //   state.selectedVolume?.type === VolumeTypes.S3BUCKET_FRONT &&
      //   state.selectedFolder?.path !== "/"
      // ) {
      //   const newFolders: FolderType[] = filesList.filter(
      //     (item) => item.type === ItemType.FOLDER
      //   );
      //   if (newFolders.length > 0) {
      //     newfoldersList = addFoldersToTree(state.foldersList, newFolders);
      //   }
      // }
      return {
        ...state,
        filesList,
        selectedFiles: new Set([]),
        loading: false,
        selectedFolder: null,
        search: {
          prevSelectedFolder: state.selectedFolder || state.search.prevSelectedFolder,
          text,
        },
      };
    }

    case ActionTypes.ADD_SELECTED_FILE: {
      const { item, multiSelect } = action.payload;
      // Create a new Set based on the current state
      const selectedFilesNew = new Set(state.selectedFiles);

      // Add or remove the item from the new Set
      if (selectedFilesNew.has(item)) {
        selectedFilesNew.delete(item);
      } else {
        if (selectedFilesNew.size !== 0 && multiSelect) {
          const endIndex = state.filesList.indexOf(item);
          const selectedFilesArray = Array.from(state.selectedFiles);
          let startIndex = Infinity;

          // eslint-disable-next-line no-restricted-syntax
          for (const file of selectedFilesArray) {
            const index = state.filesList.indexOf(file);
            if (index !== -1 && index < startIndex) {
              startIndex = index;
            }
          }
          // Copy all files between startIndex and endIndex (inclusive)
          const filesToAdd = state.filesList.slice(startIndex, endIndex + 1);
          return { ...state, selectedFiles: new Set(filesToAdd) };
        }
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

    case ActionTypes.SET_POPUP_DATA:
      return { ...state, popUpData: action.payload };

    case ActionTypes.UNSET_SELECTED_FILES:
      return { ...state, selectedFiles: new Set() };

    case ActionTypes.SELECT_ALL_FILES: {
      const newSelected = state.filesList.filter((file) => !file.private);
      return {
        ...state,
        selectedFiles: new Set(newSelected),
      };
    }

    case ActionTypes.INVERSE_SELECTED_FILES: {
      const { selectedFiles } = state;
      const inversedSelected = state.filesList.filter((file) => !selectedFiles.has(file));
      return {
        ...state,
        selectedFiles: new Set(inversedSelected),
      };
    }

    case ActionTypes.SET_HISTORY_INDEX: {
      return {
        ...state,
        history: { ...state.history, currentIndex: action.payload.index },
      };
    }

    case ActionTypes.COPY_FILES_TOBUFFER: {
      const files =
        state.selectedFiles.size > 0
          ? state.selectedFiles
          : state.contextMenu?.item
          ? new Set([state.contextMenu?.item])
          : new Set([]);
      const bufferedItems = {
        type: ItemMoveActionTypeEnum.COPY,
        files,
      };
      return { ...state, bufferedItems, selectedFiles: new Set([]) };
    }

    case ActionTypes.CUT_FILES_TOBUFFER: {
      const files =
        state.selectedFiles.size > 0
          ? state.selectedFiles
          : state.contextMenu?.item
          ? new Set([state.contextMenu?.item])
          : new Set([]);
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
