import React, { useState } from "react";
import { ListItem, List} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import clsx from "clsx";

export default function FolderList(props){
    const useStyles = makeStyles(theme => ({
        root: {
            padding: '10px 0px',
            '& .folderItem':{
                display:'block !important',
                width: '100%',
                margin:'0px !important',
                padding:'0px',
                fontSize: "13px",
    
                '& .folderTitle':{
                    position: 'relative',
                    '& .iconArrow':{
                        position: 'absolute',
                        left:'0px',
                        top: '0px',
                        fontSize: '10px',
                        lineHeight: '17px',
                        padding: '6px 5px'
                    },
                    '& .titleWrap':{
                       display:'block',
                       width: '100%',
                       padding: '5px 0px'
                    },
                    '& .title':{
                        padding: '0px 0px 0px 7px'
                    },
                },
                '& .MuiButtonBase-root': {
                    padding: '0px 0px 0px 20px',
                    borderRadius: '3px'
                },
                '& .folderSubmenu': {
                    display: 'none',
                    width: '100%',
                    padding:'0px 0px 0px 10px !important',
                    margin:'0px !important'
                },
                '&.active > .MuiButtonBase-root': {
                    background: '#0492f2',
                    color: '#fff'
                },
                '&.open > .folderSubmenu': {
                    display: 'block',
                },
                '&.open > .MuiButtonBase-root .iconArrow': {
                    transform: 'rotate(90deg)'
                }
            }
        }
    }));

    const classes = useStyles();
    const { foldersList, onFolderClick, selectedFolder } = props;
    return (  
            <div className={classes.root} key={`folderRoot`} >
                {foldersList.name && (
                    <MenuItem item={foldersList} onFolderClick={onFolderClick} currentUrl={selectedFolder} />
                )}
            </div>
    )
   
}


function MenuSubmenu(props){
    const { item, currentUrl, onFolderClick } = props;

    return (
        <List className='folderSubmenu'>
        {item.children.map((child, index) => (
          <React.Fragment key={index}>
            {child.name && (
              <MenuItem item={child} onFolderClick={onFolderClick} parentItem={item} currentUrl={currentUrl} />
            )}
          </React.Fragment>
        ))}
      </List>
    );

}


function MenuItem(props) {
    const asideLeftLIRef = React.createRef();
    const { item, currentUrl, onFolderClick} = props;
    const [expand, setExpand] = useState(false);

    const mouseClick = () => {
        onFolderClick(item.path);
    }
    const handleExpand = () => {
        setExpand(!expand);
    }

    const isMenuItemIsActive = item => {
        if (item.children && item.children.length > 0) {
        isMenuRootItemIsActive(item);
        }
        return currentUrl.indexOf(item.path) !== -1;
    };

    const isMenuRootItemIsActive = item => {
        for (const subItem of item.children) {
        if (isMenuItemIsActive(subItem)) {
            return true;
        }
        }
        return false;
    };

    const isActive = isMenuItemIsActive(item);

    return (
      <ListItem
        ref={asideLeftLIRef}
        className={clsx(
          'folderItem',
          {
            "open": isActive && item.children || expand,
            "active": item.path === currentUrl
          }
        )}
      >
        <ListItem button className="folderTitle" >
            {item.children.length > 0 && <i className="icon-next iconArrow" onClick={handleExpand} />}
            <span className="titleWrap"  onClick={mouseClick}>
                {isActive && item.children ? <i className='icon-folder' /> : <i className='icon-folder-1' /> }
                <span className="title">{item.name}</span>
            </span>
        </ListItem>

        {item.children.length > 0 && <MenuSubmenu item={item} onFolderClick={onFolderClick} parentItem={item} currentUrl={currentUrl}  /> }
        
      </ListItem>
    );
}
