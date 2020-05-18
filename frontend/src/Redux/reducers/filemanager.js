
import { 
    SET_SELECTED_FILES, 
    UNSET_SELECTED_FILES, 
    SELECT_ALL_FILES,
    INVERSE_SELECTED_FILES,
    COPY_FILES_TOBUFFER, 
    CUT_FILES_TOBUFFER, 
    PASTE_FILES,
    SET_SELECTED_FOLDER,
    GET_FOLDERS_LIST,
    GET_FILES_LIST,
    SET_HISTORY_INDEX,
    SET_ITEM_VIEW,
    SET_SORT_ORDER_BY,
    RUN_SORTING_FILTER,
    SET_IMAGE_SETTINGS,
    CLEAR_FILES_TOBUFFER
}  from '../actions';

export default function reducer(state = {}, action){
    switch(action.type){

        case SET_IMAGE_SETTINGS:
            return {...state, showImages: action.imagePreview};

        case RUN_SORTING_FILTER:
                let sortedFiles = sortFilter(state.filesList, state.orderFiles);
            return {...state, filesList: sortedFiles};

        case SET_SORT_ORDER_BY:
            return {...state, orderFiles: 
                        {
                            field:action.field,
                            orderBy:action.orderBy,
                        }
                    };

        case UNSET_SELECTED_FILES:
            return {...state, selectedFiles: []};

        case SET_SELECTED_FILES:
                var selectedFilesNew = [...state.selectedFiles];
                var index = selectedFilesNew.indexOf(action.item);
                if (index !== -1) {
                        selectedFilesNew.splice(index, 1);
                    } else {
                        selectedFilesNew = [...selectedFilesNew, action.item];
                }
            return {...state, selectedFiles: selectedFilesNew };
        

        case SELECT_ALL_FILES:
                var newSelected = state.filesList.reduce(function(result, file) {
                    if (file.private !== true) {
                      result.push(file);
                    }
                    return result;
                  }, []);
            return {...state, selectedFiles:newSelected};


        case INVERSE_SELECTED_FILES:
                var selectedFiles = state.selectedFiles;
                const inversedSelected = state.filesList.reduce((nextSelected, file) => {
                    if (!selectedFiles.find(selectedFile => selectedFile.id === file.id)) {
                      nextSelected.push(file);
                    }
                    return nextSelected;
                }, []);

            return {...state, selectedFiles:inversedSelected};


        case COPY_FILES_TOBUFFER:
                var bufferedItems = {
                    type: 'copy',
                    files: state.selectedFiles
                }
            return {...state, bufferedItems, selectedFiles:[]};


        case CUT_FILES_TOBUFFER:
                bufferedItems = {
                    type: 'cut',
                    files: state.selectedFiles
                }
            return {...state, bufferedItems, selectedFiles:[]};

        case CLEAR_FILES_TOBUFFER:
                bufferedItems = {
                    type: '',
                    files: []
                }
            return {...state, bufferedItems};
            
        case PASTE_FILES:
                bufferedItems = {
                    type: '',
                    files: []
                }
            return {...state, bufferedItems};


        case SET_SELECTED_FOLDER: 
            let newHistory = {...state.history};
            if(!action.history){
                newHistory.steps.push({
                    action:'folderChange',
                    path: action.path,
                });
                newHistory.currentIndex = newHistory.steps.length === 0 ? 0 : newHistory.steps.length -1;
            }
            return {...state,history: newHistory, selectedFolder: action.path};

        case GET_FILES_LIST: 
            let filesList = Array.isArray(action.data.children) ? action.data.children : [];
                filesList = sortFilter(filesList, state.orderFiles);
            return {...state, filesList};

        case GET_FOLDERS_LIST:
            return {...state, foldersList:action.data};

        case SET_HISTORY_INDEX:
                const newHistoryIndex = {...state.history};
                newHistoryIndex.currentIndex = action.index;
            return {...state,history: newHistoryIndex};
        
        case SET_ITEM_VIEW:
            return {...state,itemsView: action.view};

        default:
            return state;
    }
}

function sortFilter(filesList, order){
        var sortedFiles = [];
        switch (order.field) {
            case 'name':
                sortedFiles = filesList.sort(function(a, b){
                    var x = a.name.toLowerCase();
                    var y = b.name.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });
                break;
            case 'size':
                sortedFiles = filesList.sort(function(a, b){
                    return a.size - b.size;
                });
                break;

            case 'date':
                sortedFiles = filesList.sort(function(a, b){
                    return new Date(a.created) - new Date(b.created);
                });
                break;
        
            default:
                sortedFiles = filesList; 
                break;
        }
        return order.orderBy === 'asc' ? sortedFiles : sortedFiles.reverse();
}