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

export interface Messages {
  icon: string;
  title: string;
}
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

export interface FolderList {
  path: string;
  name: string;
  children?: FolderList[] | null;
}
