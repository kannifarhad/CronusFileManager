import React, { useState, ForwardRefRenderFunction, memo } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
  ZoomProps,
} from "@mui/material";
import InputField from "./InputField";
import { StyledPopUpDialog } from "./styled";
import { useFileManagerState } from "../ContextStore/FileManagerContext";
import { PopupData } from "../types";

const Transition: ForwardRefRenderFunction<unknown, ZoomProps> = (
  props,
  ref,
) => <Zoom ref={ref} {...props} />;

const AlertDialog: React.FC<PopupData> = (props) => {
  const { title, description, handleClose, handleSubmit, nameInputSets } =
    props;
  const [renameText, setRenameText] = useState<string>(
    nameInputSets?.value ?? "",
  );
  return (
    <>
      <DialogTitle className="dialogTitle">{title}</DialogTitle>

      <DialogContent>
        {description && (
          <DialogContentText className="dialogDescription">
            <div>{description}</div>
          </DialogContentText>
        )}
        {nameInputSets && (
          <div className="form-group">
            <InputField
              sx={{
                marginTop: "20px",
              }}
              type="text"
              label={nameInputSets.label}
              onChange={setRenameText}
              value={renameText}
              variant="outlined"
            />
          </div>
        )}
      </DialogContent>

      <DialogActions className="dialogButtons">
        <Button onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </Button>
        {handleSubmit && (
          <Button
            onClick={() => handleSubmit(renameText)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </>
  );
};

const AlertDialogSlide: React.FC<{}> = () => {
  const { popUpData } = useFileManagerState();
  if (!popUpData) return null;

  return (
    <StyledPopUpDialog
      open={Boolean(popUpData)}
      TransitionComponent={React.forwardRef(Transition)}
      keepMounted
      onClose={popUpData.handleClose}
      className="dialogBlock"
    >
      <AlertDialog {...popUpData} />
    </StyledPopUpDialog>
  );
};

export default memo(AlertDialogSlide);
