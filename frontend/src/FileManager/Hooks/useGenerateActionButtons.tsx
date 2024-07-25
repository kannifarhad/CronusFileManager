import {  useMemo } from "react";
import { ButtonObject, PopupData, EditImage, FolderType, Items, ContextMenuTypeEnum, ViewTypeEnum, OrderByType, ImagesThumbTypeEnum } from "../types";
import { checkSelectedFileType } from "../helpers";
import { ActionTypes, CreateContextType } from '../ContextStore/types';

export const generateAllButtons = (operations: any, stateOperations: any, state: CreateContextType): ButtonObject => {

  const { selectedFiles, contextMenu, filesList, itemsViewType, bufferedItems } = state;
  const allButtons: ButtonObject = {
    copy: {
      title: "Copy",
      icon: "icon-copy",
      onClick: operations.handleCopy,
      disabled: !(selectedFiles.size > 0),
    },
    cut: {
      title: "Cut",
      icon: "icon-scissors",
      onClick: operations.handleCut,
      disabled: !(selectedFiles.size > 0),
    },
    paste: {
      title: "Paste",
      icon: "icon-paste",
      onClick: operations.handlePaste,
      disabled: !(bufferedItems.files.size > 0),
    },
    delete: {
      title: "Delete",
      icon: "icon-trash",
      onClick: operations.handleDelete,
      disabled: !(selectedFiles.size > 0),
    },
    emptyFolder: {
      title: "Empty Folder",
      icon: "icon-delete-folder",
      onClick: operations.handleEmptyFolder,
    },
    rename: {
      title: "Rename",
      icon: "icon-text",
      onClick: operations.handleRename,
      disabled: !(Boolean(contextMenu?.item) || selectedFiles.size === 1),
    },
    newFile: {
      title: "Few File",
      icon: "icon-add",
      onClick: operations.handleNewFile,
    },
    newFolder: {
      title: "New Folder",
      icon: "icon-add-folder",
      onClick: operations.handleNewFolder,
    },
    goForwad: {
      title: "Forwad",
      icon: "icon-forward",
      onClick: operations.handleGoForWard,
      //   disabled: !(props?.history.currentIndex + 1 < props?.history.steps.length),
    },
    goParent: {
      title: "Go to parent folder",
      icon: "icon-backward",
      onClick: operations.handleGotoParent,
      //   disabled: props?.selectedFolder === props?.foldersList.path,
    },
    goBack: {
      title: "Back",
      icon: "icon-backward",
      onClick: operations.handleGoBackWard,
      //   disabled: !(props?.history.currentIndex > 0),
    },
    selectAll: {
      title: "Select all",
      icon: "icon-add-3",
      onClick: operations.handleSelectAll,
      //   disabled: !(props?.selectedFiles.length !== props?.filesList.length),
    },
    selectNone: {
      title: "Select none",
      icon: "icon-cursor",
      onClick: operations.handleUnsetSelected,
      //   disabled: props?.selectedFiles.length === 0,
    },
    inverseSelected: {
      title: "Invert selection",
      icon: "icon-refresh",
      onClick: operations.handleInverseSelected,
        disabled: !(
          selectedFiles.size !== filesList.length &&
          selectedFiles.size > 0
        ),
    },
    selectFile: {
      title: "Select file",
      icon: "icon-outbox",
      onClick: operations.handleReturnCallBack,
      //   disabled: typeof selectCallback === "undefined",
    },
    reload: {
      title: "Reload",
      icon: "icon-refresh",
      onClick: operations.handleReload,
    },
    dubplicate: {
      title: "Duplicate",
      icon: "icon-layers",
      onClick: operations.handleDuplicate,
      disabled: !(Boolean(contextMenu?.item) || selectedFiles.size === 1),
    },

    editFile: {
      title: "Edit File",
      icon: "icon-pencil",
      onClick: operations.handleEditText,
      //   disabled: !(
      //     props?.selectedFiles.length === 1 && checkSelectedFileType("text")
      //   ),
    },

    editImage: {
      title: "Resize & Rotate",
      icon: "icon-paint-palette",
      onClick: operations.handleEditImage,
      //   disabled: !(
      //     props?.selectedFiles.length === 1 && checkSelectedFileType("image")
      //   ),
    },
    createZip: {
      title: "Create archive",
      icon: "icon-zip",
      onClick: operations.handleCreateZip,
      //   disabled: !(props?.selectedFiles.length > 0),
    },
    extractZip: {
      title: "Extract files from archive",
      icon: "icon-zip-1",
      onClick: operations.handleExtractZip,
      //   disabled: !(
      //     props?.selectedFiles.length === 1 && checkSelectedFileType("archive")
      //   ),
    },
    uploadFile: {
      title: "Upload Files",
      icon: "icon-cloud-computing",
      onClick: operations.handleUpload,
    },
    searchFile: {
      title: "Search File",
      icon: "icon-search",
      onClick: operations.handleSearchFile,
    },
    saveFile: {
      title: "Save Changes",
      icon: "icon-save",
      onClick: operations.handleSaveFileChanges,
    },
    preview: {
      title: "View",
      icon: "icon-view",
      onClick: operations.handlePreview,
      //   disabled: !(
      //     props?.selectedFiles.length === 1 && checkSelectedFileType("image")
      //   ),
    },
    getInfo: {
      title: "Get Info",
      icon: "icon-information",
      onClick: operations.handleGetInfo,
      disabled: !(Boolean(contextMenu?.item) || selectedFiles.size === 1),
    },
    download: {
      title: "Download File",
      icon: "icon-download-1",
      onClick: operations.handleDownload,
      //   disabled: !(
      //     props?.selectedFiles.length === 1 && checkSelectedFileType("file")
      //   ),
    },
    gridView: {
      title: "Grid view",
      icon: "icon-layout-1",
      onClick: () => operations.handleSetViewItemType(ViewTypeEnum.GRID),
      disabled: itemsViewType === ViewTypeEnum.GRID,
    },
    listView: {
      title: "List View",
      icon: "icon-layout-2",
      onClick: () => operations.handleSetViewItemType(ViewTypeEnum.LIST),
      disabled: itemsViewType === ViewTypeEnum.LIST,
    },
    fullScreen: {
      title: "Full Screen",
      //   icon: expand ? "icon-minimize" : "icon-resize",
      icon: "icon-resize",
      onClick: operations.handleFullExpand,
      disabled: false,
    },
  };
  return allButtons;
};

export const useGenerateActionButtons = ({ state }: { state: CreateContextType}) => {
  const { operations } = state;

  const allButtons = useMemo(() =>  generateAllButtons(operations, null, state), [operations, state]);

  const aviableButtons = useMemo(
    () => ({
      topbar: [
        [allButtons.goBack, allButtons.goForwad, allButtons.goParent],
        [
          allButtons.newFile,
          allButtons.newFolder,
          allButtons.uploadFile,
          allButtons.reload,
        ],
        [
          allButtons.copy,
          allButtons.cut,
          allButtons.paste,
          allButtons.delete,
          allButtons.emptyFolder,
          allButtons.dubplicate,
        ],
        [allButtons.rename, allButtons.editImage],
        [
          allButtons.inverseSelected,
          allButtons.selectNone,
          allButtons.selectAll,
        ],
        [allButtons.createZip, allButtons.extractZip],
        [
          allButtons.preview,
          allButtons.getInfo,
          allButtons.selectFile,
          allButtons.download,
        ],
        [allButtons.gridView, allButtons.listView, allButtons.fullScreen],
      ],
      file: [
        [
          allButtons.copy,
          allButtons.cut,
          allButtons.paste,
          allButtons.delete,
          allButtons.dubplicate,
        ],
        [allButtons.rename, allButtons.editImage],
        [allButtons.createZip, allButtons.extractZip],
        [
          allButtons.preview,
          allButtons.getInfo,
          allButtons.selectFile,
          allButtons.download,
        ],
      ],
      container: [
        [allButtons.goBack, allButtons.goForwad, allButtons.goParent],
        [
          allButtons.newFile,
          allButtons.newFolder,
          allButtons.emptyFolder,
          allButtons.uploadFile,
          allButtons.reload,
        ],
        [
          allButtons.inverseSelected,
          allButtons.selectNone,
          allButtons.selectAll,
        ],
        [allButtons.gridView, allButtons.listView, allButtons.fullScreen],
      ],
    }),
    [allButtons]
  );

  return aviableButtons;
};

export default useGenerateActionButtons;