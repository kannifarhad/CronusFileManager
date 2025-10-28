/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type ReactNode } from "react";
import { type AlertColor } from "@mui/material";
import { type Theme } from "@mui/system";
import { type FileWithPath } from "react-dropzone";
import type { FileType, FolderList, FolderType, Items, ItemsList, SaveFileParams } from "./apiProviders";
import { type ButtonItemType } from "./components/elements/ButtonGroup";
import type { IconName } from "./components/elements/Icon";
export * from "./apiProviders/types";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: React.CSSProperties["color"];
    };
    cronus?: any;
  }
  interface ThemeOptions {
    status?: {
      danger?: React.CSSProperties["color"];
    };
    cronus?: any;
  }
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
  SET_SELECTED_FOLDER = "SET_SELECTED_FOLDER",
  ADD_SELECTED_FILE = "ADD_SELECTED_FILE",
  CLEAR_BUFFER = "CLEAR_BUFFER",
  SELECT_ALL_FILES = "SELECT_ALL_FILES",
  UNSET_SELECTED_FILES = "UNSET_SELECTED_FILES",
  INVERSE_SELECTED_FILES = "INVERSE_SELECTED_FILES",

  SET_FILES_LIST = "SET_FILES_LIST",
  SET_CONTEXT_MENU = "SET_CONTEXT_MENU",
  COPY_FILES_TOBUFFER = "COPY_FILES_TOBUFFER",
  CUT_FILES_TOBUFFER = "CUT_FILES_TOBUFFER",
  SET_FOLDERS_LIST = "SET_FOLDERS_LIST",
  SET_HISTORY_INDEX = "SET_HISTORY_INDEX",
  SET_POPUP_DATA = "SET_POPUP_DATA",
  SET_FILEEDIT_DATA = "SET_FILEEDIT_DATA",
  TOGGLE_UPLOAD_POPUP = "TOGGLE_UPLOAD_POPUP",
  SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS",
}

export enum SettingsActionTypes {
  SET_IMAGE_SETTINGS = "SET_IMAGE_SETTINGS",
  SET_SELECTED_THEME = "SET_SELECTED_THEME",
  SET_ITEM_VIEW = "SET_ITEM_VIEW",
  SET_SORT_ORDER_BY = "SET_SORT_ORDER_BY",
  TOGGLE_FULLSCREEN = "TOGGLE_FULLSCREEN",
}

export enum SystemActionTypes {
  SET_LOADING = "SET_LOADING",
  REMOVE_MESSAGES = "REMOVE_MESSAGES",
  SET_MESSAGES = "SET_MESSAGES",
  SET_SELECTED_VOLUME = "SET_SELECTED_VOLUME",
}

export enum SelectionActionTypes {
  SET_LOADING = "SET_LOADING",
  REMOVE_MESSAGES = "REMOVE_MESSAGES",
  SET_MESSAGES = "SET_MESSAGES",
  SET_SELECTED_VOLUME = "SET_SELECTED_VOLUME",
}

// Define interfaces and types

export type OrderByType = {
  field: OrderByFieldEnum;
  orderBy: SortByFieldEnum;
};

export interface BufferedItemsType {
  files: Set<Items>;
  type: ItemMoveActionTypeEnum | null;
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
  loading: boolean;
  messages: Messages;
  filesList: ItemsList;
  history: HistoryType;
  popUpData: PopupStoreType;
  fileEdit: FileEditPopupProps | null;
  fullScreen: boolean;
  uploadPopup: any;
  volumesList: VolumeListType;
  selectedVolume: VolumeListItem | null;
  search: {
    text: string | null;
    prevSelectedFolder: FolderList | null;
  };
}

export interface SettingsStateType {
  selectedTheme: string | null;
  itemsViewType: ViewTypeEnum;
  showImages: ImagesThumbTypeEnum;
  orderFiles: OrderByType;
  fullScreen: boolean;
}
export interface SettingsOperationsType {
  handleSelectTheme: (theme: string) => void;
  handleSetViewItemType: (view: ViewTypeEnum) => void;
  handleSetOrder: (order: OrderByType) => void;
  handleSetThumbView: (view: ImagesThumbTypeEnum) => void;
  handleToggleFullScreen: () => void;
}

export interface SystemOperationsType {
  setMessage: (message: Omit<Message, "id">) => void;
  removeMessage: (id: string) => void;
  handleApiError: (error: unknown, errorTitle: string) => void;
  handleSelectVolume: (selectedVolumeItem: VolumeListItem) => void;
  setLoading: (value: boolean) => void;
}
export interface Operations {
  handleSelectFolder: (value: FolderType, history?: boolean, clearBuffer?: boolean, showMessage?: boolean) => void;
  handleAddSelected: (item: Items, multiSelect?: boolean) => void;
  handleReloadFolderTree: () => void;
  handleContextClick: (args: { item: Items | null; event: React.MouseEvent; menuType: ContextMenuTypeEnum }) => void;
  handleClearBuffer: () => void;
  handleContextClose: () => void;
  handleDragEnd: (draggedItems: ItemsList, destination: FolderType) => void;
  handleUnsetSelected: () => void;
  handleInverseSelected: () => void;
  handleSelectAll: () => void;
  handleGoBackWard: (history: HistoryType) => void;
  handleGoForWard: (history: HistoryType) => void;
  handleGotoParent: (folderList: FolderList) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: (bufferedItems: BufferedItemsType, selectedFolder: FolderList) => void;
  handleDelete: (selectedFiles: Set<Items>, selectedFolder: FolderList) => void;
  handleEmptyFolder: (selectedFolder: FolderList) => void;
  handleNewFile: (selectedFolder: FolderList) => void;
  handleNewFolder: (selectedFolder: FolderList) => void;
  handleRename: (selectedFile: Items, selectedFolder: FolderList) => void;
  handleDuplicate: (selectedFile: Items, selectedFolder: FolderList) => void;
  handleCreateZip: (selectedFiles: Set<Items>, selectedFolder: FolderList) => void;
  handleExtractZip: (selectedFile: Items, selectedFolder: FolderList) => void;
  handleEditFile: (selectedFile: FileType, selectedFolder: FolderList) => void;
  handleToggleUploadPopUp: (forceShow?: boolean) => void;
  handleUploadFiles: (files: FileWithPath[], selectedFolder: FolderList) => void;
  handlingHistory: (historyInfo: HistoryStep, index: number) => void;
  handleSelectCallback: (path: string) => void;
  handleSearchItems: (text: string, path?: string) => void;
  handleInitFileManagerData: () => void;
  handleGetThumb: (file: FileType) => string | undefined;
}

export interface SystemStateType {
  loading: boolean;
  messages: Messages;
  volumesList: VolumeListType;
  selectedVolume: VolumeListItem | null;
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
  volumesList: VolumeListType;
}

export interface Button {
  icon: IconName;
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
  description?: string | React.JSX.Element;
  nameInputSets?: NameInputSets;
  actionButtons?: ButtonItemType[];
}

export interface FileEditPopupProps {
  closeCallBack: () => void;
  submitCallback: (data: SaveFileParams) => void;
  selectedFile: FileType;
}

export interface EditImage {
  open: boolean;
  closeCallBack: boolean | (() => void);
  submitCallback: boolean | ((data: any) => void);
  name: string;
  path: string;
  extension: string;
}

export enum VolumeTypes {
  S3BUCKET_FRONT,
  S3BUCKET_BACK,
  SERVER,
}
export interface ServerInstance {
  id: string;
  name: string;
  endpoint: string;
  type: VolumeTypes.SERVER;
}
export interface S3BucketInstance {
  type: VolumeTypes.S3BUCKET_BACK;
  endpoint: string;
  id: string;
  name: string;
}

export type VolumeListItem = ServerInstance | S3BucketInstance;
export type VolumeListType = VolumeListItem[];

export interface ThemeItemConfig {
  name: string;
  theme: Theme;
  id: string;
}
export type ThemeItemList = ThemeItemConfig[];
