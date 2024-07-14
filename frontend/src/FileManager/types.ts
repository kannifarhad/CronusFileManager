import { AlertColor } from '@mui/material/Alert';
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
  
  handleAddSelected: (path: string) => void;
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

enum ItemType {
  FOLDER = 'folder',
  FILE = 'file',
}
interface Permissions{
  group: string;
  others: string;
  owner: string;
}
export interface FolderList {
  path: string;
  name: string;
  created: string;
  id: string;
  modified: string;
  type: ItemType;
  premissions: Permissions,
  children?: FolderList[] | null;
}
