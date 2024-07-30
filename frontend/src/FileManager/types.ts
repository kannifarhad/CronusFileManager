import { AlertColor } from '@mui/material/Alert';
import config from "./Elements/config.json";
import { DropResult } from 'react-beautiful-dnd';
import { ReactNode } from 'react';
export interface FileManagerProps {
  height?: string;
  callback?: (filePath: string) => void;
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
  handleSelectFolder: (value: FolderType, history?: boolean, clearBuffer?: boolean, showMessage?: boolean) => void;
  handleAddSelected: (item: Items) => void;
  handleContextClick: (args: { item: Items | null, event: React.MouseEvent, menuType: ContextMenuTypeEnum}) => void;
  handleClearBuffer: () => void;
  handleContextClose: (event: React.MouseEvent) => void;
  handleDragEnd: (result: DropResult) => void;
  handleSetViewItemType: (view: ViewTypeEnum)=> void,
  handleSetOrder: (order: OrderByType)=> void,
  handleSetThumbView: (view: ImagesThumbTypeEnum)=> void,
  handleUnsetSelected: () => void;
  handleInverseSelected: () => void;
  handleSelectAll: () => void;
  handleGoBackWard: (history:HistoryType) => void,
  handleGoForWard: (history:HistoryType) => void,
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
  handleEdit: (selectedFile: Items,selectedFolder: FolderList) => void;
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
  description?: string;
  handleClose: () => void;
  handleSubmit: ( fieldValus :any ) => void;
  nameInputSets?: NameInputSets;
}
export interface FileEditPopupProps {
  closeCallBack: () => void;
  submitCallback: (imageData: string, asNew: boolean) => void;
  name: string;
  extension: string;
  path: string;
  open: boolean;
}

export interface EditImage {
  open: boolean;
  closeCallBack: boolean | (() => void);
  submitCallback: boolean | ((data: any) => void);
  name: string;
  path: string;
  extension: string;
}

export enum ItemType {
  FOLDER = 'folder',
  FILE = 'file',
}

export enum ItemMoveActionTypeEnum {
  COPY = 'COPY',
  CUT = 'CUT'
}
export enum ContextMenuTypeEnum {
  ITEM = 'ITEM',
  CONTENT = 'CONTENT',
}

export enum ViewTypeEnum {
  GRID = 'GRID',
  LIST = 'LIST'
}

export enum ImagesThumbTypeEnum {
  ICONS = 'ICONS',
  THUMB = 'THUMB'
}

export enum OrderByFieldEnum {
  NAME = 'NAME',
  SIZE = 'SIZE',
  DATE = 'DATE',
}
export enum SortByFieldEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum ItemExtensionCategoryFilter {
  FILE = 'FILE',
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  ARCHIVE = 'ARCHIVE',
}
export type OrderByType = {
  field: OrderByFieldEnum,
  orderBy: SortByFieldEnum
}

export interface BufferedItemsType{
  files: Set<Items>;
  type: ItemMoveActionTypeEnum | null
};

interface Permissions{
  group: string;
  others: string;
  owner: string;
}
export type Items = FolderType | FileType;
export type ItemsList = Items[];

export interface FolderList extends FolderType {
  children?: FolderList[];
} 

export interface FolderType {
  path: string;
  name: string;
  created: string;
  id: string;
  modified: string;
  type: ItemType.FOLDER;
  premissions: Permissions,
  children?: ItemsList | null;
  size: number,
  private?: boolean;
}

type ExtensionsTypes = keyof typeof config.icons;
export interface FileType {
  path: string
  name: string
  created: string
  modified: string
  type: ItemType.FILE
  id: string
  premissions: Permissions
  size: number
  extension: ExtensionsTypes
  private?: boolean;
}

export enum HistoryStepTypeEnum {
  FOLDERCHANGE = 'FOLDERCHANGE'
}
export interface HistoryStep {
  action: HistoryStepTypeEnum,
  payload: FolderList
}
export interface HistoryType {
  currentIndex: number;
  steps: HistoryStep[]
}