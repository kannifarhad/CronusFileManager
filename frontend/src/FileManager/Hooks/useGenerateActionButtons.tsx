import {  useMemo } from "react";
import { ButtonObject, ViewTypeEnum, ItemType, ItemExtensionCategoryFilter, Items } from "../types";
import { checkSelectedFileType } from "../helpers";
import {  CreateContextType } from '../ContextStore/types';

const isSelectedFileType = (type: ItemExtensionCategoryFilter, contextMenu: CreateContextType['contextMenu'], selectedFiles: CreateContextType['selectedFiles'])=>{
  if(selectedFiles.size !== 1 && !Boolean(contextMenu?.item)) return false;
  const selectedItem = contextMenu?.item ?? Array.from(selectedFiles)[0];
  if(selectedItem && selectedItem.type !==  ItemType.FILE) return false;
  return checkSelectedFileType(type, selectedItem);
};

export const generateAllButtons = (operations: any, stateOperations: any, state: CreateContextType): ButtonObject => {

  const { selectedFiles, contextMenu, filesList, itemsViewType, bufferedItems, history, selectedFolder, foldersList } = state;

  const isItemFocusedOrSelected = ((contextMenu, selectedFiles)=>
    Boolean(contextMenu?.item) || selectedFiles.size === 1
  )(contextMenu, selectedFiles)
  
  const isSelectedItemImage = isSelectedFileType(ItemExtensionCategoryFilter.IMAGE, contextMenu, selectedFiles)

  const allButtons: ButtonObject = {
    copy: {
      title: "Copy",
      icon: "icon-copy",
      onClick: operations.handleCopy,
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    cut: {
      title: "Cut",
      icon: "icon-scissors",
      onClick: operations.handleCut,
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
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
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
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
      disabled: !isItemFocusedOrSelected,
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
        disabled: !(history.currentIndex + 1 < history.steps.length),
    },
    goParent: {
      title: "Go to parent folder",
      icon: "icon-backward",
      onClick: operations.handleGotoParent,
      disabled: Array.isArray(foldersList) && selectedFolder === foldersList[0]?.path,
    },
    goBack: {
      title: "Back",
      icon: "icon-backward",
      onClick: operations.handleGoBackWard,
      disabled: !(history.currentIndex > 0),
    },
    selectAll: {
      title: "Select all",
      icon: "icon-add-3",
      onClick: operations.handleSelectAll,
      disabled: !(selectedFiles.size !== filesList.length),
    },
    selectNone: {
      title: "Select none",
      icon: "icon-cursor",
      onClick: operations.handleUnsetSelected,
      disabled: selectedFiles.size === 0,
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
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.FILE, contextMenu, selectedFiles),
    },

    editFile: {
      title: "Edit File",
      icon: "icon-pencil",
      onClick: operations.handleEditText,
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.TEXT,contextMenu, selectedFiles),
    },

    editImage: {
      title: "Resize & Rotate",
      icon: "icon-paint-palette",
      onClick: operations.handleEditImage,
      disabled: !isSelectedItemImage
    },
    createZip: {
      title: "Create archive",
      icon: "icon-zip",
      onClick: operations.handleCreateZip,
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    extractZip: {
      title: "Extract files from archive",
      icon: "icon-zip-1",
      onClick: operations.handleExtractZip,
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.ARCHIVE, contextMenu, selectedFiles),
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
      disabled: !isSelectedItemImage
    },
    getInfo: {
      title: "Get Info",
      icon: "icon-information",
      onClick: operations.handleGetInfo,
      disabled: !isItemFocusedOrSelected,
    },
    download: {
      title: "Download File",
      icon: "icon-download-1",
      onClick: operations.handleDownload,
      disabled: !isItemFocusedOrSelected,
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