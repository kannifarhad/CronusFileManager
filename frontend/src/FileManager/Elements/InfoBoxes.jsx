import React,{useEffect,useRef} from 'react';
import PropTypes from 'prop-types';
import { AlertTitle, IconButton, Collapse , LinearProgress} from '@mui/material';
import {StyledInfoBox} from './styled';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

export default function InfoBoxes(props) {
    const {alert}  = props;
    const [open, setOpen] = React.useState(true);
    const prevAlert = usePrevious(alert);
    const timer = (delay)=> {
        setTimeout(() => {
            setOpen(false);
        }, delay);
    } 
    
    useEffect(() => {
        if(prevAlert !== alert) {
            setOpen(true);
        }
    }, [alert])

    return (
        <>  
        <Collapse in={open}>
            <StyledInfoBox
                key={props.index}
                severity={alert.type}
                action={
                    !alert.disableClose &&
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => { setOpen(false); }}
                    >
                        <span className="icon-cancel"></span>
                    </IconButton>
                }
            >
                    <AlertTitle className={'fmInfoBoxtitle'}>{alert.title}</AlertTitle>
                    <p className={'fmInfoBoxmessage'}>{alert.message}</p>
                </StyledInfoBox>
                {alert.progress && <LinearProgress className={'fmInfoBoxprogress'} />}
                {alert.timer && timer(alert.timer)}
            </Collapse>
        </>
    );
}

InfoBoxes.propTypes = {
    alert: PropTypes.shape({
        title: PropTypes.string,
        message: PropTypes.string,
        type: PropTypes.string,
        disableClose: PropTypes.bool,
      }),
    
};