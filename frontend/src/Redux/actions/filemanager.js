export const SET_SELECTED_FILES = 'SET_SELECTED_FILES';
export const INVERSE_SELECTED_FILES = 'REVERSE_SELECTED_FILES';
export const UNSET_SELECTED_FILES = 'UNSET_SELECTED_FILES';
export const SELECT_ALL_FILES = 'SELECT_ALL_FILES';

export const COPY_FILES_TOBUFFER = 'COPY_FILES_TOBUFFER';
export const CUT_FILES_TOBUFFER = 'CUT_FILES_TOBUFFER';
export const CLEAR_FILES_TOBUFFER = 'CLEAR_FILES_TOBUFFER';

export const PASTE_FILES = 'PASTE_FILES';

export const SET_SELECTED_FOLDER = 'SET_SELECTED_FOLDER';
export const GET_FILES_LIST = 'GET_FILES_LIST';
export const GET_FOLDERS_LIST = 'GET_FOLDERS_LIST';
export const SET_HISTORY_INDEX = 'SET_HISTORY_INDEX';
export const SET_ITEM_VIEW = 'SET_ITEM_VIEW';

export const RENAME_FILE = 'RENAME_FILE';
export const CREATE_FILE = 'CREATE_FILE';
export const CREATE_FOLDER = 'CREATE_FOLDER';

export const ARCHIVE_FILES = 'ARCHIVE_FILES';
export const UNZIP_FILE = 'UNZIP_FILE';
export const DELETE_ITEMS = 'DELETE_ITEMS';
export const EMPTY_DIR = 'EMPTY_DIR';
export const DUPLICATE_ITEM = 'DUPLICATE_ITEM';
export const SAVE_IMAGE = 'SAVE_IMAGE';
export const SET_SORT_ORDER_BY = 'SET_SORT_ORDER_BY';
export const RUN_SORTING_FILTER = 'RUN_SORTING_FILTER';
export const SET_IMAGE_SETTINGS = 'SET_IMAGE_SETTINGS';
export const UPLOAD_FILES = 'UPLOAD_FILES';


export function setSelectedFiles(item) {
    return {
        item,
        type:SET_SELECTED_FILES
    }
}

export function listViewChange(view) {
    return {
        view,
        type:SET_ITEM_VIEW
    }
}

export function setSorting(orderBy, field) {
    return {
        orderBy, 
        field,
        type:SET_SORT_ORDER_BY
    }
}

export function filterSorting() {
    return {
        type:RUN_SORTING_FILTER
    }
}

export function setImagesSettings(imagePreview) {
    return {
        imagePreview,
        type:SET_IMAGE_SETTINGS
    }
}

export function unsetSelectedFiles() {
    return {
        type:UNSET_SELECTED_FILES
    }
}

export function selectAllFiles() {
    return {
        type:SELECT_ALL_FILES
    }
}

export function inverseSelectedFiles() {
    return {
        type:INVERSE_SELECTED_FILES
    }
}

export function copyToBufferFiles() {
    return {
        type:COPY_FILES_TOBUFFER
    }
}

export function cutToBufferFiles() {
    return {
        type:CUT_FILES_TOBUFFER
    }
}

export function clearBufferFiles() {
    return {
        type:CLEAR_FILES_TOBUFFER
    }
}

export function setSelectedFolder(path, history) {
    return {
        type: SET_SELECTED_FOLDER,
        path,
        history
    };
}

export function getFilesList(path) {
    return {
        type: GET_FILES_LIST,
        path: path,
        request: {
            method: 'post',
            url: '/fm/folder'
        },
        body: { 
            path
        }
    };
}

export function getFoldersList() {
    return {
        type: GET_FOLDERS_LIST,
        request: {
            method: 'post',
            url: '/fm/foldertree'
        }
    };
}

export function setHistoryIndex(index) {
    return {
        type: SET_HISTORY_INDEX,
        index
    };
}

export function renameFiles(path, newname) {
    return {
        type: RENAME_FILE,
        request: {
            method: 'post',
            url: '/fm/rename'
        },
        body: { 
            path,
            newname
         }
    };
}

export function createNewFile(path, file) {
    return {
        type: CREATE_FILE,
        request: {
            method: 'post',
            url: '/fm/createfile'
        },
        body: { 
            path,
            file
         }
    };
}

export function createNewFolder(path, folder) {
    return {
        type: CREATE_FOLDER,
        request: {
            method: 'post',
            url: '/fm/createfolder'
        },
        body: { 
            path,
            folder
         }
    };
}

export function pasteFiles(items , type, destination) {
    return {
        type: PASTE_FILES,
        request: {
            method: 'post',
            url: type === 'cut' ? '/fm/move' : '/fm/copy'
        },
        body: { 
            items,
            destination
         }
    };
}

export function emptydir(path) {
    return {
        type: EMPTY_DIR,
        request: {
            method: 'post',
            url: '/fm/emptydir'
        },
        body: { 
            path
         }
    };
}

export function deleteItems(items){
    return {
        type: DELETE_ITEMS,
        request: {
            method: 'post',
            url: '/fm/delete'
        },
        body: { 
            items
         }
    };
}

export function dublicateItem(path){
    return {
        type: DUPLICATE_ITEM,
        request: {
            method: 'post',
            url: '/fm/duplicate'
        },
        body: { 
            path
         }
    };
}

export function unzip(file, destination){
    return {
        type: UNZIP_FILE,
        request: {
            method: 'post',
            url: '/fm/unzip'
        },
        body: { 
            file, 
            destination
         }
    };
}

export function archive(files, destination, name){
    return {
        type: ARCHIVE_FILES,
        request: {
            method: 'post',
            url: '/fm/archive'
        },
        body: { 
            files, 
            destination, 
            name
         }
    };
}

export function saveimage(file, path, isnew){
    return {
        type: SAVE_IMAGE,
        request: {
            method: 'post',
            url: '/fm/saveimage'
        },
        body: { 
            file, 
            path, 
            isnew
         }
    };
}

export function uploadFile(body){
    return {
        type: UPLOAD_FILES,
        request: {
            method: 'post',
            url: '/fm/upload'
        },
        body
    };
}