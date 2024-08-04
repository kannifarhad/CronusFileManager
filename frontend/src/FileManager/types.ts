/* eslint-disable no-shadow, no-use-before-define */
import { AlertColor } from "@mui/material/Alert";
import React, { ReactNode } from "react";
import config from "./Elements/config.json";
import { SaveFileParams } from "./Api/types";
import { FileWithPreview } from "./Elements/Dropzone";
import { ButtonItemType } from "./Elements/ButtonGroup";

// Define enums
export enum ItemType {
  FOLDER = "folder",
  FILE = "file",
}

export enum ItemMoveActionTypeEnum {
  COPY = "COPY",
  CUT = "CUT",
}

export enum ContextMenuTypeEnum {
  ITEM = "ITEM",
  CONTENT = "CONTENT",
}

export enum ViewTypeEnum {
  GRID = "GRID",
  LIST = "LIST",
}

export enum ImagesThumbTypeEnum {
  ICONS = "ICONS",
  THUMB = "THUMB",
}

export enum OrderByFieldEnum {
  NAME = "NAME",
  SIZE = "SIZE",
  DATE = "DATE",
}

export enum SortByFieldEnum {
  DESC = "DESC",
  ASC = "ASC",
}

export enum ItemExtensionCategoryFilter {
  FILE = "FILE",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  ARCHIVE = "ARCHIVE",
}

export enum HistoryStepTypeEnum {
  FOLDERCHANGE = "FOLDERCHANGE",
}

export enum ActionTypes {
  SET_SELECTED_FILES = "SET_SELECTED_FILES",
  SET_LOADING = "SET_LOADING",
  SET_SELECTED_FOLDER = "SET_SELECTED_FOLDER",
  SET_MESSAGES = "SET_MESSAGES",
  SET_FILES_LIST = "SET_FILES_LIST",
  ADD_SELECTED_FILE = "ADD_SELECTED_FILE",
  REMOVE_MESSAGES = "REMOVE_MESSAGES",
  SET_CONTEXT_MENU = "SET_CONTEXT_MENU",
  CLEAR_BUFFER = "CLEAR_BUFFER",
  UNSET_SELECTED_FILES = "UNSET_SELECTED_FILES",
  SELECT_ALL_FILES = "SELECT_ALL_FILES",
  INVERSE_SELECTED_FILES = "INVERSE_SELECTED_FILES",
  SET_SORT_ORDER_BY = "SET_SORT_ORDER_BY",
  SET_IMAGE_SETTINGS = "SET_IMAGE_SETTINGS",
  COPY_FILES_TOBUFFER = "COPY_FILES_TOBUFFER",
  CUT_FILES_TOBUFFER = "CUT_FILES_TOBUFFER",
  SET_FOLDERS_LIST = "SET_FOLDERS_LIST",
  SET_HISTORY_INDEX = "SET_HISTORY_INDEX",
  SET_ITEM_VIEW = "SET_ITEM_VIEW",
  SET_POPUP_DATA = "SET_POPUP_DATA",
  SET_FILEEDIT_DATA = "SET_FILEEDIT_DATA",
  TOGGLE_FULLSCREEN = "TOGGLE_FULLSCREEN",
  TOGGLE_UPLOAD_POPUP = "TOGGLE_UPLOAD_POPUP",
}

// Define interfaces and types
export interface Permissions {
  group: string;
  others: string;
  owner: string;
}

export interface FolderType {
  path: string;
  name: string;
  created: string;
  id: string;
  modified: string;
  type: ItemType.FOLDER;
  premissions: Permissions;
  children?: ItemsList | null;
  size: number;
  private?: boolean;
}

export interface FileType {
  path: string;
  name: string;
  created: string;
  modified: string;
  type: ItemType.FILE;
  id: string;
  premissions: Permissions;
  size: number;
  extension: keyof typeof config.icons;
  private?: boolean;
}

export type Items = FolderType | FileType;
export type ItemsList = Items[];

export type OrderByType = {
  field: OrderByFieldEnum;
  orderBy: SortByFieldEnum;
};

export interface BufferedItemsType {
  files: Set<Items>;
  type: ItemMoveActionTypeEnum | null;
}

export interface FolderList extends FolderType {
  children?: FolderList[];
}

export interface HistoryStep {
  action: HistoryStepTypeEnum;
  payload: FolderList;
}

export interface HistoryType {
  currentIndex: number;
  steps: HistoryStep[];
}

export interface FileManagerState {
  selectedFiles: Set<Items>;
  bufferedItems: BufferedItemsType;
  foldersList: FolderList | null;
  contextMenu: {
    item: Items | null;
    mouseX: number;
    mouseY: number;
    menuType: ContextMenuTypeEnum;
  } | null;
  selectedFolder: FolderList | null;
  itemsViewType: ViewTypeEnum;
  showImages: ImagesThumbTypeEnum;
  loading: boolean;
  messages: Messages;
  filesList: ItemsList;
  orderFiles: OrderByType;
  history: HistoryType;
  popUpData: PopupStoreType;
  fileEdit: FileEditPopupProps | null;
  fullScreen: boolean;
  uploadPopup: any;
}

export interface FileManagerAction {
  type: string;
  payload?: any;
}

export interface CreateContextType extends FileManagerState {
  operations: Operations;
}

export interface FileManagerProps {
  height?: number;
  selectItemCallback?: (filePath: string) => void;
}

export interface Button {
  icon: string;
  title: string;
  onClick: (e: any) => void;
  disabled?: boolean;
}

export type ButtonGroup = Button[];

export interface AvailableButtons {
  topbar: ButtonGroup[];
  file: ButtonGroup[];
  container: ButtonGroup[];
}

export interface Operations {
  handleSelectFolder: (
    value: FolderType,
    history?: boolean,
    clearBuffer?: boolean,
    showMessage?: boolean,
  ) => void;
  handleAddSelected: (item: Items) => void;
  handleReloadFolderTree: () => void;
  handleContextClick: (args: {
    item: Items | null;
    event: React.MouseEvent;
    menuType: ContextMenuTypeEnum;
  }) => void;
  handleClearBuffer: () => void;
  handleContextClose: () => void;
  handleDragEnd: (draggedItems: ItemsList, destination: FolderType) => void;
  handleSetViewItemType: (view: ViewTypeEnum) => void;
  handleSetOrder: (order: OrderByType) => void;
  handleSetThumbView: (view: ImagesThumbTypeEnum) => void;
  handleUnsetSelected: () => void;
  handleInverseSelected: () => void;
  handleSelectAll: () => void;
  handleGoBackWard: (history: HistoryType) => void;
  handleGoForWard: (history: HistoryType) => void;
  handleGotoParent: (folderList: FolderList) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: (
    bufferedItems: BufferedItemsType,
    selectedFolder: FolderList,
  ) => void;
  handleDelete: (selectedFiles: Set<Items>, selectedFolder: FolderList) => void;
  handleEmptyFolder: (selectedFolder: FolderList) => void;
  handleNewFile: (selectedFolder: FolderList) => void;
  handleNewFolder: (selectedFolder: FolderList) => void;
  handleRename: (selectedFile: Items, selectedFolder: FolderList) => void;
  handleDuplicate: (selectedFile: Items, selectedFolder: FolderList) => void;
  handleCreateZip: (
    selectedFiles: Set<Items>,
    selectedFolder: FolderList,
  ) => void;
  handleExtractZip: (selectedFile: Items, selectedFolder: FolderList) => void;
  handleEditFile: (selectedFile: FileType, selectedFolder: FolderList) => void;
  handleToggleFullScreen: () => void;
  handleToggleUploadPopUp: () => void;
  handleUploadFiles: (
    files: FileWithPreview[],
    selectedFolder: FolderList,
  ) => void;
  handlingHistory: (historyInfo: HistoryStep, index: number) => void;
}

export interface Message {
  title: string;
  message: string | ReactNode;
  type: AlertColor;
  disableClose?: boolean;
  progress?: boolean;
  timer?: number;
  id: string;
}

export type Messages = Message[];

export type ButtonObject = {
  [key: string]: Button;
};

export type PopupStoreType = PopupData | null;

interface NameInputSets {
  value: string;
  label: string;
  callBack: (value: string) => void;
}

export interface PopupData {
  title: string;
  description?: string | JSX.Element;
  nameInputSets?: NameInputSets;
  actionButtons?: ButtonItemType[];
}

export interface FileEditPopupProps {
  closeCallBack: () => void;
  submitCallback: (data: SaveFileParams) => void;
  name: string;
  extension: string;
  path: string;
}

export interface EditImage {
  open: boolean;
  closeCallBack: boolean | (() => void);
  submitCallback: boolean | ((data: any) => void);
  name: string;
  path: string;
  extension: string;
}
