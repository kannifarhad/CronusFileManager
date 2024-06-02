import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { 
        setSelectedFiles, 
        inverseSelectedFiles,
        selectAllFiles,
        unsetSelectedFiles,
        copyToBufferFiles,
        cutToBufferFiles,
        pasteFiles,
        setSelectedFolder,
        getFilesList,
        getFoldersList,
        setHistoryIndex,
        renameFiles,
        createNewFile,
        createNewFolder,
        emptydir,
        deleteItems,
        dublicateItem,
        archive,
        unzip,
        saveimage,
        listViewChange,
        clearBufferFiles
        } from '../Redux/actions';
import { Paper, Grid, Box, Collapse } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import FolderBar from './FolderBar';
import TopBar from './TopBar';
import ContainerBar from './ContainerBar';
import PopupDialog from './Elements/PopupDialog';
import config from './Elements/config.json';
import mainconfig from '../Data/Config';
import {convertDate, formatBytes} from '../Utils/Utils';
import ImageEditor from './Elements/ImageEditor';
import PerfectScrollbar from 'react-perfect-scrollbar';
import './Assets/PerfectScroll.css';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    folderSide: {
        flexGrow: 1,
        background: '#f9fafc',
        borderRight: '1px solid #E9eef9'
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    fmMinimized:{

    },
    fmExpanded:{
        position: "fixed",
        top:'0',
        left:'0',
        height:'100%',
        width:'100%',
        zIndex:'999',
        padding:'20px',
        background: 'rgba(255, 255, 255, 0.7)'
    },
    containerWrapper: {
        position:'relative'
    },
    infoMessages: {
        position:'absolute',
        width:'100%',
        bottom: '0',
        left: '0',
        padding: '10px 20px',
        fontSize: '13px',
        background: '#fff',
        textAlign: 'center',
        borderTop: '1px solid #E9eef9'
      },
}));

function FileManager(props){    
    const classes = useStyles();
    var {selectCallback, height} = props;
    height = (height !== undefined || height > 300 ? `${height}px` : '300px');
    const bigHeight = `${window.innerHeight - 100}px`;
    const [messagesList, setMessages] = useState([]);
    const [isloading, setLoading] = React.useState(false);
    const [uploadBox, setuploadBox] = React.useState(false);
    const [expand, setExpand] = React.useState(false);
    const selecMessages = props.selectedFiles.length > 0 || props.bufferedItems.files.length > 0;

    const [editImage, setEditImage] = React.useState({
        open:false,
        closeCallBack: false,
        submitCallback: false,
        name:'',
        path:'',
        extension:''
    });

    const [popupData, setPopup] = useState({
        open: false,
    });

    const handlingHistory = (historyInfo, index) => {
        props.setHistoryIndex(index);
        props.unsetSelectedFiles();
        switch (historyInfo.action) {
            case 'folderChange':
                    operations.handleSetMainFolder(historyInfo.path, true);
                break;
        
            default:
                break;
        }
    }

    const handleClose = () => {
        setPopup({
          open: false
        });
    };

    const handleClickPopupOpen = (data) => {
        setPopup({
          ...data,
          open: true,
        });
    };

    const operations = {

        handleAddSelected :(path) => {
            props.setSelectedFiles(path);
        },

        handleUnsetSelected :() => {
            props.unsetSelectedFiles();
        },

        handleInverseSelected :() => {
            props.inverseSelectedFiles();
        },

        handleSelectAll :() => {
            props.selectAllFiles();
        },
        
        handleGotoParent: () => {
            props.unsetSelectedFiles();
            operations.handleSetMainFolder(props.foldersList.path);
        },

        handleGoBackWard: () => {
            let historyIndex = props.history.currentIndex > 0 ? props.history.currentIndex - 1 : 0;
            let historyInfo = props.history.steps[historyIndex];
            handlingHistory(historyInfo,historyIndex);
        },

        handleGoForWard: () => {
            if(props.history.currentIndex + 1 < props.history.steps.length) {
                let historyIndex =  props.history.currentIndex + 1;
                let historyInfo = props.history.steps[historyIndex];
                handlingHistory(historyInfo,historyIndex);
            }
        },

        handleCopy : () => {
            props.copyToBufferFiles();
            setMessages([{
                title: `File Successfully Copied`,
                type:'info',
                message: 'You can paste it in any folder',
                timer: 3000,
            }]);
        },
    
        handleCut : () => {
            props.cutToBufferFiles();
            setMessages([{
                title: `File Successfully Cut`,
                type:'info',
                message: 'You can paste it in any folder',
                timer: 3000,
            }]);
        },
    
        handlePaste : ()=> {
            let files = props.bufferedItems.files.map((item)=> item.path);

            props.pasteFiles(files, props.bufferedItems.type, props.selectedFolder).then(result =>{
                operations.handleReload();
                setMessages([{
                    title: `File Successfully Pasted`,
                    type:'success',
                    message: 'You can paste it in any folder',
                    timer: 3000,
                }]);
            }).catch((error)=>{
                setMessages([{
                    title: `Error happened while paste items`,
                    type:'error',
                    message: error.message
                }]);
            });
        },

        handleSetMainFolder: (value, history = false) => {
            props.unsetSelectedFiles();
            props.setSelectedFolder(value, history);
            props.getFilesList(value).then(result=>{
                setMessages([{
                    title: `File Successfully Loaded`,
                    type:'success',
                    message: 'You can paste it in any folder',
                    timer: 3000,
                }]);
            });
           
        },

        handleDelete : ()=> {
            let files = props.selectedFiles.map((item)=> item.path);

            const handleDeleteSubmit = ()=>{
                setPopup({
                    open: false
                });
                props.deleteItems(files).then(result=>{
                    props.unsetSelectedFiles();
                    operations.handleReload();
                    setMessages([{
                        title: `Delete files and folders request`,
                        type:'success',
                        message: 'All files and folders successfully deleted'
                    }]);
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while removing`,
                        type:'error',
                        message: error.message
                    }]);
                });
            }
                        
            handleClickPopupOpen({
                title:`Deleting selected files and folders: ${props.selectedFiles.length} items `,
                description:`All selected files and folder will remove without recover`,
                handleClose: handleClose,
                handleSubmit: handleDeleteSubmit,
                nameInputSets:{}
            });
        },
    
        handleEmptyFolder : ()=> {
            var path = props.selectedFolder;
            
            const handleEmptySubmit = ()=>{
                setPopup({
                    open: false
                });

                props.emptydir(path).then(result=>{
                    props.unsetSelectedFiles();
                    operations.handleReload();
                    setMessages([{
                        title: `Empty folder request`,
                        type:'success',
                        message: 'All files and folders successfully removed'
                    }]);
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while empty folder`,
                        type:'error',
                        message: error.message
                    }]);
                });
            }
                        
            handleClickPopupOpen({
                title:`Deleting all files and folders in ${path}`,
                description:`All files and folder will remove without recover`,
                handleClose: handleClose,
                handleSubmit: handleEmptySubmit,
                nameInputSets:{}
            });
        },

        handleNewFile : ()=> {
            var fileName = 'new_file.txt';
            const handleNewFileChange = value => {
                fileName = value;
            }
            const handleNewFileSubmit = ()=>{
                setPopup({
                    open: false
                });
                props.createNewFile(props.selectedFolder, fileName).then(result=>{
                    operations.handleReload();
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while creating file`,
                        type:'error',
                        message: error.message
                    }]);
                });
            }
                        
            handleClickPopupOpen({
                title:`Creating new file`,
                description:'Only allowed file extensions can be created. Otherwise will be ignored by server.',
                handleClose: handleClose,
                handleSubmit: handleNewFileSubmit,
                nameInputSets: {
                    label:'File Name',
                    value:fileName,
                    callBack:handleNewFileChange,
                }
            });
        },
    
        handleNewFolder : ()=> {
            var folderName = 'newfolder';
            const handleNewFolderChange = value => {
                folderName = value;
            }
            const handleNewFolderSubmit = ()=>{
                setPopup({
                    open: false
                });
                props.createNewFolder(props.selectedFolder, folderName).then(result=>{
                    operations.handleReload();
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while creating folder`,
                        type:'error',
                        message: error.message
                    }]);
                });
            }
                        
            handleClickPopupOpen({
                title:`Creating new folder`,
                description:'Dont use spaces, localised symbols or emojies. This can affect problems',
                handleClose: handleClose,
                handleSubmit: handleNewFolderSubmit,
                nameInputSets: {
                    label:'Folder Name',
                    value:folderName,
                    callBack:handleNewFolderChange,
                }
            });
        },
    
        handleRename : ()=> {
            var item = props.selectedFiles[0];
            var renameTxt = item.name;
            const handleRenameChange = value => {
                renameTxt = value;
            }
            const handleRenameSubmit = ()=>{
                setPopup({
                    open: false
                });
                props.renameFiles(item.path, renameTxt).then(result=>{
                    props.unsetSelectedFiles();
                    operations.handleReload();
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while rename`,
                        type:'error',
                        message: error.message
                    }]);
                });
            }
                        
            handleClickPopupOpen({
                title:`Renaming of ${item.name}`,
                handleClose: handleClose,
                handleSubmit: handleRenameSubmit,
                nameInputSets: {
                    label:'Folder Name',
                    value:renameTxt,
                    callBack:handleRenameChange,
                }
            });
        },

        handleReload: ()=>{
            setLoading(true);
            setMessages([{
                title: `Wait While Reloading`,
                type:'info',
                message: '',
                progress:true,
                disableClose: true
            }]);
            props.getFilesList(props.selectedFolder);
            props.getFoldersList().then(result=>{
                setLoading(false);
                setMessages([]);
                console.log()
            });
        },

        handleDuplicate : ()=> {
            var item = props.selectedFiles[0];
            props.dublicateItem(item.path).then(result=>{
                    props.unsetSelectedFiles();
                    operations.handleReload();
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while duplicate`,
                        type:'error',
                        message: error.message
                    }]);
                });
        },

        handleCreateZip : ()=> {
            var name = 'archive_name';
            let files = props.selectedFiles.map((item)=> item.path);
            let destination = props.selectedFolder;
            const handleArchiveChange = value => {
                name = value;
            }
            const handleArchiveSubmit = ()=>{
                setPopup({
                    open: false
                });
                props.archive(files, destination, name).then(result=>{
                    operations.handleReload();
                    props.unsetSelectedFiles();
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while creating archive`,
                        type:'error',
                        message: error.message
                    }]);
                });
            }
                        
            handleClickPopupOpen({
                title:`Creating new archive`,
                description:'Create a new archive with all selected files. If there is already file with this name it will replace',
                handleClose: handleClose,
                handleSubmit: handleArchiveSubmit,
                nameInputSets: {
                    label:'Archive Name',
                    value:name,
                    callBack:handleArchiveChange,
                }
            });
        },

        handleExtractZip : ()=> {
            let file = props.selectedFiles[0].path;
            let destination = props.selectedFolder;
            const handleArchiveSubmit = ()=>{
                setPopup({
                    open: false
                });
                props.unzip(file, destination).then(result=>{
                    operations.handleReload();
                    props.unsetSelectedFiles();
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while extraction archive`,
                        type:'error',
                        message: error.message
                    }]);
                });
            }
                        
            handleClickPopupOpen({
                title:`Extract all files from archive to ${destination}`,
                description:'All files will extracted. If they are existed in folder alreadt they will replaced.',
                handleClose: handleClose,
                handleSubmit: handleArchiveSubmit,
                nameInputSets: {}
            });
        },

        handlePreview : ()=> {
            let file = props.selectedFiles[0];
            props.unsetSelectedFiles();
            handleClickPopupOpen({
                title:`File: ${file.name}`,
                description:`<img src="${mainconfig.serverPath}${file.path}" />`,
                handleClose: handleClose,
                nameInputSets: {}
            });
        },

        handleGetInfo : ()=> {
            let file = props.selectedFiles[0];
            let isImage = checkSelectedFileType('image');
            props.unsetSelectedFiles();
            let description = `
                <ul class="list">
                    <li><b>Name</b> : ${file.name}</li>
                    <li><b>Path</b> : ${file.path}</li>
                    ${file.type === 'file'? 
                    `<li><b>Size</b> : ${formatBytes(file.size)}</li>
                    <li><b>Extension</b> : ${file.extension}</li>`
                    :''}
                    <li><b>Created</b> : ${convertDate(file.created)}</li>
                    <li><b>Modified</b> : ${convertDate(file.modified)}</li>
                    <li><b>Permissions</b> : Others - ${file.premissions.others}, Group - ${file.premissions.group}, Owner - ${file.premissions.owner}</li>
                </ul>
                ${isImage ? `<img src="${mainconfig.serverPath}${file.path}" />`: ''}
            `;
            handleClickPopupOpen({
                title:`File: ${file.name}`,
                description,
                handleClose: handleClose,
                nameInputSets: {}
            });
        },
    
        handleReturnCallBack : (item)=> {
            console.log('handleReturnCallBack Method Called', item);
            if(selectCallback) {
                selectCallback(item);
            }
            return true;
        },

        handleUpload : ()=> {
            setuploadBox(!uploadBox);
            setLoading(!isloading);
        },

        handleEditImage : ()=> {
            const item = props.selectedFiles[0];
            const fullpath = `${mainconfig.serverPath}${item.path}`;
            const closeCallBack = ()=>{
                setEditImage({
                    open:false,
                    closeCallBack: false,
                    submitCallback: false,
                    name:'',
                    path:'',
                });
            }
            const submitCallback = (imageData, asNew)=>{
                setEditImage({
                    open:false,
                    closeCallBack: false,
                    submitCallback: false,
                    name:'',
                    path:'',
                    extension:''
                });
                props.saveimage(imageData, item.path, asNew).then((result)=>{
                    props.unsetSelectedFiles();
                    props.getFilesList(props.selectedFolder).then(()=>{
                        setMessages([{
                            title: `Image successfully saved`,
                            type:'info',
                            message: 'Changes may not be visible because of cache. Please update the page',
                        }]);
                    }).catch((error)=>{
                        console.log(error);
                    });
                }).catch((error)=>{
                    setMessages([{
                        title: `Error happened while saving image`,
                        type:'error',
                        message: error.message
                    }]);
                });
       
            }
            setEditImage({
                open:true,
                closeCallBack,
                submitCallback,
                name:item.name,
                path:fullpath,
                extension:item.extension
            });
        },

        handleEditText : ()=> {
            console.log('IMage Edit');
        },

        handleDownload : ()=> {
            let file = props.selectedFiles[0];
            setTimeout(() => {
                window.open(`${mainconfig.serverPath}${file.path}`);
              }, 100);
        },

        handleFullExpand: ()=>{
            setExpand(!expand);
        },

        handleViewChange: (type)=>{
            props.listViewChange(type);
        },

        handleDragEnd : (result)=> {
            setLoading(!isloading);
            try {
                let files = [];
                let destination;
                props.filesList.forEach(file => {
                  if(file.id === result.draggableId){
                    files = [file.path];
                  }
                  if(file.id === result.destination.droppableId){
                    destination = file.path;
                  }
                });
        
                if(destination !== undefined && files.length !== 0){
                    props.pasteFiles(files, 'cut', destination).then(result =>{
                        operations.handleReload();
                        setMessages([{
                            title: `File Successfully Moved`,
                            type:'success',
                            message: 'File that you dragged successfully moved',
                            timer: 3000,
                        }]);
                    }).catch((error)=>{
                      
                    });
                }
               
              } catch (error) {
                
              }
              setLoading(!isloading);
              console.log('Drag ended',result);
        },

    }

    const checkSelectedFileType = (type)=>{
        try {
            switch (type) {
                case 'text':
                        return config.textFiles.includes(props.selectedFiles[0].extension);
                case 'archive':
                    return config.archiveFiles.includes(props.selectedFiles[0].extension);

                case 'image':
                    return config.imageFiles.includes(props.selectedFiles[0].extension);

                case 'file':
                    return props.selectedFiles[0].type === 'file';
            
                default:
                    return false;
            }
        } catch (error) {
            return false;
        }
    }

    const allButtons = {
        copy:{
            title: 'Copy',
            icon: 'icon-copy',
            onClick: operations.handleCopy,
            disable: !(props.selectedFiles.length > 0)
        },
        cut:{
            title: 'Cut',
            icon: 'icon-scissors',
            onClick: operations.handleCut,
            disable: !(props.selectedFiles.length > 0)
        },
        paste:{
            title: 'Paste',
            icon: 'icon-paste',
            onClick: operations.handlePaste,
            disable: !(props.bufferedItems.files.length > 0)
        },
        delete:{
            title: 'Delete',
            icon: 'icon-trash',
            onClick: operations.handleDelete,
            disable: !(props.selectedFiles.length > 0)
        },
        emptyFolder:{
            title: 'Empty Folder',
            icon: 'icon-delete-folder',
            onClick: operations.handleEmptyFolder,
        },
        rename:{
            title: 'Rename',
            icon: 'icon-text',
            onClick: operations.handleRename,
            disable: !(props.selectedFiles.length === 1)

        },
        newFile:{
            title: 'Few File',
            icon: 'icon-add',
            onClick: operations.handleNewFile,
        },
        newFolder:{
            title: 'New Folder',
            icon: 'icon-add-folder',
            onClick: operations.handleNewFolder,
        },
        goForwad:{
            title: 'Forwad',
            icon: 'icon-forward',
            onClick: operations.handleGoForWard,
            disable: !(props.history.currentIndex + 1 < props.history.steps.length)
        },
        goParent:{
            title: 'Go to parent folder',
            icon: 'icon-backward',
            onClick: operations.handleGotoParent,
            disable: props.selectedFolder === props.foldersList.path
        },
        goBack:{
            title: 'Back',
            icon: 'icon-backward',
            onClick: operations.handleGoBackWard,
            disable: !(props.history.currentIndex > 0)
        },
        selectAll:{
            title: 'Select all',
            icon: 'icon-add-3',
            onClick: operations.handleSelectAll,
            disable: !(props.selectedFiles.length !== props.filesList.length)
        },
        selectNone:{
            title: 'Select none',
            icon: 'icon-cursor',
            onClick: operations.handleUnsetSelected,
            disable: (props.selectedFiles.length === 0)
        },
        inverseSelected:{
            title: 'Invert selection',
            icon: 'icon-refresh',
            onClick: operations.handleInverseSelected,
            disable: !(props.selectedFiles.length !== props.filesList.length && props.selectedFiles.length > 0)
        },
        selectFile: {
            title: 'Select file',
            icon: 'icon-outbox',
            onClick: operations.handleReturnCallBack,
            disable: typeof selectCallback === 'undefined'
        },
        reload: {
            title:'Reload',
            icon: 'icon-refresh',
            onClick: operations.handleReload,
        },
        dubplicate:{
            title: 'Duplicate',
            icon: 'icon-layers',
            onClick: operations.handleDuplicate,
            disable: !(props.selectedFiles.length === 1)
        },

        editFile:{
            title: 'Edit File',
            icon: 'icon-pencil',
            onClick: operations.handleEditText,
            disable: !(props.selectedFiles.length === 1 && checkSelectedFileType('text'))
        },

        editImage:{
            title: 'Resize & Rotate',
            icon: 'icon-paint-palette',
            onClick: operations.handleEditImage,
            disable: !(props.selectedFiles.length === 1 && checkSelectedFileType('image'))
        },
        createZip:{
            title: 'Create archive',
            icon: 'icon-zip',
            onClick: operations.handleCreateZip,
            disable: !(props.selectedFiles.length > 0)
        },
        extractZip:{
            title: 'Extract files from archive',
            icon: 'icon-zip-1',
            onClick: operations.handleExtractZip,
            disable: !(props.selectedFiles.length === 1 && checkSelectedFileType('archive'))
        },
        uploadFile:{
            title: 'Upload Files',
            icon: 'icon-cloud-computing',
            onClick: operations.handleUpload,
        },
        searchFile:{
            title: 'Search File',
            icon: 'icon-search',
            onClick: operations.handleSearchFile,
        },
        saveFile:{
            title: 'Save Changes',
            icon: 'icon-save',
            onClick: operations.handleSaveFileChanges,
        },
        preview:{
            title: 'View',
            icon: 'icon-view',
            onClick: operations.handlePreview,
            disable: !(props.selectedFiles.length === 1 && checkSelectedFileType('image'))
        },
        getInfo:{
            title: 'Get Info',
            icon: 'icon-information',
            onClick: operations.handleGetInfo,
            disable: !(props.selectedFiles.length === 1)
        },
        download:{
            title: 'Download File',
            icon: 'icon-download-1',
            onClick: operations.handleDownload,
            disable: !(props.selectedFiles.length === 1 && checkSelectedFileType('file'))
        },
        gridView: {
            title: 'Grid view',
            icon: 'icon-layout-1',
            onClick: ()=>operations.handleViewChange('grid'),
            disable: props.itemsView === 'grid'
        },
        listView: {
            title: 'List View',
            icon: 'icon-layout-2',
            onClick: ()=>operations.handleViewChange('list'),
            disable: props.itemsView === 'list'
        },
        fullScreen: {
            title: 'Full Screen',
            icon: expand ? 'icon-minimize' :'icon-resize',
            onClick: operations.handleFullExpand
        }
        
    }

    const aviableButtons = {
        topbar:[
            [allButtons.goBack, allButtons.goForwad, allButtons.goParent],
            [allButtons.newFile, allButtons.newFolder, allButtons.uploadFile, allButtons.reload],
            [allButtons.copy, allButtons.cut, allButtons.paste, allButtons.delete, allButtons.emptyFolder, allButtons.dubplicate],
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
            [allButtons.newFile, allButtons.newFolder,allButtons.emptyFolder,  allButtons.uploadFile, allButtons.reload],
            [allButtons.inverseSelected, allButtons.selectNone, allButtons.selectAll],
            [allButtons.gridView, allButtons.listView, allButtons.fullScreen],
        ],
    }

    useEffect(() => {
        props.getFilesList('');
        props.getFoldersList().then(result=>{
            props.setSelectedFolder(result.data.path);
        });
    }, []);

    return (
        <div>
            <ImageEditor />
            <div className={expand ? classes.fmExpanded : classes.fmMinimized}>
                <Paper>
                    {popupData.open &&  <PopupDialog {...popupData} /> }
                    {editImage.open &&  <ImageEditor {...editImage} /> }
                    <TopBar buttons={aviableButtons} />
                    <Grid container>
                        <Grid item xs={3} sm={2} className={classes.folderSide}>
                            <PerfectScrollbar>
                                <div style={{ maxHeight: (expand ? bigHeight : height )}}>
                                    <FolderBar foldersList={props.foldersList} onFolderClick={operations.handleSetMainFolder} selectedFolder={props.selectedFolder} />
                                </div>
                            </PerfectScrollbar>
                        </Grid>
                        <Grid className={classes.containerWrapper} item xs={9} sm={10}>
                            <PerfectScrollbar>
                                <div style={{ maxHeight: (expand ? bigHeight : height )}}>
                                    <ContainerBar buttons={aviableButtons} messages={messagesList} isloading={isloading} uploadBox={uploadBox} operations={operations} />
                                </div>
                            </PerfectScrollbar>
                            <Collapse in={selecMessages}>
                                <Box className={classes.infoMessages}>
                                    {props.selectedFiles.length > 0 && <div className="text"><b>{props.selectedFiles.length}</b> items are selected</div> }
                                    {props.bufferedItems.files.length > 0 && 
                                        <div className="text">
                                            <b>{props.bufferedItems.files.length}</b> {props.bufferedItems.type === 'cut' ? 'cuted' : 'copied'} items in buffer
                                            (<a href="#" onClick={(e)=>{e.preventDefault(); props.clearBufferFiles()}}>Clear</a>)
                                        </div> 
                                    }
                                </Box>
                            </Collapse>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </div>
    )
}

const mapStateToProps = store => ({
    store,
    selectedFiles: store.filemanager.selectedFiles,
    selectedFolder: store.filemanager.selectedFolder,
    bufferedItems: store.filemanager.bufferedItems,
    foldersList: store.filemanager.foldersList,
    filesList: store.filemanager.filesList,
    itemsView: store.filemanager.itemsView,
    history: store.filemanager.history,
    translations : store.dashboard.translations,
    lang : store.dashboard.lang,
});

const mapDispatchToProps = dispatch => ({
    setSelectedFiles: (path) => dispatch(setSelectedFiles(path)),
    unsetSelectedFiles: () => dispatch(unsetSelectedFiles()),
    inverseSelectedFiles: () => dispatch(inverseSelectedFiles()),
    selectAllFiles: () => dispatch(selectAllFiles()),
    copyToBufferFiles: () => dispatch(copyToBufferFiles()),
    cutToBufferFiles: () => dispatch(cutToBufferFiles()),
    pasteFiles: (files, type,destination) => dispatch(pasteFiles(files, type,destination)),
    setSelectedFolder: (path, history) => dispatch(setSelectedFolder(path, history)),
    getFoldersList: () => dispatch(getFoldersList()),
    getFilesList: (path) => dispatch(getFilesList(path)),
    setHistoryIndex: (path) => dispatch(setHistoryIndex(path)),
    renameFiles: (path, newName) => dispatch(renameFiles(path, newName)),
    createNewFile: (destination, fileName) => dispatch(createNewFile(destination, fileName)),
    createNewFolder: (destination, folderName) => dispatch(createNewFolder(destination, folderName)),
    emptydir: (path) => dispatch(emptydir(path)),
    deleteItems: (items) => dispatch(deleteItems(items)),
    dublicateItem: (path) => dispatch(dublicateItem(path)),
    archive: (files, destination, name) => dispatch(archive(files, destination, name)),
    saveimage: (file, path, isnew) => dispatch(saveimage(file, path, isnew)),
    unzip: (file, destination) => dispatch(unzip(file, destination)),
    listViewChange: (type) => dispatch(listViewChange(type)),
    clearBufferFiles: () => dispatch(clearBufferFiles()),
    
});

export default connect(mapStateToProps, mapDispatchToProps)(FileManager);