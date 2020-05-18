import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom  from '@material-ui/core/Zoom';
import Translate from '../../Utils/Translate';
import InputField from './InputField';
import useStyles from './Styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom in={props.open} ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const classes = useStyles();
  const { open, title, description , handleClose, handleSubmit, nameInputSets } = props; 
  const nameValue = typeof nameInputSets.value !== undefined ? nameInputSets.value : '';
  const [renameText, setRenameText] = useState(nameValue);
  const handleNameChange = value => {
    setRenameText(value);
    props.nameInputSets.callBack(value);
  }
  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        className="dialogBlock"
      >
        <DialogTitle className="dialogTitle">{title}</DialogTitle>

        <DialogContent>
          <DialogContentText className="dialogDescription">
            <div className={classes.dialogDescription} dangerouslySetInnerHTML={{__html: description}}></div>
          </DialogContentText>
          {nameInputSets.value && 
                <div className="form-group">
                    <InputField
                        type="text"
                        label={<Translate>{nameInputSets.label}</Translate>}
                        onChange={handleNameChange}
                        value={renameText}
                        variant='outlined'
                        />
                </div> 
          }
        </DialogContent>

        <DialogActions className="dialogButtons">
          <Button onClick={handleClose} variant="contained" color="secondary"><Translate>Cancel</Translate></Button>
          {handleSubmit && <Button onClick={handleSubmit} variant="contained" color="primary"><Translate>Submit</Translate></Button>}
        </DialogActions>

      </Dialog>
  );
}
