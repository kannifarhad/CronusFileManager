import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import ImageEditor from "./ImageEditorComponent";
import whiteTheme from "../../utils/assets/whiteTheme";
import ButtonList, { type ButtonGroupProps } from "./ButtonGroup";
import { type FileEditPopupProps } from "../../types";
import { ImageEditorContainer } from "./styledImageeditor";
import { StyledFileEditFooter } from "./styled";
import { useFileManagerState } from "../../store/FileManagerContext";

const ImageEditContent: React.FC<FileEditPopupProps & { filePath: string }> = ({
  closeCallBack,
  submitCallback,
  filePath,
  selectedFile,
}) => {
  const editorRef = useRef<any>(null);

  const handleClickButton = useCallback(
    (isnew: boolean) => {
      const format = selectedFile.extension !== ".jpg" ? "jpeg" : "png";
      const editorInstance = editorRef.current?.getInstance();
      if (editorInstance) {
        const imageData = editorInstance._graphics.toDataURL({
          quality: 0.7,
          format,
        });
        submitCallback({ file: imageData, selectedFile, isnew });
      }
    },
    [selectedFile, submitCallback]
  );

  const buttons = useMemo(
    () =>
      [
        {
          icon: "icon-exit",
          label: "Save & Quit",
          variant: "outlined",
          color: "primary",
          onClick: () => handleClickButton(false),
        },
        {
          icon: "icon-save",
          label: "Save as new file",
          variant: "outlined",
          color: "success",
          onClick: () => handleClickButton(true),
        },
        {
          icon: "Ban",
          label: "Cancel",
          variant: "outlined",
          color: "error",
          onClick: () => closeCallBack(),
        },
      ] as ButtonGroupProps["buttons"],
    [handleClickButton, closeCallBack]
  );

  return (
    <>
      <ImageEditorContainer>
        <ImageEditor
          ref={editorRef}
          includeUI={{
            loadImage: {
              path: filePath,
              name: selectedFile.name,
            },
            theme: whiteTheme,
            initMenu: "filter",
            uiSize: {
              width: "100%",
              height: "700px",
            },
            menuBarPosition: "bottom",
          }}
          cssMaxHeight={500}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics
        />
      </ImageEditorContainer>
      <StyledFileEditFooter>
        <ButtonList buttons={buttons} />
      </StyledFileEditFooter>
    </>
  );
};

const Transition = forwardRef((transitionProps: any, ref: React.Ref<unknown>) => (
  <Zoom in={transitionProps.open} ref={ref} {...transitionProps} />
));

const ImageEditPopup: React.FC<{}> = () => {
  const {
    fileEdit,
    operations: { handleGetThumb },
  } = useFileManagerState();
  if (!fileEdit) return null;

  return (
    <Dialog
      open={Boolean(fileEdit)}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="xl"
      onClose={fileEdit.closeCallBack}
      className="dialog"
    >
      <ImageEditContent {...fileEdit} filePath={handleGetThumb(fileEdit.selectedFile)!} />
    </Dialog>
  );
};

export default ImageEditPopup;
