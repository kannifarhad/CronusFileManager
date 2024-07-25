import React, { useState, ForwardRefRenderFunction } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
  ZoomProps,
} from "@mui/material";
import Translate from "../../Utils/Translate";
import InputField from "./InputField";
import { StyledPopUpDialog } from "./styled";

interface NameInputSets {
  value: string;
  label: string;
  callBack: (value: string) => void;
}

interface AlertDialogSlideProps {
  open: boolean;
  title: string;
  description: string;
  handleClose: () => void;
  handleSubmit?: () => void;
  nameInputSets?: NameInputSets;
}

const Transition: ForwardRefRenderFunction<unknown, ZoomProps> = (props, ref) => {
  return <Zoom ref={ref} {...props} />;
};

const AlertDialogSlide: React.FC<AlertDialogSlideProps> = (props) => {
  const { open, title, description, handleClose, handleSubmit, nameInputSets } = props;

  const [renameText, setRenameText] = useState<string>(
    nameInputSets?.value ?? ""
  );

  if (!open) return null;

  const handleNameChange = (value: string) => {
    setRenameText(value);
    nameInputSets?.callBack(value);
  };

  return (
    <StyledPopUpDialog
      open={open}
      TransitionComponent={React.forwardRef(Transition)}
      keepMounted
      onClose={handleClose}
      className="dialogBlock"
    >
      <DialogTitle className="dialogTitle">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText className="dialogDescription">
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </DialogContentText>
        {nameInputSets && (
          <div className="form-group">
            <InputField
              type="text"
              label={<Translate>{nameInputSets.label}</Translate>}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleNameChange(e.target.value)}
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
};

export default AlertDialogSlide;
