import {
  ButtonObject,
  PopupData,
  EditImage,
  Messages,
  FolderType,
  FolderList,
  BufferedItemsType,
  Items,
  ContextMenuTypeENum
} from "../types";
import {
  AvailableButtons,
  Operations
} from '../types';


export enum ActionTypes {
  SET_SELECTED_FILES = "SET_SELECTED_FILES",
  SET_LOADING = "SET_LOADING",
  SET_SELECTED_FOLDER = "SET_SELECTED_FOLDER",
  SET_MESSAGES = 'SET_MESSAGES', 
  SET_FILES_LIST = "SET_FILES_LIST",
  ADD_SELECTED_FILE = 'ADD_SELECTED_FILE',
  REMOVE_MESSAGES = 'REMOVE_MESSAGES',
  SET_CONTEXT_MENU = 'SET_CONTEXT_MENU',
  
    UNSET_SELECTED_FILES = "UNSET_SELECTED_FILES",
    SELECT_ALL_FILES = "SELECT_ALL_FILES",
    INVERSE_SELECTED_FILES = "INVERSE_SELECTED_FILES",
    COPY_FILES_TOBUFFER = "COPY_FILES_TOBUFFER",
    CUT_FILES_TOBUFFER = "CUT_FILES_TOBUFFER",
    PASTE_FILES = "PASTE_FILES",
    SET_FOLDERS_LIST = "SET_FOLDERS_LIST",
    SET_HISTORY_INDEX = "SET_HISTORY_INDEX",
    SET_ITEM_VIEW = "SET_ITEM_VIEW",
    SET_SORT_ORDER_BY = "SET_SORT_ORDER_BY",
    RUN_SORTING_FILTER = "RUN_SORTING_FILTER",
    SET_IMAGE_SETTINGS = "SET_IMAGE_SETTINGS",
    CLEAR_FILES_TOBUFFER = "CLEAR_FILES_TOBUFFER",
}

export interface FileManagerState {
  selectedFiles: Set<Items>;
  bufferedItems: BufferedItemsType;
  foldersList: FolderList | null;
  contextMenu: { 
    item: Items | null,
    mouseX: number,
    mouseY: number,
    menuType: ContextMenuTypeENum
  } | null,
  selectedFolder: FolderList | null;
  history: {
    currentIndex: number;
    steps: any[]
  };
  filesList: any[];
  itemsView: string;
  showImages: string;
  orderFiles: {
    field: string;orderBy: string
  };
  loading: boolean;
  popUpData: PopupData;
  messages: Messages;
}

export interface FileManagerAction {
  type: string;
  payload ? : any;
}

export interface CreateContextType extends FileManagerState {
  aviableButtons: AvailableButtons;
  operations: Operations;
}