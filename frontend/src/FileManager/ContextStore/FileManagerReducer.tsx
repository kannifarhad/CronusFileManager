/* eslint-disable no-nested-ternary */
import { LOCASTORAGE_SETTINGS_KEY } from "../config";
import {
  sortFilter,
  addFoldersToTree,
  writeJsonToLocalStorage,
} from "../helpers";
import {
  ItemMoveActionTypeEnum,
  HistoryStepTypeEnum,
  FileManagerAction,
  FileManagerState,
  ActionTypes,
  VolumeTypes,
  ItemType,
  FolderType,
} from "../types";
import { initialState } from "./FileManagerContext";

export const fileManagerReducer = (
  state: FileManagerState,
  action: FileManagerAction
): FileManagerState => {
  switch (action.type) {
    case ActionTypes.SET_FOLDERS_LIST:
      return { ...state, foldersList: action.payload };

    case ActionTypes.SET_SELECTED_FOLDER: {
      const { folder, history, loading, clearBuffer } = action.payload;
      const newState = {
        ...state,
        selectedFolder: folder,
        loading: loading !== undefined ? loading : state.loading,
      };

      if (!history) {
        newState.history.steps.push({
          action: HistoryStepTypeEnum.FOLDERCHANGE,
          payload: folder,
        });
        newState.history.currentIndex = Math.max(
          0,
          newState.history.steps.length - 1
        );
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
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_FILES_LIST: {
      const { data, message, loading } = action.payload;
      let filesList = Array.isArray(data) ? data : [];
      filesList = sortFilter(filesList, state.settings.orderFiles);
      let newfoldersList = state.foldersList;

      if (
        state.selectedVolume?.type === VolumeTypes.S3BUCKET_FRONT &&
        state.selectedFolder?.path !== "/"
      ) {
        const newFolders: FolderType[] = filesList.filter(
          (item) => item.type === ItemType.FOLDER
        );
        if (newFolders.length > 0) {
          newfoldersList = addFoldersToTree(state.foldersList, newFolders);
        }
      }
      return {
        ...state,
        filesList,
        selectedFiles: new Set([]),
        foldersList: newfoldersList,
        messages: message ? [...state.messages, message] : state.messages,
        loading: loading !== undefined ? loading : state.loading,
      };
    }
    case ActionTypes.SET_MESSAGES:
      return { ...state, messages: [...state.messages, action.payload] };

    case ActionTypes.REMOVE_MESSAGES:
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.id !== action.payload.id
        ),
      };

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

    case ActionTypes.SET_ITEM_VIEW: {
      const settings = { ...state.settings, itemsViewType: action.payload };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);
      return {
        ...state,
        settings,
      };
    }
    case ActionTypes.SET_POPUP_DATA:
      return { ...state, popUpData: action.payload };

    case ActionTypes.SET_IMAGE_SETTINGS: {
      const settings = { ...state.settings, showImages: action.payload };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);
      return {
        ...state,
        settings,
      };
    }
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
      const inversedSelected = state.filesList.filter(
        (file) => !selectedFiles.has(file)
      );
      return {
        ...state,
        selectedFiles: new Set(inversedSelected),
      };
    }

    case ActionTypes.SET_SORT_ORDER_BY: {
      const settings = {
        ...state.settings,
        orderFiles: {
          field: action.payload.field,
          orderBy: action.payload.orderBy,
        },
      };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);

      return {
        ...state,
        filesList: sortFilter(state.filesList, state.settings.orderFiles),
        settings,
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

    case ActionTypes.TOGGLE_FULLSCREEN:
      return { ...state, fullScreen: !state.fullScreen };

    case ActionTypes.SET_SELECTED_THEME: {
      const settings = { ...state.settings, selectedTheme: action.payload };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);
      return {
        ...state,
        settings,
      };
    }

    case ActionTypes.TOGGLE_UPLOAD_POPUP:
      if (action.payload && state.uploadPopup) {
        return state;
      }
      return { ...state, uploadPopup: !state.uploadPopup };
    case ActionTypes.SET_SELECTED_VOLUME: {
      const selectedVolume = action.payload;
      // If selected volume had been changed then we need to reset rest of the data as well beside volumesList
      if (selectedVolume.id !== state.selectedVolume?.id) {
        const newState = {
          ...initialState,
          selectedVolume: action.payload,
          volumesList: state.volumesList,
          settings: state.settings,
        };
        return newState;
      }
      return state;
    }
    default:
      return state;
  }
};

export default fileManagerReducer;
