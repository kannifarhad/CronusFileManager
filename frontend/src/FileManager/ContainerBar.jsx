import React, { useState} from "react";
import { connect } from 'react-redux';
import { Menu, MenuItem, Divider, Box } from '@material-ui/core';
import { DragDropContext} from 'react-beautiful-dnd';
import { uploadFile, pasteFiles } from '../Redux/actions';
import useStyles from './Elements/Styles';
import InfoBoxes from './Elements/InfoBoxes';
import Dropzone from './Elements/Dropzone';

import ViewItems from './ViewItems';

const contextMenuInital = {
    mouseX: null,
    mouseY: null,
    selected: null
};

function ContainerBar(props){
    const { messages , operations, isloading, uploadBox, buttons} = props
    const classes = useStyles();
    const [itemContext, itemContexSet] = useState(contextMenuInital);
    const [contentContex, contentContexSet] = useState(contextMenuInital);
  
    const handleAddSelected = value => {
      operations.handleAddSelected(value);
    };

    const handleItemContextClick = event => {
        event.stopPropagation();
        event.preventDefault();
        contentContexSet(contextMenuInital);
        itemContexSet({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
    };

    const handleContentContextClick = event => {
        event.stopPropagation();
        event.preventDefault();
        itemContexSet(contextMenuInital);
        contentContexSet({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
    };

    const handleContextClose = () => {
        itemContexSet(contextMenuInital);
        contentContexSet(contextMenuInital);
    };

    return (
            <Box className={classes.root}>

                <div className={classes.messagesBox}>
                    {messages.map((alert, index)=> <InfoBoxes key={index} alert={alert}/> )}
                </div>

                {isloading &&
                  <Box className={classes.loadingBlock}>
                      <div className="opaOverlaw"></div>
                  </Box>
                }
                
                {uploadBox && 
                    <Dropzone currentFolder={props.selectedFolder} handleReload={operations.handleReload} uploadFile={props.uploadFile} handleCancel={operations.handleUpload} /> 
                }

                <div 
                    className={classes.container} 
                    onContextMenu={handleContentContextClick}
                >
                  <DragDropContext onDragEnd={operations.handleDragEnd} >

                    <ViewItems
                      onContextMenuClick={handleItemContextClick}
                      doubleClick={operations.handleSetMainFolder}
                      addSelect={handleAddSelected}
                    />
                    
                  </DragDropContext>
                </div>


                <Menu
                      keepMounted
                      open={itemContext.mouseY !== null}
                      className={classes.menu}
                      onContextMenu={handleContextClose}
                      onClose={handleContextClose}
                      anchorReference="anchorPosition"
                      anchorPosition={
                          itemContext.mouseY !== null && itemContext.mouseX !== null
                          ? { top: itemContext.mouseY, left: itemContext.mouseX }
                          : undefined
                      }
                  >
                      {buttons.file.map((buttonGroup, index)=> 
                        [
                          buttonGroup.map((button, index)=> 
                            <MenuItem key={index} disabled={button.disable} className={classes.menuItem} onClick={button.onClick}>
                              <span className={`${button.icon}`}></span>{button.title}
                            </MenuItem>
                          ),
                          <Divider />
                        ]
                      )}
                </Menu>

                <Menu
                    keepMounted
                    open={contentContex.mouseY !== null}
                    className={classes.menu}
                    onContextMenu={handleContextClose}
                    onClose={handleContextClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contentContex.mouseY !== null && contentContex.mouseX !== null
                        ? { top: contentContex.mouseY, left: contentContex.mouseX }
                        : undefined
                    }
                >
                      {buttons.container.map((buttonGroup, index)=> 
                        [
                          buttonGroup.map((button, index)=> 
                            <MenuItem key={index} disabled={button.disable} className={classes.menuItem} onClick={button.onClick}>
                              <span className={`${button.icon}`}></span>{button.title}
                            </MenuItem>
                          ),
                          <Divider />
                        ]
                      )}
                </Menu>
                
            </Box>
    )
}

const mapStateToProps = store => ({
  store,
  selectedFiles: store.filemanager.selectedFiles,
  selectedFolder: store.filemanager.selectedFolder,
  bufferedItems: store.filemanager.bufferedItems,
  foldersList: store.filemanager.foldersList,
  showImages:store.filemanager.showImages,
  itemsView: store.filemanager.itemsView,
  filesList: store.filemanager.filesList,
  translations : store.dashboard.translations,
  lang : store.dashboard.lang,
});

const mapDispatchToProps = dispatch => ({
  uploadFile: (files, path) => dispatch(uploadFile(files, path)),
  pasteFiles: (files, type,destination) => dispatch(pasteFiles(files, type,destination)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContainerBar);

