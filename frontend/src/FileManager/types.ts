import { AlertColor } from '@mui/material/Alert';
import config from "./Elements/config.json";
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
  handleSelectFolder: (value: string, history?: boolean) => void;
  handleAddSelected: (item: Items) => void;
  
  handleUnsetSelected: () => void;
  handleInverseSelected: () => void;
  handleSelectAll: () => void;
  handleGotoParent: () => void;
  handleGoBackWard: () => void;
  handleGoForWard: () => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleSetMainFolder: (value: string, history?: boolean) => void;
  handleDelete: () => void;
  handleEmptyFolder: () => void;
  handleNewFile: () => void;
  handleNewFolder: () => void;
  handleRename: () => void;
  handleDuplicate: () => void;
  handleReload: () => void;
  handleCreateZip: () => void;
  handleExtractZip: () => void;
  handleEdit: () => void;
}
export interface Message {
    title: string;
    message: string;
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

export interface PopupData {
  open: boolean;
  title?: string;
  description?: string;
  handleClose?: () => void;
  handleSubmit?: () => void;
  nameInputSets?: any;
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
export interface BufferedItemsType{
  files: Set<Items | unknown>;
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
  children?: FolderList[] | null;
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