import React from "react";
import { connect } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Checkbox, Tooltip} from '@material-ui/core';
import { Droppable, Draggable} from 'react-beautiful-dnd';
import clsx from "clsx";

import { toAbsoluteUrl , convertDate, formatBytes} from "../Utils/Utils";
import mainconfig from '../Data/Config';
import useStyles from './Elements/Styles';
import config from './Elements/config.json';

function ViewItems(props){
    const { onContextMenuClick, addSelect, selectedFiles, bufferedItems, showImages} = props;
    const classes = useStyles();

    const getThumb = (item) => {
        try {
            if(showImages === 'thumbs' && config.imageFiles.includes(item.extension)){
              return `${mainconfig.serverPath}${item.path}`;
            } else {
              return typeof config.icons[item.extension] !== 'undefined' ? toAbsoluteUrl(config.icons[item.extension]) : toAbsoluteUrl(config.icons.broken)
            }
        } catch (error) {
            return toAbsoluteUrl(config.icons.broken);
        }
    }

    const handleContextMenuClick = async (item,event) => {
      addSelect(item);
      onContextMenuClick(event);
    }

    const checkIsSelected = item => {
        return selectedFiles.includes(item);
    }

    const isCuted = item => {
        if(bufferedItems.type === 'cut'){
            return  bufferedItems.files.filter((file) => file.id === item.id).length > 0;
        }
        return false;
    }

    function getStyle(style, snapshot) {
        if (!snapshot.isDraggingOver) {
          return style;
        }
        return {
          ...style,
           background:'#f00 !important',
        };
    }

    const FileItem = ({item,index}) => {
      let fileCuted = isCuted(item);
      let isSelected = checkIsSelected(item);

        return(
          <Draggable 
            draggableId={item.id} 
            index={index}
            isDragDisabled={item.private}
          >
              {(provided, snapshot)=>(      
                  <Box 
                      onContextMenu={(event)=>handleContextMenuClick(item,event)} 
                      className={clsx(
                          classes.itemFile,
                          {
                          "selected": selectedFiles.includes(item.path),
                          "selectmode": selectedFiles.length > 0,
                          "notDragging": !snapshot.isDragging,
                          'fileCuted': fileCuted
                          })
                      }
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                  >
                        {item.private && 
                            <span className={`icon-lock ${classes.locked}`}/> || 
                            <Checkbox className={classes.checkbox} checked={isSelected} onChange={()=>addSelect(item)} value={item.id} />
                        }
                        <span className={classes.extension}>{item.extension}</span>

                        <div className={classes.infoBox}>
                            <img src={getThumb(item)} />
                        </div>
                        <Tooltip title={item.name}>
                          <div className={classes.itemTitle}>
                              <span>{item.name}</span>
                          </div>
                        </Tooltip>

                    </Box>
              )}
          </Draggable>
        );
    }

    const FolderItem = ({item,index}) => {
      let fileCuted = isCuted(item);
      let isSelected = checkIsSelected(item);
      return(
        <Draggable 
            index={index}
            draggableId={item.id} 
            isDragDisabled={item.private}
            
        >
            {(provided, snapshot)=>( 
                <Box 
                    ref={provided.innerRef}
                    className={clsx(
                        classes.itemFile,
                        {
                        "selected": selectedFiles.includes(item.path),
                        "selectmode": selectedFiles.length > 0,
                        "notDragging": !snapshot.isDragging,
                        'fileCuted': fileCuted
                        })
                    }
                    onDoubleClick={()=>props.doubleClick(item.path)}
                    onContextMenu={(event)=>handleContextMenuClick(item,event)} 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >  
                    <Droppable droppableId={item.id} type="CONTAINERITEM" isCombineEnabled>
                        {(provided, snapshot) => (
                            <div 
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={getStyle(provided.droppableProps.style, snapshot)}
                            >
                                {item.private && 
                                    <span className={`icon-lock ${classes.locked}`}/> || 
                                    <Checkbox className={classes.checkbox} checked={isSelected} onChange={()=>addSelect(item)} value={item.id} />
                                }
                                <div className={classes.infoBox}>
                                    <img src={snapshot.isDraggingOver ? toAbsoluteUrl(config.icons.folderopen) : toAbsoluteUrl(config.icons.folder) } />
                                </div>
                                <Tooltip title={ <>
                                                    <b>Name :</b> {item.name} <br /> 
                                                    <b>Created :</b> {convertDate(item.created)}
                                                </>
                                            }>
                                    <div className={classes.itemTitle}>
                                        <span>{item.name}</span>
                                    </div>
                                </Tooltip>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Box>
            )}
        </Draggable>
      );
    }

    const ListFolderItem = ({item,index})=>{
      let fileCuted = isCuted(item);
      let isSelected = checkIsSelected(item);

      return (
        <Draggable index={index} draggableId={item.id}>
            {(provided, snapshot)=>(  
              <TableRow 
                ref={provided.innerRef}
                className={clsx(
                    classes.tableListRow,
                    {
                      "selected": selectedFiles.includes(item.path),
                      'fileCuted': fileCuted,
                      "selectmodeTable": selectedFiles.length > 0
                    })
                }
                onDoubleClick={()=>props.doubleClick(item.path)}
                onContextMenu={(event)=>handleContextMenuClick(item,event)} 
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Droppable droppableId={item.id} type="CONTAINERITEM" isCombineEnabled>
                    {(provided, snapshot) => (
                        <>
                          <TableCell className={classes.tableCell}><Checkbox checked={isSelected} onChange={()=>addSelect(item)} value={item.id} /></TableCell>
                          <TableCell className={classes.tableCell}><img style={{"width":"20px"}} src={snapshot.isDraggingOver ? toAbsoluteUrl(config.icons.folderopen) : toAbsoluteUrl(config.icons.folder) } /></TableCell>
                          <TableCell className={classes.tableCell} align="left">
                              <div 
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  style={getStyle(provided.droppableProps.style, snapshot)}
                              >
                                {item.name}
                                {provided.placeholder}
                            </div>
                          </TableCell>
                          <TableCell className={classes.tableCell} align="left">{formatBytes(item.size)}</TableCell>
                          <TableCell className={classes.tableCell} align="left">{convertDate(item.created)}</TableCell>
                        </>
                    )}
                </Droppable>
              </TableRow>
            )}
        </Draggable>
      );
    }

    const ListFileItem = ({item,index})=>{
      let fileCuted = isCuted(item);
      let isSelected = checkIsSelected(item);

      return (
        <Draggable 
            draggableId={item.id} 
            index={index}
        >
            {(provided, snapshot)=>(  
              <TableRow 
                onContextMenu={(event)=>handleContextMenuClick(item,event)} 
                className={clsx(
                    classes.tableListRow,
                    {
                    "selected": selectedFiles.includes(item.path),
                    'fileCuted': fileCuted,
                    "selectmodeTable": selectedFiles.length > 0
                    })
                }
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TableCell className={classes.tableCell}>
                  <Checkbox checked={isSelected} onChange={()=>addSelect(item)} value={item.id} />  
                </TableCell>
                <TableCell className={classes.tableCell}> 
                    <img style={{"width":"20px", 'maxHeight': '30px'}} src={getThumb(item)} />
                </TableCell>
                <TableCell className={classes.tableCell} align="left">{item.name}</TableCell>
                <TableCell className={classes.tableCell} align="left">{formatBytes(item.size)}</TableCell>
                <TableCell className={classes.tableCell} align="left">{convertDate(item.created)}</TableCell>
              </TableRow>
            )}
        </Draggable>
      );
    }

    const ListView = () => {
        return(
              <TableContainer component={Box}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                  
                  <TableHead>
                    <TableRow className={classes.tableHead}>
                      <TableCell style={{"width": '20px'}}></TableCell>
                      <TableCell style={{"width": '35px'}} align="left"></TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell style={{"width": '100px'}} align="left">Size</TableCell>
                      <TableCell style={{"width": '150px'}} align="left">Created</TableCell>
                    </TableRow>
                  </TableHead>

                  <Droppable droppableId="listDroppablContainer" type="CONTAINERITEM" isCombineEnabled>
                      {(provided, snapshot) => (
                        <TableBody ref={provided.innerRef} {...provided.droppableProps} >

                          {props.filesList.map((item,index) => (
                                item.type === 'folder' && <ListFolderItem key={index} index={index} item={item} /> 
                          ))}

                          {props.filesList.map((item,index) => (
                                item.type === 'file' && <ListFileItem key={index} index={index} item={item} /> 
                          ))}

                          {provided.placeholder}
                        </TableBody>
                      )}
                  </Droppable>

                </Table>
              </TableContainer>
        )
    }

    const GridView = () => {
      return (
        <div className={classes.itemsList}>

          <Droppable droppableId="mainDroppablContainer" type="CONTAINERITEM" isCombineEnabled>
            {(provided, snapshot) => (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {props.filesList.map((item,index) => (
                      item.type === 'folder' && <FolderItem  key={index} index={index} item={item} /> 
                ))}

                {props.filesList.map((item,index) => (
                      item.type === 'file' && <FileItem  key={index} index={index} item={item} /> 
                ))}

                {provided.placeholder}
              </div>
              )}
            </Droppable>

        </div>
      )
    }

    return (
      <>
        {props.itemsView === 'grid' ?  <GridView /> : <ListView /> }
      </>
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

});

export default connect(mapStateToProps, mapDispatchToProps)(ViewItems);