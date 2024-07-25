import {  useMemo, useCallback } from "react";
import { ButtonObject, PopupData, EditImage, FolderType, Items, ContextMenuTypeEnum, ViewTypeEnum, OrderByType, ImagesThumbTypeEnum } from "../types";
import { ActionTypes, CreateContextType } from '../ContextStore/types';
import { getFilesList } from '../Api/fileManagerServices';
import { DropResult } from "react-beautiful-dnd";

export const useFileManagerOperations = ({ dispatch , state }: {dispatch: any, state: CreateContextType}) => {

  const handlingHistory = (
    historyInfo: { action: string; path: string },
    index: number
  ) => {
    // props?.setHistoryIndex(index);
    // props?.unsetSelectedFiles();
    switch (historyInfo.action) {
      case "folderChange":
        // operations.handleSetMainFolder(historyInfo.path, true);
        break;
      default:
        break;
    }
  };

  const setMessages = useCallback((messages: any[]) => {
    dispatch({
      type: ActionTypes.SET_MESSAGES,
      payload: messages,
    });
  }, [dispatch]);
  //   const setPopup = useCallback(() => {}, []); // (popupData: PopupData) => void,
  //   const setLoading = useCallback(() => {}, []); // (loading: boolean) => void,
  //   const setEditImage = useCallback(() => {}, []); // (editImage: EditImage) => void

  const operations = useMemo(
    () => ({
      handleSelectFolder: (folder: FolderType, history: boolean = false) => {
        dispatch({
          type: ActionTypes.SET_SELECTED_FOLDER,
          payload: {folder, history, loading: true},
        });
        getFilesList({ path: folder.path }).then((data) => {
          dispatch({
            type: ActionTypes.SET_FILES_LIST,
            payload: { 
              data,
              loading: false,
              message: {
                title: `File Successfully Loaded`,
                type: "success",
                message: "You can paste it in any folder",
                timer: 1000,
                id: Date.now().toString() + Math.random().toString()
              }
            },
          });
        });
      },
      handleAddSelected: (item: Items) => {
        dispatch({
          type: ActionTypes.ADD_SELECTED_FILE,
          payload: item
        });
      },
      handleContextClick: ({ item, event, menuType }: { item: Items | null, event: React.MouseEvent, menuType: ContextMenuTypeEnum} )=>{
        event.stopPropagation();
        event.preventDefault();
        dispatch({
          type: ActionTypes.SET_CONTEXT_MENU,
          payload: { 
            item,
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            menuType
          }
        });

      },
      handleContextClose:(event: React.MouseEvent)=>{
        event.stopPropagation();
        event.preventDefault();
        dispatch({
          type: ActionTypes.SET_CONTEXT_MENU,
          payload: null
        });
      },
      handleClearBuffer: ()=>{
        dispatch({
          type: ActionTypes.CLEAR_BUFFER,
          payload: null
        })
      },
      handleDragEnd: (result: DropResult) => {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: true
        });
        try {
            // let files = [];
            // let destination;
            // props.filesList.forEach(file => {
            //   if(file.id === result.draggableId){
            //     files = [file.path];
            //   }
            //   if(file.id === result.destination.droppableId){
            //     destination = file.path;
            //   }
            // });
    
            // if(destination !== undefined && files.length !== 0){
            //     props.pasteFiles(files, 'cut', destination).then(result =>{
            //         operations.handleReload();
            //         setMessages([{
            //             title: `File Successfully Moved`,
            //             type:'success',
            //             message: 'File that you dragged successfully moved',
            //             timer: 3000,
            //         }]);
            //     }).catch((error)=>{
                  
            //     });
            // }
           
          } catch (error) {
            console.log('Error happened while dropping item', error);
          }finally{
            dispatch({
              type: ActionTypes.SET_LOADING,
              payload: true
            });
          }
          
      },
      handleSetViewItemType: (view: ViewTypeEnum)=>{
        dispatch({
          type: ActionTypes.SET_ITEM_VIEW,
          payload: view
        })
      },
      handleSetOrder: (order: OrderByType)=> {
        dispatch({
          type: ActionTypes.SET_SORT_ORDER_BY,
          payload: order
        })
      },
      handleSetThumbView: (view: ImagesThumbTypeEnum)=> {
        dispatch({
          type: ActionTypes.SET_IMAGE_SETTINGS,
          payload: view
        })
      },
      handleUnsetSelected: () => {
        dispatch({
          type: ActionTypes.UNSET_SELECTED_FILES,
          payload: null
        })
      },
      handleInverseSelected: () => {
        dispatch({
          type: ActionTypes.INVERSE_SELECTED_FILES,
          payload: null
        })      
      },
      handleSelectAll: () => {
        dispatch({
          type: ActionTypes.SELECT_ALL_FILES,
          payload: null
        })
      },

      handleGotoParent: () => {
        operations.handleUnsetSelected();
        // operations.handleSetMainFolder(props?.foldersList.path);
      },
      
      handleGoBackWard: () => {
        // let historyIndex =
        //   props?.history.currentIndex > 0 ? props?.history.currentIndex - 1 : 0;
        // let historyInfo = props?.history.steps[historyIndex];
        // handlingHistory(historyInfo, historyIndex);
      },
      handleGoForWard: () => {
        // if (props?.history.currentIndex + 1 < props?.history.steps.length) {
        //   let historyIndex = props?.history.currentIndex + 1;
        //   let historyInfo = props?.history.steps[historyIndex];
        //   handlingHistory(historyInfo, historyIndex);
        // }
      },
      handleCopy: () => {
        // props?.copyToBufferFiles();
        // setMessages([
        //   {
        //     title: `File Successfully Copied`,
        //     type: "info",
        //     message: "You can paste it in any folder",
        //     timer: 3000,
        //   },
        // ]);
      },
      handleCut: () => {
        // props?.cutToBufferFiles();
        // setMessages([
        //   {
        //     title: `File Successfully Cut`,
        //     type: "info",
        //     message: "You can paste it in any folder",
        //     timer: 3000,
        //   },
        // ]);
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
    [dispatch]
  );

  const stateOperations = useMemo(()=>{

  },[state]);


  return { operations, stateOperations };
};

export default useFileManagerOperations;