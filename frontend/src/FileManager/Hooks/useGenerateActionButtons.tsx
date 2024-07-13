import { useState, useMemo, useCallback } from "react";
import { ButtonObject, PopupData, EditImage } from "../types";
import { checkSelectedFileType } from "../helpers";

import {
  useFileManagerState,
  useFileManagerDispatch,
  FileManagerProvider,
} from "../ContextStore/FileManagerContext";
import { ActionTypes } from '../ContextStore/types';

export const generateAllButtons = (operations: any): ButtonObject => {
  const allButtons: ButtonObject = {
    copy: {
      title: "Copy",
      icon: "icon-copy",
      onClick: operations.handleCopy,
      //   disabled: !(props?.selectedFiles.length > 0),
    },
    cut: {
      title: "Cut",
      icon: "icon-scissors",
      onClick: operations.handleCut,
      //   disabled: !(props?.selectedFiles.length > 0),
    },
    paste: {
      title: "Paste",
      icon: "icon-paste",
      onClick: operations.handlePaste,
      //   disabled: !(props?.bufferedItems.files.length > 0),
    },
    delete: {
      title: "Delete",
      icon: "icon-trash",
      onClick: operations.handleDelete,
      //   disabled: !(props?.selectedFiles.length > 0),
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
      //   disabled: !(props?.selectedFiles.length === 1),
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
      //   disabled: !(
      //     props?.selectedFiles.length !== props?.filesList.length &&
      //     props?.selectedFiles.length > 0
      //   ),
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
      //   disabled: !(props?.selectedFiles.length === 1),
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
      //   disabled: !(props?.selectedFiles.length === 1),
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
      onClick: () => operations.handleViewChange("grid"),
      //   disabled: props?.itemsView === "grid",
    },
    listView: {
      title: "List View",
      icon: "icon-layout-2",
      onClick: () => operations.handleViewChange("list"),
      //   disabled: props?.itemsView === "list",
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

export const useFileManagerOperations = (props: any) => {
  const dispatch = useFileManagerDispatch();

  const handlingHistory = (
    historyInfo: { action: string; path: string },
    index: number
  ) => {
    props?.setHistoryIndex(index);
    props?.unsetSelectedFiles();
    switch (historyInfo.action) {
      case "folderChange":
        operations.handleSetMainFolder(historyInfo.path, true);
        break;
      default:
        break;
    }
  };

  const setMessages = useCallback(([]) => {}, []); // (messages: any[]) => void,
  //   const setPopup = useCallback(() => {}, []); // (popupData: PopupData) => void,
  //   const setLoading = useCallback(() => {}, []); // (loading: boolean) => void,
  //   const setEditImage = useCallback(() => {}, []); // (editImage: EditImage) => void

  const operations = useMemo(
    () => ({
      handleAddSelected: (path: string) => {
        props?.setSelectedFiles(path);
      },
      handleUnsetSelected: () => {
        props?.unsetSelectedFiles();
      },
      handleInverseSelected: () => {
        props?.inverseSelectedFiles();
      },
      handleSelectAll: () => {
        props?.selectAllFiles();
      },
      handleGotoParent: () => {
        props?.unsetSelectedFiles();
        operations.handleSetMainFolder(props?.foldersList.path);
      },
      handleGoBackWard: () => {
        let historyIndex =
          props?.history.currentIndex > 0 ? props?.history.currentIndex - 1 : 0;
        let historyInfo = props?.history.steps[historyIndex];
        handlingHistory(historyInfo, historyIndex);
      },
      handleGoForWard: () => {
        if (props?.history.currentIndex + 1 < props?.history.steps.length) {
          let historyIndex = props?.history.currentIndex + 1;
          let historyInfo = props?.history.steps[historyIndex];
          handlingHistory(historyInfo, historyIndex);
        }
      },
      handleCopy: () => {
        props?.copyToBufferFiles();
        setMessages([
          {
            title: `File Successfully Copied`,
            type: "info",
            message: "You can paste it in any folder",
            timer: 3000,
          },
        ]);
      },
      handleCut: () => {
        props?.cutToBufferFiles();
        setMessages([
          {
            title: `File Successfully Cut`,
            type: "info",
            message: "You can paste it in any folder",
            timer: 3000,
          },
        ]);
      },
      handlePaste: () => {
        // let files = props?.bufferedItems.files.map((item) => item.path);
        // props
        //   .pasteFiles(files, props?.bufferedItems.type, props?.selectedFolder)
        //   .then(() => {
        //     operations.handleReload();
        //     setMessages([
        //       {
        //         title: `File Successfully Pasted`,
        //         type: "success",
        //         message: "You can paste it in any folder",
        //         timer: 3000,
        //       },
        //     ]);
        //   })
        //   .catch((error) => {
        //     setMessages([
        //       {
        //         title: `Error happened while paste items`,
        //         type: "error",
        //         message: error?.message,
        //       },
        //     ]);
        //   });
      },
      handleSetMainFolder: (value: string, history: boolean = false) => {
        // props?.unsetSelectedFiles();
        // props?.setSelectedFolder(value, history);
        // props?.getFilesList(value).then(() => {
        //   setMessages([
        //     {
        //       title: `File Successfully Loaded`,
        //       type: "success",
        //       message: "You can paste it in any folder",
        //       timer: 3000,
        //     },
        //   ]);
        // });
      },
      handleDelete: () => {
        // let files = props?.selectedFiles.map((item) => item.path) as any;
        // const handleDeleteSubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .deleteItems(files)
        //     .then(() => {
        //       props?.unsetSelectedFiles();
        //       operations.handleReload();
        //       setMessages([
        //         {
        //           title: `Delete files and folders request`,
        //           type: "success",
        //           message: "All files and folders successfully deleted",
        //         },
        //       ]);
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while removing`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Deleting selected files and folders: ${props?.selectedFiles.length} items`,
        //   description: `All selected files and folder will remove without recover`,
        //   handleClose: handleClose,
        //   handleSubmit: handleDeleteSubmit,
        //   nameInputSets: {},
        // });
      },
      handleEmptyFolder: () => {
        // var path = props?.selectedFolder;
        // const handleEmptySubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .emptydir(path)
        //     .then(() => {
        //       props?.unsetSelectedFiles();
        //       operations.handleReload();
        //       setMessages([
        //         {
        //           title: `Empty folder request`,
        //           type: "success",
        //           message: "All files and folders successfully removed",
        //         },
        //       ]);
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while empty folder`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Deleting all files and folders in ${path}`,
        //   description: `All files and folder will remove without recover`,
        //   handleClose: handleClose,
        //   handleSubmit: handleEmptySubmit,
        //   nameInputSets: {},
        // });
      },
      handleNewFile: () => {
        // var fileName = "new_file.txt";
        // const handleNewFileChange = (value: string) => {
        //   fileName = value;
        // };
        // const handleNewFileSubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .createNewFile(props?.selectedFolder, fileName)
        //     .then(() => {
        //       operations.handleReload();
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while creating file`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Creating new file`,
        //   description:
        //     "Only allowed file extensions can be created. Otherwise will be ignored by server.",
        //   handleClose: handleClose,
        //   handleSubmit: handleNewFileSubmit,
        //   nameInputSets: {
        //     label: "File Name",
        //     value: fileName,
        //     callBack: handleNewFileChange,
        //   },
        // });
      },
      handleNewFolder: () => {
        // var folderName = "newfolder";
        // const handleNewFolderChange = (value: string) => {
        //   folderName = value;
        // };
        // const handleNewFolderSubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .createNewFolder(props?.selectedFolder, folderName)
        //     .then(() => {
        //       operations.handleReload();
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while creating folder`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Creating new folder`,
        //   description:
        //     "Dont use spaces, localised symbols or emojies. This can affect problems",
        //   handleClose: handleClose,
        //   handleSubmit: handleNewFolderSubmit,
        //   nameInputSets: {
        //     label: "Folder Name",
        //     value: folderName,
        //     callBack: handleNewFolderChange,
        //   },
        // });
      },
      handleRename: () => {
        // var item = props?.selectedFiles[0];
        // var newName = item.name;
        // const handleRenameChange = (value: string) => {
        //   newName = value;
        // };
        // const handleRenameSubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .renameFiles(item.path, newName)
        //     .then(() => {
        //       operations.handleReload();
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while renaming file`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Renaming ${item.name}`,
        //   description:
        //     "Dont use spaces, localised symbols or emojies. This can affect problems",
        //   handleClose: handleClose,
        //   handleSubmit: handleRenameSubmit,
        //   nameInputSets: {
        //     label: "New Name",
        //     value: newName,
        //     callBack: handleRenameChange,
        //   },
        // });
      },
      handleDuplicate: () => {
        // var item = props?.selectedFiles[0];
        // const handleDuplicateSubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .dublicateItem(item.path)
        //     .then(() => {
        //       operations.handleReload();
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while duplicating file`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Duplicating ${item.name}`,
        //   description: 'New file will be named "copy_of_[original_name]"',
        //   handleClose: handleClose,
        //   handleSubmit: handleDuplicateSubmit,
        //   nameInputSets: {},
        // });
      },
      handleReload: () => {
        // setLoading(true);
        // props
        //   .getFilesList(props?.selectedFolder)
        //   .then(() => {
        //     setLoading(false);
        //   })
        //   .catch((error) => {
        //     setMessages([
        //       {
        //         title: `Error happened while reloading`,
        //         type: "error",
        //         message: error.message,
        //       },
        //     ]);
        //   });
      },
      handleCreateZip: () => {
        // var files = props?.selectedFiles.map((item) => item.path);
        // var name = "archive.zip";
        // const handleArchiveChange = (value: string) => {
        //   name = value;
        // };
        // const handleArchiveSubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .archive(files, props?.selectedFolder, name)
        //     .then(() => {
        //       operations.handleReload();
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while creating archive`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Creating archive for ${props?.selectedFiles.length} items`,
        //   description:
        //     "Dont use spaces, localised symbols or emojies. This can affect problems",
        //   handleClose: handleClose,
        //   handleSubmit: handleArchiveSubmit,
        //   nameInputSets: {
        //     label: "Archive name",
        //     value: name,
        //     callBack: handleArchiveChange,
        //   },
        // });
      },
      handleExtractZip: () => {
        // var item = props?.selectedFiles[0];
        // var destination = props?.selectedFolder;
        // const handleExtractSubmit = () => {
        //   setPopup({ open: false });
        //   props
        //     .extract(item.path, destination)
        //     .then(() => {
        //       operations.handleReload();
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while extracting archive`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setPopup({
        //   open: true,
        //   title: `Extracting archive ${item.name}`,
        //   handleClose: handleClose,
        //   handleSubmit: handleExtractSubmit,
        //   nameInputSets: {},
        // });
      },
      handleEdit: () => {
        // var item = props?.selectedFiles[0];
        // const handleCloseEdit = () => {
        //   setEditImage({ open: false });
        // };
        // const handleSubmitEdit = (data: any) => {
        //   props
        //     .submitEdit(data)
        //     .then((result) => {
        //       setEditImage({ open: false });
        //       operations.handleReload();
        //     })
        //     .catch((error) => {
        //       setMessages([
        //         {
        //           title: `Error happened while editing`,
        //           type: "error",
        //           message: error.message,
        //         },
        //       ]);
        //     });
        // };
        // setEditImage({
        //   open: true,
        //   closeCallBack: handleCloseEdit,
        //   submitCallback: handleSubmitEdit,
        //   name: item.name,
        //   path: item.path,
        //   extension: item.extension,
        // });
      },
    }),
    []
  );
  const allButtons = useMemo(() => {
    return generateAllButtons(operations);
  }, [operations]);

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

  return { operations, aviableButtons };
};

export default useFileManagerOperations;
