import React, { useMemo, useCallback } from "react";
import {
  FolderType,
  Items,
  ContextMenuTypeEnum,
  ViewTypeEnum,
  OrderByType,
  ImagesThumbTypeEnum,
  HistoryType,
  HistoryStepTypeEnum,
  HistoryStep,
  FolderList,
  Message,
  BufferedItemsType,
  ItemMoveActionTypeEnum,
  ItemsList,
  FileType,
  ItemExtensionCategoryFilter,
  ItemType,
  Operations,
  ActionTypes,
  VolumeListItem,
  FileManagerState,
} from "../types";
import { SaveFileParams } from "../Api/types";
import { checkSelectedFileType, convertDate, formatBytes } from "../helpers";
import useApiController from "./useApiController";

export const useFileManagerOperations = ({
  dispatch,
  selectItemCallback,
  selectedVolume,
}: {
  dispatch: any;
  selectItemCallback: ((filePath: string) => void) | undefined;
  selectedVolume: FileManagerState["selectedVolume"];
}): Operations => {
  const apiClient = useApiController(selectedVolume);

  const setMessage = useCallback(
    (message: Omit<Message, "id">) => {
      dispatch({
        type: ActionTypes.SET_MESSAGES,
        payload: {
          id: String(Date.now()),
          ...message,
        },
      });
    },
    [dispatch]
  );

  const handleApiError = useCallback(
    (error: any, errorMessage: string) => {
      dispatch({
        type: ActionTypes.SET_LOADING,
        payload: false,
      });
      dispatch({
        type: ActionTypes.SET_MESSAGES,
        payload: {
          id: String(Date.now()),
          title: errorMessage,
          type: "error",
          message: error?.message || "Unknown error",
        },
      });
    },
    [dispatch]
  );

  const operations: Operations = useMemo(
    () => ({
      handleSelectCallback: (path: string) => {
        if (selectItemCallback) {
          selectItemCallback(path);
        }
      },
      handleSelectTheme: (theme: string) => {
        dispatch({
          type: ActionTypes.SET_SELECTED_THEME,
          payload: theme,
        });
      },
      handleSelectVolume: (selectedVolumeItem: VolumeListItem) => {
        dispatch({
          type: ActionTypes.SET_SELECTED_VOLUME,
          payload: selectedVolumeItem,
        });
      },

      handleSelectFolder: (
        folder: FolderType,
        history: boolean = false,
        clearBuffer: boolean = false,
        showMessage: boolean = true
      ) => {
        dispatch({
          type: ActionTypes.SET_SELECTED_FOLDER,
          payload: {
            folder: { ...folder, children: [] },
            history,
            loading: true,
            clearBuffer,
          },
        });
        apiClient!
          .getFilesList({ path: folder.path })
          .then((data) => {
            dispatch({
              type: ActionTypes.SET_FILES_LIST,
              payload: {
                data,
                loading: false,
                message: showMessage
                  ? {
                      title: "File Successfully Loaded",
                      type: "success",
                      message: "You can paste it in any folder",
                      timer: 1000,
                      id: Date.now().toString() + Math.random().toString(),
                    }
                  : null,
              },
            });
          })
          .catch((error) => handleApiError(error, "Error loading files"));
      },

      handleInitFileManagerData: () => {
        apiClient!.getFolderTree().then((result) => {
          dispatch({
            type: ActionTypes.SET_FOLDERS_LIST,
            payload: result,
          });
          const rootFolder = { ...result, children: [] };
          operations.handleSelectFolder(rootFolder, false, true, true);
        });
      },

      handleReloadFolderTree: () => {
        apiClient!.getFolderTree().then((result) => {
          dispatch({
            type: ActionTypes.SET_FOLDERS_LIST,
            payload: result,
          });
        });
      },

      handleAddSelected: (item: Items) => {
        dispatch({
          type: ActionTypes.ADD_SELECTED_FILE,
          payload: item,
        });
      },

      handleContextClick: ({
        item,
        event,
        menuType,
      }: {
        item: Items | null;
        event: React.MouseEvent;
        menuType: ContextMenuTypeEnum;
      }) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch({
          type: ActionTypes.SET_CONTEXT_MENU,
          payload: {
            item,
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            menuType,
          },
        });
      },

      handleContextClose: () => {
        dispatch({
          type: ActionTypes.SET_CONTEXT_MENU,
          payload: null,
        });
      },

      handleClearBuffer: () => {
        dispatch({
          type: ActionTypes.CLEAR_BUFFER,
          payload: null,
        });
      },

      handleSetViewItemType: (view: ViewTypeEnum) => {
        dispatch({
          type: ActionTypes.SET_ITEM_VIEW,
          payload: view,
        });
      },

      handleSetOrder: (order: OrderByType) => {
        dispatch({
          type: ActionTypes.SET_SORT_ORDER_BY,
          payload: order,
        });
      },

      handleSetThumbView: (view: ImagesThumbTypeEnum) => {
        dispatch({
          type: ActionTypes.SET_IMAGE_SETTINGS,
          payload: view,
        });
      },

      handleUnsetSelected: () => {
        dispatch({
          type: ActionTypes.UNSET_SELECTED_FILES,
          payload: null,
        });
      },

      handleInverseSelected: () => {
        dispatch({
          type: ActionTypes.INVERSE_SELECTED_FILES,
          payload: null,
        });
      },

      handleSelectAll: () => {
        dispatch({
          type: ActionTypes.SELECT_ALL_FILES,
          payload: null,
        });
      },

      handlingHistory: (historyInfo: HistoryStep, index: number) => {
        dispatch({
          type: ActionTypes.SET_HISTORY_INDEX,
          payload: { index },
        });

        switch (historyInfo.action) {
          case HistoryStepTypeEnum.FOLDERCHANGE:
            operations.handleSelectFolder(historyInfo.payload, true);
            break;
          default:
            break;
        }
      },

      handleGoBackWard: (history: HistoryType) => {
        const historyIndex = Math.max(0, history.currentIndex - 1);
        const historyInfo = history.steps[historyIndex];
        operations.handlingHistory(historyInfo, historyIndex);
      },

      handleGoForWard: (history: HistoryType) => {
        if (history.currentIndex + 1 < history.steps.length) {
          const historyIndex = history.currentIndex + 1;
          const historyInfo = history.steps[historyIndex];
          operations.handlingHistory(historyInfo, historyIndex);
        }
      },

      handleGotoParent: (foldersList: FolderList) => {
        operations.handleUnsetSelected();
        operations.handleSelectFolder(foldersList);
      },

      handleCopy: () => {
        dispatch({ type: ActionTypes.COPY_FILES_TOBUFFER, payload: null });
        setMessage({
          title: "File Successfully Copied",
          type: "info",
          message: "You can paste it in any folder",
          timer: 3000,
        });
      },

      handleCut: () => {
        dispatch({ type: ActionTypes.CUT_FILES_TOBUFFER, payload: null });
        setMessage({
          title: "File Successfully Cut",
          type: "info",
          message: "You can paste it in any folder",
          timer: 3000,
        });
      },

      handlePaste: (
        bufferedItems: BufferedItemsType,
        selectedFolder: FolderList
      ) => {
        let includesFolder = false;
        const files: string[] = Array.from(bufferedItems.files).map(
          (item: Items) => {
            if (item.type === ItemType.FOLDER) {
              includesFolder = true;
            }
            return item.path;
          }
        );
        const apiFunction =
          bufferedItems.type === ItemMoveActionTypeEnum.CUT
            ? apiClient!.cutFilesToFolder
            : apiClient!.copyFilesToFolder;

        apiFunction({ items: files, destination: selectedFolder.path })
          .then(() => {
            operations.handleSelectFolder(selectedFolder, true, true, false);
            if (includesFolder) {
              operations.handleReloadFolderTree();
            }
            setMessage({
              title: "File Successfully Pasted",
              type: "success",
              message: "You can paste it in any folder",
              timer: 3000,
            });
          })
          .catch((error) => handleApiError(error, "Error pasting items"));
      },

      handleDelete: (selectedFiles: Set<Items>, selectedFolder: FolderList) => {
        let includesFolder = false;
        const items: string[] = Array.from(selectedFiles).map((item: Items) => {
          if (item.type === ItemType.FOLDER) {
            includesFolder = true;
          }
          return item.path;
        });

        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });

        const handleDeleteSubmit = () => {
          handleClose();
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });

          apiClient!
            .deleteItems({ items })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              if (includesFolder) {
                operations.handleReloadFolderTree();
              }
              setMessage({
                title: "Delete files and folders request",
                type: "success",
                timer: 1500,
                message: "All files and folders successfully deleted",
              });
            })
            .catch((error) => handleApiError(error, "Error deleting items"));
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Deleting selected files and folders: ${selectedFiles.size} items`,
            description:
              "All selected files and folder will remove without recover",
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "Trash",
                label: "Yes, Delete",
                onClick: handleDeleteSubmit,
                variant: "outlined",
                color: "error",
              },
            ],
          },
        });
      },

      handleEmptyFolder: (selectedFolder: FolderList) => {
        const { path } = selectedFolder;
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });

        const handleEmptySubmit = () => {
          handleClose();
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });

          apiClient!
            .emptyDir({ path })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              operations.handleReloadFolderTree();
              setMessage({
                title: "Empty folder request",
                type: "success",
                timer: 1500,
                message: "All files and folders successfully removed",
              });
            })
            .catch((error) => handleApiError(error, "Error emptying folder"));
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: "Empty Folder",
            description:
              "Are you sure, you want to empty this folder? All content will be lost without recover!",
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "Trash",
                label: "Yes, Delete",
                onClick: handleEmptySubmit,
                variant: "outlined",
                color: "error",
              },
            ],
          },
        });
      },
      handleNewFile: (selectedFolder: FolderList) => {
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });

        const handleNewFileSubmit = (fileName: string) => {
          handleClose();
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });

          apiClient!
            .createNewFile({ path: selectedFolder.path, file: fileName })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage({
                title: "Create new file",
                type: "success",
                timer: 1500,
                message: (
                  <>
                    Successfully created new file with the name:{" "}
                    <strong>${fileName}</strong>
                  </>
                ),
              });
            })
            .catch((error) =>
              handleApiError(error, "Error happened while creating file")
            );
        };
        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: "Creating new file",
            description:
              "Only allowed file extensions can be created. Otherwise will be ignored by server.",
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "AddFile",
                label: "Create file",
                onClick: handleNewFileSubmit,
                variant: "outlined",
                color: "success",
              },
            ],
            nameInputSets: {
              label: "File Name",
              value: "new_file.txt",
            },
          },
        });
      },
      handleNewFolder: (selectedFolder: FolderList) => {
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });

        const handleNewFolderSubmit = (folderName: string) => {
          handleClose();
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });

          apiClient!
            .createNewFolder({ path: selectedFolder.path, folder: folderName })
            .then(() => {
              operations.handleReloadFolderTree();
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage({
                title: "Create new folder",
                type: "success",
                timer: 1500,
                message: (
                  <>
                    Successfully created new folder with the name:{" "}
                    <strong>${folderName}</strong>
                  </>
                ),
              });
            })
            .catch((error) =>
              handleApiError(error, "Error happened while creating folder")
            );
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: "Creating new folder",
            description:
              "Dont use spaces, localised symbols or emojies. This can affect problems",
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "AddFile",
                label: "Create folder",
                onClick: handleNewFolderSubmit,
                variant: "outlined",
                color: "success",
              },
            ],
            nameInputSets: {
              label: "Folder Name",
              value: "newfolder",
            },
          },
        });
      },
      handleRename: (selectedFile: Items, selectedFolder: FolderList) => {
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });
        const includesFolder = selectedFile.type === ItemType.FOLDER;
        const handleRenameSubmit = (folderName: string) => {
          handleClose();
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });

          apiClient!
            .renameFiles({ path: selectedFile.path, newname: folderName })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              if (includesFolder) {
                operations.handleReloadFolderTree();
              }

              setMessage({
                title: "Renaming selected item",
                type: "success",
                timer: 1500,
                message: (
                  <>
                    Successfully renamed selected item from
                    <strong>{selectedFile.name}</strong> to
                    <strong>{folderName}</strong>
                  </>
                ),
              });
            })
            .catch((error) =>
              handleApiError(error, "Error happened while renaming file")
            );
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Renaming ${selectedFile.name}`,
            description:
              "Dont use spaces, localised symbols or emojies. This can affect problems",
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "AddFile",
                label: "Yes, rename",
                onClick: handleRenameSubmit,
                variant: "outlined",
                color: "success",
              },
            ],
            nameInputSets: {
              label: "New Name",
              value: selectedFile.name,
            },
          },
        });
      },
      handleDuplicate: (selectedFile: Items, selectedFolder: FolderList) => {
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });

        const handleDuplicateSubmit = () => {
          handleClose();
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });
          apiClient!
            .duplicateItem({ path: selectedFile.path })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage({
                title: "Duplicating selected item",
                type: "success",
                timer: 1500,
                message: (
                  <>
                    Selected file <strong>{selectedFile.name}</strong>{" "}
                    successfully duplicated
                  </>
                ),
              });
            })
            .catch((error) =>
              handleApiError(error, "Error happened while duplicating file")
            );
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Duplicating ${selectedFile.name}`,
            description: (
              <>New file will be named &quot;copy_of_[original_name]&quot;</>
            ),
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "AddFile",
                label: "Yes, duplicate",
                onClick: handleDuplicateSubmit,
                variant: "outlined",
                color: "success",
              },
            ],
          },
        });
      },
      handleCreateZip: (
        selectedFiles: Set<Items>,
        selectedFolder: FolderList
      ) => {
        const files: string[] = Array.from(selectedFiles).map(
          (item: Items) => item.path
        );
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });

        const handleArchiveSubmit = (fileName: string) => {
          handleClose();
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });
          apiClient!
            .archive({
              files,
              destination: selectedFolder.path,
              name: fileName,
            })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage({
                title: "Archiving selected items",
                type: "success",
                timer: 1500,
                message: (
                  <>
                    Selected <strong />
                    {selectedFiles.size} items are successfully archived into
                    file <strong>{fileName}</strong>
                  </>
                ),
              });
            })
            .catch((error) =>
              handleApiError(error, "Error happened while creating archive")
            );
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Creating archive for ${selectedFiles.size} items`,
            description: (
              <>
                Dont use spaces, localised symbols or emojies. This can affect
                problems
              </>
            ),
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "AddFile",
                label: "Create archive",
                onClick: handleArchiveSubmit,
                variant: "outlined",
                color: "success",
              },
            ],
            nameInputSets: {
              label: "Archive name",
              value: "archive.zip",
            },
          },
        });
      },
      handleExtractZip: (selectedFile: Items, selectedFolder: FolderList) => {
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });

        const handleExtractSubmit = () => {
          handleClose();
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true,
          });

          apiClient!
            .unzip({
              file: selectedFile.path,
              destination: selectedFolder.path,
            })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage({
                title: "Extracting selected archive",
                type: "success",
                timer: 1500,
                message: <>Successfully extracted selected archive</>,
              });
            })
            .catch((error) =>
              handleApiError(error, "Error happened while extracting archive")
            );
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Extracting archive ${selectedFile.name}`,
            description: (
              <>Do you want extract selected archive in this folder</>
            ),
            actionButtons: [
              {
                icon: "Ban",
                label: "Cancel",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
              {
                icon: "AddFile",
                label: "Extract archive",
                onClick: handleExtractSubmit,
                variant: "outlined",
                color: "success",
              },
            ],
          },
        });
      },
      handleEditFile: (selectedFile: FileType, selectedFolder: FolderList) => {
        const handleCloseEdit = () =>
          dispatch({ type: ActionTypes.SET_FILEEDIT_DATA, payload: null });
        const handleSubmitEdit = (data: SaveFileParams) => {
          apiClient!
            .saveFile(data)
            .then(() => {
              handleCloseEdit();
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage({
                title: "File changes",
                type: "success",
                timer: 1500,
                message: (
                  <>
                    File changes for
                    <strong>{selectedFile.name}</strong> successfully saved
                  </>
                ),
              });
            })
            .catch((error) =>
              handleApiError(error, "Error happened while saving")
            );
        };
        dispatch({
          type: ActionTypes.SET_FILEEDIT_DATA,
          payload: {
            closeCallBack: handleCloseEdit,
            submitCallback: handleSubmitEdit,
            name: selectedFile.name,
            path: selectedFile.path,
            extension: selectedFile.extension,
          },
        });
      },
      handleGetInfo: (selectedFile: Items) => {
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });
        const isImage =
          selectedFile.type === ItemType.FILE &&
          checkSelectedFileType(
            ItemExtensionCategoryFilter.IMAGE,
            selectedFile
          );

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `File: ${selectedFile.name}`,
            description: (
              <>
                <ul className="list">
                  <li>
                    <b>Name</b> : {selectedFile.name}
                  </li>
                  <li>
                    <b>Path</b> : {selectedFile.path}
                  </li>
                  {selectedFile.type === ItemType.FILE && (
                    <>
                      <li>
                        <b>Size</b> : {formatBytes(selectedFile.size)}
                      </li>
                      <li>
                        <b>Extension</b> : {selectedFile.extension}
                      </li>
                    </>
                  )}
                  <li>
                    <b>Created</b> : {convertDate(selectedFile.created)}
                  </li>
                  <li>
                    <b>Modified</b> : {convertDate(selectedFile.modified)}
                  </li>
                  <li>
                    <b>Permissions</b> : Others -
                    {selectedFile.premissions?.others}, Group -
                    {selectedFile.premissions?.group}, Owner -
                    {selectedFile.premissions?.owner}
                  </li>
                </ul>
                {isImage && (
                  <img
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    alt={selectedFile.name}
                    src={operations.handleGetThumb(selectedFile)}
                  />
                )}
              </>
            ),
            actionButtons: [
              {
                icon: "Cancel2",
                label: "Close",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
            ],
          },
        });
      },
      handlePreview: (selectedFile: FileType) => {
        const handleClose = () =>
          dispatch({ type: ActionTypes.SET_POPUP_DATA, payload: null });
        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `File: ${selectedFile.name}`,
            description: (
              <img
                style={{ maxWidth: "400px", maxHeight: "400px" }}
                alt={selectedFile.name}
                src={operations.handleGetThumb(selectedFile)}
              />
            ),
            actionButtons: [
              {
                icon: "Cancel2",
                label: "Close",
                color: "warning",
                onClick: handleClose,
                variant: "outlined",
              },
            ],
          },
        });
      },
      handleDownload: (selectedFile: FileType) => {
        setTimeout(() => {
          window.open(`${selectedFile.path}`);
          // window.open(`${mainconfig.serverPath}${selectedFile.path}`);
        }, 100);
      },
      handleGetThumb: (selectedFile: FileType) => {
        if (!apiClient) return undefined;
        return apiClient.getThumb(selectedFile.path);
      },

      handleToggleFullScreen: () => {
        dispatch({ type: ActionTypes.TOGGLE_FULLSCREEN, payload: null });
      },
      handleToggleUploadPopUp: (forceShow?: boolean) => {
        dispatch({ type: ActionTypes.TOGGLE_UPLOAD_POPUP, payload: forceShow });
      },

      handleUploadFiles: (files, selectedFolder) => {
        const handleCloseEdit = () =>
          dispatch({ type: ActionTypes.TOGGLE_UPLOAD_POPUP, payload: null });

        const formData = new FormData();
        formData.append("path", selectedFolder.path);
        files.forEach((file) => {
          formData.append("files", file, file.name);
        });

        apiClient!
          .uploadFile(formData)
          .then(() => {
            handleCloseEdit();
            operations.handleSelectFolder(selectedFolder, true, true, false);
            operations.handleReloadFolderTree();
            setMessage({
              title: "File upload",
              type: "success",
              timer: 1500,
              message: (
                <>
                  File had been successfully uploaded into
                  <strong>{selectedFolder.name}</strong> folder
                </>
              ),
            });
          })
          .catch((error) =>
            handleApiError(error, "Error happened while uploading files.")
          );
      },

      handleDragEnd: (draggedItems: ItemsList, destination: FolderType) => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        let includesFolder = false;
        const files: string[] = draggedItems.map((item: Items) => {
          if (item.type === ItemType.FOLDER) {
            includesFolder = true;
          }
          return item.path;
        });
        const isSelectedItemDroppedIntoSelf = draggedItems.find(
          (item) => item.id === destination.id
        );

        if (isSelectedItemDroppedIntoSelf) {
          setMessage({
            title: "You can't drag and drop selected folder into itself.",
            type: "warning",
            message: "",
            timer: 1500,
          });
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
          return;
        }

        apiClient!
          .cutFilesToFolder({ items: files, destination: destination.path })
          .then(() => {
            operations.handleSelectFolder(destination, true, true, false);
            if (includesFolder) {
              operations.handleReloadFolderTree();
            }
            setMessage({
              title: "Files successfully moved",
              type: "success",
              message: "",
              timer: 1500,
            });
          })
          .catch((error) => handleApiError(error, "Error moving items"));
      },
    }),
    [dispatch, setMessage, handleApiError, apiClient, selectItemCallback]
  );

  return operations;
};

export default useFileManagerOperations;
