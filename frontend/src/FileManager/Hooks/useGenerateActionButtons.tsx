import {  useMemo } from "react";
import { ButtonObject, ViewTypeEnum, ItemType, ItemExtensionCategoryFilter, Items, Operations } from "../types";
import { checkSelectedFileType } from "../helpers";
import {  CreateContextType, FileManagerState } from '../ContextStore/types';

type GenerateButtonsStateProps = Pick<FileManagerState, 'selectedFiles' | 'contextMenu' | 'filesList' | 'itemsViewType' | 'bufferedItems' | 'history' | 'selectedFolder' | 'foldersList'>;
const isSelectedFileType = (type: ItemExtensionCategoryFilter, contextMenu: CreateContextType['contextMenu'], selectedFiles: CreateContextType['selectedFiles'])=>{
  if(selectedFiles.size !== 1 && !Boolean(contextMenu?.item)) return false;
  const selectedItem = contextMenu?.item ?? Array.from(selectedFiles)[0];
  if(selectedItem && selectedItem.type !==  ItemType.FILE) return false;
  return checkSelectedFileType(type, selectedItem);
};

// export const generateAllButtons = (operations: Operations, state: FileManagerState): ButtonObject => {
  export const generateAllButtons = (operations: any, state: GenerateButtonsStateProps): ButtonObject => {
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
      onClick: ()=>operations.handlePaste(bufferedItems, selectedFolder),
      disabled: !(bufferedItems.files.size > 0),
    },
    delete: {
      title: "Delete",
      icon: "icon-trash",
      onClick: () => {
        const items = selectedFiles.size > 0 ? selectedFiles : new Set([contextMenu?.item]);
        operations.handleDelete(items, selectedFolder)
      },
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    emptyFolder: {
      title: "Empty Folder",
      icon: "icon-delete-folder",
      onClick: ()=>operations.handleEmptyFolder(selectedFolder),
      disabled: !selectedFolder,
    },
    rename: {
      title: "Rename",
      icon: "icon-text",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleRename(item, selectedFolder);
      },
      disabled: !isItemFocusedOrSelected,
    },
    newFile: {
      title: "Few File",
      icon: "icon-add",
      onClick: ()=>operations.handleNewFile(selectedFolder),
      disabled: !selectedFolder,

    },
    newFolder: {
      title: "New Folder",
      icon: "icon-add-folder",
      onClick: ()=>operations.handleNewFolder(selectedFolder),
      disabled: !selectedFolder,

    },
    goForwad: {
      title: "Forwad",
      icon: "icon-forward",
      onClick: ()=>operations.handleGoForWard(history),
        disabled: !(history.currentIndex + 1 < history.steps.length),
    },
    goParent: {
      title: "Go to parent folder",
      icon: "icon-backward",
      onClick: ()=>operations.handleGotoParent(foldersList),
      disabled: selectedFolder?.path === foldersList?.path,
    },
    goBack: {
      title: "Back",
      icon: "icon-backward",
      onClick: ()=>operations.handleGoBackWard(history),
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
    reload: {
      title: "Reload",
      icon: "icon-refresh",
      onClick: ()=>operations.handleSelectFolder(selectedFolder, true, true),
    },
    dubplicate: {
      title: "Duplicate",
      icon: "icon-layers",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleDuplicate(item, selectedFolder);
      },
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.FILE, contextMenu, selectedFiles),
    },
    editImage: {
      title: "Resize & Rotate",
      icon: "icon-paint-palette",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleEditFile(item, selectedFolder);
      },
      disabled: !isSelectedItemImage
    },
    createZip: {
      title: "Create archive",
      icon: "icon-zip",
      onClick: () => {
        const items = selectedFiles.size > 0 ? selectedFiles : new Set([contextMenu?.item]);
        operations.handleCreateZip(items, selectedFolder);
      },
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    extractZip: {
      title: "Extract files from archive",
      icon: "icon-zip-1",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleExtractZip(item, selectedFolder);
      },
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.ARCHIVE, contextMenu, selectedFiles),
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
    getInfo: {
      title: "Get Info",
      icon: "icon-information",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleGetInfo(item);
      },
      disabled: !isItemFocusedOrSelected,
    },
    preview: {
      title: "View",
      icon: "icon-view",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handlePreview(item);
      },
      disabled: !isSelectedItemImage
    },
    download: {
      title: "Download File",
      icon: "icon-download-1",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleDownload(item);
      },
      disabled: !isItemFocusedOrSelected,
    },
    fullScreen: {
      title: "Full Screen",
      //   icon: expand ? "icon-minimize" : "icon-resize",
      icon: "icon-resize",
      onClick: operations.handleToggleFullScreen,
      disabled: false,
    },
    uploadFile: {
      title: "Upload Files",
      icon: "icon-cloud-computing",
      onClick: operations.handleToggleUploadPopUp,
      disabled: !selectedFolder,
    },

    searchFile: {
      title: "Search File",
      icon: "icon-search",
      onClick: operations.handleSearchFile,
    },
    editFile: {
      title: "Edit File",
      icon: "icon-pencil",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleEditFile(item, selectedFolder);
      },
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.TEXT,contextMenu, selectedFiles),
    },
    selectFile: {
      title: "Select file",
      icon: "icon-outbox",
      onClick: operations.handleReturnCallBack,
      //   disabled: typeof selectCallback === "undefined",
    },

  };
  return allButtons;
};

export const useGenerateActionButtons = ({ state }: { state: CreateContextType}) => {
  const { operations, selectedFiles, contextMenu, filesList, itemsViewType, bufferedItems, history, selectedFolder, foldersList } = state;
  const allButtons = useMemo(() =>  generateAllButtons(operations, {selectedFiles, contextMenu, filesList, itemsViewType, bufferedItems, history, selectedFolder, foldersList }), [operations, selectedFiles, contextMenu, filesList, itemsViewType, bufferedItems, history, selectedFolder, foldersList ]);

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
          allButtons.paste,
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