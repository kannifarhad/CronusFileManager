import React, { forwardRef, useRef } from "react";
// import '../Assets/tui-image-editor.css';
import ImageEditor from './ImageEditorComponent';
import whiteTheme from '../Assets/whiteTheme';
import ButtonList from './ButtonGroup';
import Dialog from '@mui/material/Dialog';
import Zoom from '@mui/material/Zoom';
import { FileEditPopupProps } from "../types";
import {ImageEditorContainer} from './styledImageeditor'


const props:FileEditPopupProps  = {
  open: true,
  extension:'.jpg',
  name: 'File name',
  closeCallBack:()=>{ console.log('close')},
  path: 'http://localhost:3131/uploads/bigl.jpg',
  submitCallback:()=>{ console.log('submit')}
}

const ImageEditPopup: React.FC<{}> = () => {
  const { closeCallBack, submitCallback, name, extension, path, open } = props;
  const editorRef = useRef<any>(null);

  const handleClickButton = (asNew: boolean) => {
    const format = extension !== '.jpg' ? 'jpeg' : 'png';
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      const imageData = editorInstance._graphics.toDataURL({
        quality: 0.7,
        format,
      });
      submitCallback(imageData, asNew);
    }
  };

  const buttons = [
    {
      name: 'submit',
      icon: 'icon-exit',
      label: 'Save & Quit',
      class: 'green',
      onClick: () => handleClickButton(false),
    },
    {
      name: 'update',
      icon: 'icon-save',
      label: 'Save as new file',
      class: 'blue',
      onClick: () => handleClickButton(true),
    },
    {
      name: 'submit',
      icon: 'icon-ban',
      label: 'Cancel',
      class: 'red',
      onClick: () => closeCallBack(),
    },
  ];

  const Transition = forwardRef(function Transition(
    transitionProps: any,
    ref: React.Ref<unknown>
  ) {
    return <Zoom in={transitionProps.open} ref={ref} {...transitionProps} />;
  });

  return (
    <Dialog
      open={Boolean(open)}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={'xl'}
      onClose={closeCallBack}
      className='dialog'
    >
<ImageEditorContainer>
      <ImageEditor
        ref={editorRef}
        includeUI={{
          loadImage: {
            path: path,
            name: name,
          },
          theme: whiteTheme,
          initMenu: 'filter',
          uiSize: {
            width: '100%',
            height: '700px',
          },
          menuBarPosition: 'bottom',
        }}
        cssMaxHeight={500}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={true}
      />
      </ImageEditorContainer>
      <div className='buttonsCont'>
        <ButtonList buttons={buttons} />
      </div>
    </Dialog>
  );
};

export default ImageEditPopup;
