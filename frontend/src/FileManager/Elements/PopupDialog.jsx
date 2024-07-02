import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
} from "@mui/material";
import Translate from "../../Utils/Translate";
import InputField from "./InputField";
import { StyledPopUpDialog } from "./styled";
// import useStyles from "./Styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom in={props.open} ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const { open, title, description, handleClose, handleSubmit, nameInputSets } =
    props;
  const [renameText, setRenameText] = useState(
    typeof nameInputSets.value !== undefined ? nameInputSets.value : ""
  );
  if (!open) return null;
  const handleNameChange = (value) => {
    setRenameText(value);
    props.nameInputSets.callBack(value);
  };
  return (
    <StyledPopUpDialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      className="dialogBlock"
    >
      <DialogTitle className="dialogTitle">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText className="dialogDescription">
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </DialogContentText>
        {nameInputSets.value && (
          <div className="form-group">
            <InputField
              type="text"
              label={<Translate>{nameInputSets.label}</Translate>}
              onChange={handleNameChange}
              value={renameText}
              variant="outlined"
            />
          </div>
        )}
      </DialogContent>

      <DialogActions className="dialogButtons">
        <Button onClick={handleClose} variant="contained" color="secondary">
          <Translate>Cancel</Translate>
        </Button>
        {handleSubmit && (
          <Button onClick={handleSubmit} variant="contained" color="primary">
            <Translate>Submit</Translate>
          </Button>
        )}
      </DialogActions>
    </StyledPopUpDialog>
  );
}
