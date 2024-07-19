import {
  ButtonObject,
  PopupData,
  EditImage,
  Messages,
  FolderType,
  FolderList,
  BufferedItemsType,
  Items,
  ContextMenuTypeEnum,
  ImagesThumbTypeEnum,
  ViewTypeEnum,
  ItemsList,
  OrderByType
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
  CLEAR_BUFFER = "CLEAR_BUFFER",
  UNSET_SELECTED_FILES = "UNSET_SELECTED_FILES",
  SELECT_ALL_FILES = "SELECT_ALL_FILES",
  INVERSE_SELECTED_FILES = "INVERSE_SELECTED_FILES",
  SET_SORT_ORDER_BY = "SET_SORT_ORDER_BY",

    COPY_FILES_TOBUFFER = "COPY_FILES_TOBUFFER",
    CUT_FILES_TOBUFFER = "CUT_FILES_TOBUFFER",
    PASTE_FILES = "PASTE_FILES",
    SET_FOLDERS_LIST = "SET_FOLDERS_LIST",
    SET_HISTORY_INDEX = "SET_HISTORY_INDEX",
    SET_ITEM_VIEW = "SET_ITEM_VIEW",
    SET_IMAGE_SETTINGS = "SET_IMAGE_SETTINGS",
}

export interface FileManagerState {
  selectedFiles: Set<Items>;
  bufferedItems: BufferedItemsType;
  foldersList: FolderList | null;
  contextMenu: { 
    item: Items | null,
    mouseX: number,
    mouseY: number,
    menuType: ContextMenuTypeEnum
  } | null,
  selectedFolder: FolderList | null;
  itemsViewType: ViewTypeEnum;
  showImages: ImagesThumbTypeEnum;
  loading: boolean;
  messages: Messages;
  filesList: ItemsList;
  orderFiles: OrderByType;

  history: {
    currentIndex: number;
    steps: any[]
  };
  popUpData: PopupData;
}

export interface FileManagerAction {
  type: string;
  payload? : any;
}

export interface CreateContextType extends FileManagerState {
  aviableButtons: AvailableButtons;
  operations: Operations;
}