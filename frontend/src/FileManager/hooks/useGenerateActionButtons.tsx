import { useMemo } from "react";
import type { ButtonObject, CreateContextType, FileManagerState } from "../types";
import { ViewTypeEnum, ItemType, ItemExtensionCategoryFilter } from "../types";

import { checkSelectedFileType } from "../utils";

type GenerateButtonsStateProps = Pick<
  FileManagerState,
  "selectedFiles" | "contextMenu" | "filesList" | "bufferedItems" | "history" | "selectedFolder" | "foldersList"
> & {
  itemsViewType: FileManagerState["settings"]["itemsViewType"];
};
const isSelectedFileType = (
  type: ItemExtensionCategoryFilter,
  contextMenu: CreateContextType["contextMenu"],
  selectedFiles: CreateContextType["selectedFiles"]
) => {
  if (selectedFiles.size !== 1 && !contextMenu?.item) return false;
  const selectedItem = contextMenu?.item ?? Array.from(selectedFiles)[0];
  if (selectedItem && selectedItem.type !== ItemType.FILE) return false;
  return checkSelectedFileType(type, selectedItem);
};

// export const generateAllButtons = (operations: Operations, state: FileManagerState): ButtonObject => {
export const generateAllButtons = (operations: any, state: GenerateButtonsStateProps): ButtonObject => {
  const { selectedFiles, contextMenu, filesList, itemsViewType, bufferedItems, history, selectedFolder, foldersList } =
    state;
  const isItemFocusedOrSelected = ((contextMenuProp, selectedFilesList) =>
    Boolean(contextMenuProp?.item) || selectedFilesList.size === 1)(contextMenu, selectedFiles);

  const isSelectedItemImage = isSelectedFileType(ItemExtensionCategoryFilter.IMAGE, contextMenu, selectedFiles);

  const allButtons: ButtonObject = {
    copy: {
      title: "Copy",
      icon: "Copy",
      onClick: operations.handleCopy,
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    cut: {
      title: "Cut",
      icon: "Cut",
      onClick: operations.handleCut,
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    paste: {
      title: "Paste",
      icon: "Paste",
      onClick: () => operations.handlePaste(bufferedItems, selectedFolder),
      disabled: !(bufferedItems.files.size > 0),
    },
    delete: {
      title: "Delete",
      icon: "Trash",
      onClick: () => {
        const items = selectedFiles.size > 0 ? selectedFiles : new Set([contextMenu?.item]);
        operations.handleDelete(items, selectedFolder);
      },
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    emptyFolder: {
      title: "Empty Folder",
      icon: "DeleteFolder",
      onClick: () => operations.handleEmptyFolder(selectedFolder),
      disabled: !selectedFolder,
    },
    rename: {
      title: "Rename",
      icon: "Text",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleRename(item, selectedFolder);
      },
      disabled: !isItemFocusedOrSelected,
    },
    newFile: {
      title: "Few File",
      icon: "AddFile",
      onClick: () => operations.handleNewFile(selectedFolder),
      disabled: !selectedFolder,
    },
    newFolder: {
      title: "New Folder",
      icon: "AddFolder",
      onClick: () => operations.handleNewFolder(selectedFolder),
      disabled: !selectedFolder,
    },
    goForwad: {
      title: "Forwad",
      icon: "Forward",
      onClick: () => operations.handleGoForWard(history),
      disabled: !(history.currentIndex + 1 < history.steps.length),
    },
    goParent: {
      title: "Go to parent folder",
      icon: "Backward",
      onClick: () => operations.handleGotoParent(foldersList),
      disabled: selectedFolder?.path === "/",
    },
    goBack: {
      title: "Back",
      icon: "Backward",
      onClick: () => operations.handleGoBackWard(history),
      disabled: !(history.currentIndex > 0),
    },
    selectAll: {
      title: "Select all",
      icon: "SelectAll",
      onClick: operations.handleSelectAll,
      disabled: !(selectedFiles.size !== filesList.length),
    },
    selectNone: {
      title: "Select none",
      icon: "Cursor",
      onClick: operations.handleUnsetSelected,
      disabled: selectedFiles.size === 0,
    },
    inverseSelected: {
      title: "Invert selection",
      icon: "Refresh",
      onClick: operations.handleInverseSelected,
      disabled: !(selectedFiles.size !== filesList.length && selectedFiles.size > 0),
    },
    reload: {
      title: "Reload",
      icon: "Refresh",
      onClick: () => operations.handleSelectFolder(selectedFolder, true, true),
    },
    dubplicate: {
      title: "Duplicate",
      icon: "Layers",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleDuplicate(item, selectedFolder);
      },
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.FILE, contextMenu, selectedFiles),
    },
    editImage: {
      title: "Resize & Rotate",
      icon: "PaintPalette",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleEditFile(item, selectedFolder);
      },
      disabled: !isSelectedItemImage,
    },
    createZip: {
      title: "Create archive",
      icon: "UnZip",
      onClick: () => {
        const items = selectedFiles.size > 0 ? selectedFiles : new Set([contextMenu?.item]);
        operations.handleCreateZip(items, selectedFolder);
      },
      disabled: !(selectedFiles.size > 0 || isItemFocusedOrSelected),
    },
    extractZip: {
      title: "Extract files from archive",
      icon: "Zip",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleExtractZip(item, selectedFolder);
      },
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.ARCHIVE, contextMenu, selectedFiles),
    },
    gridView: {
      title: "Grid view",
      icon: "GridView",
      onClick: () => operations.handleSetViewItemType(ViewTypeEnum.GRID),
      disabled: itemsViewType === ViewTypeEnum.GRID,
    },
    listView: {
      title: "List View",
      icon: "ListView",
      onClick: () => operations.handleSetViewItemType(ViewTypeEnum.LIST),
      disabled: itemsViewType === ViewTypeEnum.LIST,
    },
    getInfo: {
      title: "Get Info",
      icon: "Information",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleGetInfo(item);
      },
      disabled: !isItemFocusedOrSelected,
    },
    preview: {
      title: "View",
      icon: "View",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handlePreview(item);
      },
      disabled: !isSelectedItemImage,
    },
    download: {
      title: "Download File",
      icon: "Download",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleDownload(item);
      },
      disabled: !isItemFocusedOrSelected,
    },
    fullScreen: {
      title: "Full Screen",
      //   icon: expand ? "icon-minimize" : "Resize",
      icon: "Resize",
      onClick: operations.handleToggleFullScreen,
      disabled: false,
    },
    uploadFile: {
      title: "Upload Files",
      icon: "Upload",
      onClick: operations.handleToggleUploadPopUp,
      disabled: !selectedFolder,
    },

    searchFile: {
      title: "Search File",
      icon: "Search",
      onClick: operations.handleSearchFile,
    },
    editFile: {
      title: "Edit File",
      icon: "Pencil",
      onClick: () => {
        const item = selectedFiles.size > 0 ? Array.from(selectedFiles)[0] : contextMenu?.item;
        operations.handleEditFile(item, selectedFolder);
      },
      disabled: !isSelectedFileType(ItemExtensionCategoryFilter.TEXT, contextMenu, selectedFiles),
    },
    selectFile: {
      title: "Select file",
      icon: "Outbox",
      onClick: operations.handleReturnCallBack,
      //   disabled: typeof selectCallback === "undefined",
    },
  };
  return allButtons;
};

export const useGenerateActionButtons = ({ state }: { state: CreateContextType }) => {
  const {
    operations,
    selectedFiles,
    contextMenu,
    filesList,
    settings,
    bufferedItems,
    history,
    selectedFolder,
    foldersList,
  } = state;
  const allButtons = useMemo(
    () =>
      generateAllButtons(operations, {
        selectedFiles,
        contextMenu,
        filesList,
        itemsViewType: settings.itemsViewType,
        bufferedItems,
        history,
        selectedFolder,
        foldersList,
      }),
    [
      operations,
      selectedFiles,
      contextMenu,
      filesList,
      settings.itemsViewType,
      bufferedItems,
      history,
      selectedFolder,
      foldersList,
    ]
  );

  const aviableButtons = useMemo(
    () => ({
      topbar: [
        [allButtons.goBack, allButtons.goForwad, allButtons.goParent],
        [allButtons.newFile, allButtons.newFolder, allButtons.uploadFile, allButtons.reload],
        [
          allButtons.copy,
          allButtons.cut,
          allButtons.paste,
          allButtons.delete,
          allButtons.emptyFolder,
          allButtons.dubplicate,
        ],
        [allButtons.rename, allButtons.editImage],
        [allButtons.inverseSelected, allButtons.selectNone, allButtons.selectAll],
        [allButtons.createZip, allButtons.extractZip],
        [allButtons.preview, allButtons.getInfo, allButtons.selectFile, allButtons.download],
        [allButtons.gridView, allButtons.listView, allButtons.fullScreen],
      ],
      file: [
        [allButtons.copy, allButtons.cut, allButtons.paste, allButtons.delete, allButtons.dubplicate],
        [allButtons.rename, allButtons.editImage],
        [allButtons.createZip, allButtons.extractZip],
        [allButtons.preview, allButtons.getInfo, allButtons.selectFile, allButtons.download],
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
        [allButtons.inverseSelected, allButtons.selectNone, allButtons.selectAll],
        [allButtons.gridView, allButtons.listView, allButtons.fullScreen],
      ],
    }),
    [allButtons]
  );

  return aviableButtons;
};

export default useGenerateActionButtons;
