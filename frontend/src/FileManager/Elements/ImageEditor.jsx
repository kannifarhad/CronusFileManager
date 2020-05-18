import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import '../Assets/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import whiteTheme from '../Assets/whiteTheme';
import ButtonList from './ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import Zoom  from '@material-ui/core/Zoom';

const useStyles = makeStyles(theme => ({
  buttonsCont: {
    textAlign: 'center',
    borderRadius: '0px 0px 5px 5px',
    border: '1px solid #E9eef9',
    borderTop:'none',
    padding:'15px',
    background:'#fff'
  },
dialog:{
}

}));

export default function ImageEditPopup(props){
    const {closeCallBack, submitCallback, name,extension, path, open } = props;
    const classes = useStyles();
    const editorRef = React.createRef();

    const handleClickButton = (asNew) => {
      const format = extension !== '.jpg' ? 'jpeg' : 'png';
      const editorInstance = editorRef.current.getInstance();
      const imageData = editorInstance._graphics.toDataURL({
        quality: 0.7,
        format
      });
      submitCallback(imageData,asNew);

    };

    const buttons = [
      {
        name: 'submit',
        icon: 'icon-exit',
        label: 'Save & Quit',
        class: 'green',
        onClick: ()=>handleClickButton(false)
      },
      {
        name: 'update',
        icon: 'icon-save',
        label: 'Save as new file',
        class: 'blue',
        onClick: ()=>handleClickButton(true)
      },
      {
        name: 'submit',
        icon: 'icon-ban',
        label: 'Cancel',
        class: 'red',
        onClick: ()=>closeCallBack()
      }
    ];

    const Transition = React.forwardRef(function Transition(props, ref) {
      return <Zoom in={props.open} ref={ref} {...props} />;
    });
  
    return (
      <Dialog
        open={Boolean(open)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={'xl'}
        onClose={closeCallBack}
        className={classes.dialog}
      >
          <ImageEditor 
            ref={editorRef}
            includeUI={{
                loadImage: {
                    path: path,
                    name: name
                },
                theme: whiteTheme,
                initMenu: 'filter',
                uiSize: {
                    width: '100%',
                    height: '700px'
                },
                menuBarPosition: 'bottom'
            }}
                cssMaxHeight={500}
                selectionStyle={{
                cornerSize: 20,
                rotatingPointOffset: 70
            }}
            usageStatistics={true}
            
          />
          <div className={classes.buttonsCont} >
            <ButtonList buttons={buttons} />
          </div>

        </Dialog>
    );
}