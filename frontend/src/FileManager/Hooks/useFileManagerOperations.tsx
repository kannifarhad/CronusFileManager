import {  useMemo, useCallback } from "react";
import { EditImage, FolderType, Items, ContextMenuTypeEnum, ViewTypeEnum, OrderByType, ImagesThumbTypeEnum, HistoryType, HistoryStepTypeEnum, HistoryStep, FolderList, Message, BufferedItemsType, ItemMoveActionTypeEnum, ItemsList, FileType } from "../types";
import { ActionTypes } from '../ContextStore/types';
import { getFilesList, copyFilesToFolder, cutFilesToFolder, deleteItems, emptydir, createNewFile, createNewFolder, renameFiles, duplicateItem, saveFile, uploadFile, unzip, archive } from '../Api/fileManagerServices';
import { DropResult } from "react-beautiful-dnd";
import { SaveFileParams } from "../Api/types";

export const useFileManagerOperations = ({ dispatch }: {dispatch: any}) => {

  const setMessage = useCallback((message: Message) => {
    dispatch({
      type: ActionTypes.SET_MESSAGES,
      payload: message,
    });
  }, [dispatch]);

  const handlingHistory = useCallback((
    historyInfo: HistoryStep,
    index: number
  ) => {
    dispatch({
      type: ActionTypes.SET_HISTORY_INDEX,
      payload: {
        index
      },
    });

    switch (historyInfo.action) {
      case HistoryStepTypeEnum.FOLDERCHANGE:
        operations.handleSelectFolder(historyInfo.payload, true);
        break;
      default:
        break;
    }
  }, [dispatch]);

  const operations = useMemo(
    () => ({
      handleSelectFolder: (folder: FolderType, history: boolean = false, clearBuffer: boolean = false, showMessage: boolean = true) => {
        dispatch({
          type: ActionTypes.SET_SELECTED_FOLDER,
          payload: {folder: {...folder, children:[]}, history, loading: true, clearBuffer},
        });
        getFilesList({ path: folder.path }).then((data) => {
          dispatch({
            type: ActionTypes.SET_FILES_LIST,
            payload: { 
              data,
              loading: false,
              message: showMessage ? {
                title: `File Successfully Loaded`,
                type: "success",
                message: "You can paste it in any folder",
                timer: 1000,
                id: Date.now().toString() + Math.random().toString()
              } : null
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
      handleGoBackWard: (history: HistoryType) => {
        const historyIndex =  Math.max(0, history.currentIndex - 1);
        let historyInfo = history.steps[historyIndex];
        handlingHistory(historyInfo, historyIndex);
      },
      handleGoForWard: (history: HistoryType) => {
        if (history.currentIndex + 1 < history.steps.length) {
          let historyIndex = history.currentIndex + 1;
          let historyInfo = history.steps[historyIndex];
          handlingHistory(historyInfo, historyIndex);
        }
      },
      handleGotoParent: (foldersList: FolderList) => {
        operations.handleUnsetSelected();
        operations.handleSelectFolder(foldersList);
      },
      handleCopy: () => {
        dispatch({
          type: ActionTypes.COPY_FILES_TOBUFFER,
          payload: null
        })     
          setMessage({
            id: String(Date.now()),
            title: `File Successfully Copied`,
            type: "info",
            message: "You can paste it in any folder",
            timer: 3000,
          });
      },
      handleCut: () => {
        dispatch({
          type: ActionTypes.CUT_FILES_TOBUFFER,
          payload: null
        })     
        setMessage({
          id: String(Date.now()),
          title: `File Successfully Cut`,
          type: "info",
          message: "You can paste it in any folder",
          timer: 3000,
        });
      },
      handlePaste: (bufferedItems: BufferedItemsType, selectedFolder: FolderList) => {
        const files: string[] = Array.from(bufferedItems.files).map((item: Items) => item.path);
        const apiFunction = bufferedItems.type === ItemMoveActionTypeEnum.CUT ? cutFilesToFolder : copyFilesToFolder;

        apiFunction({ items: files, destination: selectedFolder.path})
          .then(() => {
            operations.handleSelectFolder(selectedFolder, true, true, false);
            setMessage(
              {
                id: String(Date.now()),
                title: `File Successfully Pasted`,
                type: "success",
                message: "You can paste it in any folder",
                timer: 3000,
              }
            );
          })
          .catch((error) => {
            dispatch({
              type: ActionTypes.SET_LOADING,
              payload: false
            }); 
            setMessage(
              {
                id: String(Date.now()),
                title: `Error happened while paste items`,
                type: "error",
                message: error?.message,
              },
            );
          });
      },
      handleDelete: (selectedFiles: Set<Items>, selectedFolder: FolderList) => {
        const items: string[] = Array.from(selectedFiles).map((item: Items) => item.path);
        const handleDeleteSubmit = () => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          });  
          deleteItems({items})
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Delete files and folders request`,
                  type: "success",
                  message: "All files and folders successfully deleted",
                },
              );
            })
            .catch((error) => {
              dispatch({
                type: ActionTypes.SET_LOADING,
                payload: false
              }); 
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while removing`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };
        const handleCloseClick = ()=>{
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
        }
        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Deleting selected files and folders: ${selectedFiles.size} items`,
            description: `All selected files and folder will remove without recover`,
            handleClose: handleCloseClick,
            handleSubmit: handleDeleteSubmit,
          }
        }); 
      },
      handleEmptyFolder: ( selectedFolder: FolderList) => {
        const path = selectedFolder.path;
        const handleEmptySubmit = () => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          });  
          emptydir({ path })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Empty folder request`,
                  type: "success",
                  message: "All files and folders successfully removed",
                },
              );
            })
            .catch((error) => {
              dispatch({
                type: ActionTypes.SET_LOADING,
                payload: false
              }); 

              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while empty folder`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };
        const handleCloseClick = ()=>{
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
        }
        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Deleting all files and folders in ${selectedFolder.name}`,
            description: `All files and folder will remove without recover`,
            handleClose: handleCloseClick,
            handleSubmit: handleEmptySubmit,
          }
        }); 

      },
      handleNewFile: ( selectedFolder: FolderList) => {      
        const handleNewFileSubmit = (fileName: string) => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          }); 

          createNewFile({ path: selectedFolder.path, file: fileName })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Create new file`,
                  type: "success",
                  message: `Successfully created new file with the name: ${fileName}`,
                },
              );
            })
            .catch((error) => {
              dispatch({
                type: ActionTypes.SET_LOADING,
                payload: false
              }); 

              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while creating file`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };
        const handleCloseClick = ()=>{
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
        }
        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Creating new file`,
            description:"Only allowed file extensions can be created. Otherwise will be ignored by server.",
            handleClose: handleCloseClick,
            handleSubmit: handleNewFileSubmit,
            nameInputSets: {
              label: "File Name",
              value: "new_file.txt",
            },
          },
        }); 
      },
      handleNewFolder: ( selectedFolder: FolderList) => {

        const handleNewFolderSubmit = (folderName: string) => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          }); 

          createNewFolder({ path: selectedFolder.path, folder: folderName })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Create new folder`,
                  type: "success",
                  message: `Successfully created new folder with the name: ${folderName}`,
                },
              );
            })
            .catch((error) => {
              dispatch({
                type: ActionTypes.SET_LOADING,
                payload: false
              }); 

              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while creating folder`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Creating new folder`,
            description:
            "Dont use spaces, localised symbols or emojies. This can affect problems",
            handleClose: ()=>{
              dispatch({
                type: ActionTypes.SET_POPUP_DATA,
                payload: null
              })
            },
            handleSubmit: handleNewFolderSubmit,
            nameInputSets: {
              label: "Folder Name",
              value: "newfolder",
            },
          },
        }); 
      },
      handleRename: (selectedFile: Items, selectedFolder: FolderList) => {


        const handleRenameSubmit = (folderName: string) => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          }); 

          renameFiles({ path: selectedFile.path, newname: folderName })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Renaming selected item`,
                  type: "success",
                  message: <>Successfully renamed selected item from <strong>{selectedFile.name}</strong> to <strong>{folderName}</strong></>,
                },
              );
            })
            .catch((error) => {
              dispatch({
                type: ActionTypes.SET_LOADING,
                payload: false
              }); 
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while renaming file`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Renaming ${selectedFile.name}`,
            description: "Dont use spaces, localised symbols or emojies. This can affect problems",
            handleClose: ()=>{
              dispatch({
                type: ActionTypes.SET_POPUP_DATA,
                payload: null
              })
            },
            handleSubmit: handleRenameSubmit,
            nameInputSets: {
              label: "New Name",
              value: selectedFile.name,
            },
          },
        }); 

      },
      handleDuplicate: (selectedFile: Items, selectedFolder: FolderList) => {
        const handleDuplicateSubmit = () => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          }); 

          duplicateItem({ path: selectedFile.path })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Duplicating selected item`,
                  type: "success",
                  message: <>Successfully Duplicating selected item</>,
                },
              );
            })
            .catch((error) => {
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while duplicating file`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
           title: `Duplicating ${selectedFile.name}`,
          description: <>New file will be named "copy_of_[original_name]"</>,
            handleClose: ()=>{
              dispatch({
                type: ActionTypes.SET_POPUP_DATA,
                payload: null
              })
            },
            handleSubmit: handleDuplicateSubmit,
          },
        }); 
      },
      handleCreateZip: (selectedFiles: Set<Items>, selectedFolder: FolderList) => {
        const files: string[] = Array.from(selectedFiles).map((item: Items) => item.path);
        const handleArchiveSubmit = (fileName: string) => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          }); 

          archive({files, destination: selectedFolder.path, name: fileName })
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Archiving selected items`,
                  type: "success",
                  message: <>Successfully archived selected items</>,
                },
              );
            })
            .catch((error) => {
              dispatch({
                type: ActionTypes.SET_LOADING,
                payload: false
              }); 
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while creating archive`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Creating archive for ${selectedFiles.size} items`,
            description: <>Dont use spaces, localised symbols or emojies. This can affect problems</>,
            handleClose: ()=>{
              dispatch({
                type: ActionTypes.SET_POPUP_DATA,
                payload: null
              })
            },
            handleSubmit: handleArchiveSubmit,
            nameInputSets: {
              label: "Archive name",
              value: "archive.zip",
            }
          },
        }); 
      },
      handleExtractZip: (selectedFile: Items, selectedFolder: FolderList) => {

        const handleExtractSubmit = () => {
          dispatch({
            type: ActionTypes.SET_POPUP_DATA,
            payload: null
          });
          dispatch({
            type: ActionTypes.SET_LOADING,
            payload: true
          }); 

          unzip({file: selectedFile.path, destination: selectedFolder.path})
            .then(() => {
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Extracting selected archive`,
                  type: "success",
                  message: <>Successfully extracted selected archive</>,
                },
              );
            })
            .catch((error) => {
              dispatch({
                type: ActionTypes.SET_LOADING,
                payload: false
              }); 
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while extracting archive`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };

        dispatch({
          type: ActionTypes.SET_POPUP_DATA,
          payload: {
            title: `Extracting archive ${selectedFile.name}`,
            description: <>Do you want extract selected archive in this folder</>,
            handleClose: ()=>{
              dispatch({
                type: ActionTypes.SET_POPUP_DATA,
                payload: null
              })
            },
            handleSubmit: handleExtractSubmit,
          },
        }); 
      },
      handleEditFile: (selectedFile: FileType, selectedFolder: FolderList) => {
        const handleCloseEdit = () => {
          dispatch({
            type: ActionTypes.SET_FILEEDIT_DATA,
            payload: null
          });
        };
        const handleSubmitEdit = (data: SaveFileParams) => {
          saveFile(data)
            .then(() => {
              handleCloseEdit();
              operations.handleSelectFolder(selectedFolder, true, true, false);
              setMessage(
                {
                  id: String(Date.now()),
                  title: `File changes`,
                  type: "success",
                  message: <>File changes for <strong>{selectedFile.name}</strong> successfully saved</>,
                },
              );
            })
            .catch((error) => {
              setMessage(
                {
                  id: String(Date.now()),
                  title: `Error happened while editing`,
                  type: "error",
                  message: error.message,
                },
              );
            });
        };
        dispatch({
          type: ActionTypes.SET_FILEEDIT_DATA,
          payload: {
            closeCallBack: handleCloseEdit,
            submitCallback: handleSubmitEdit,
            name: selectedFile.name,
            path: selectedFile.path,
            extension: selectedFile.extension,
          }
        });
      },
    }),
    [dispatch, handlingHistory, setMessage]
  );


  return operations ;
};

export default useFileManagerOperations;