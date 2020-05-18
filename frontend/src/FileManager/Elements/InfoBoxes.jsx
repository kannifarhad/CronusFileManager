import React,{useEffect,useRef} from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        margin: '0px 0px 10px 0px',
    },
    title: {
        fontSize: '14px'
    },
    message: {
        fontSize: '12px',
        margin:'0',
        padding:'0',
    },
    progress: {
        width: '100%', 
        marginTop:'-15px',
        marginBottom:'10px'
    },
  
}));

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
        const classes = useStyles();
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
                <Alert
                        key={props.index}
                        className={classes.root}
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
                        <AlertTitle className={classes.title}>{alert.title}</AlertTitle>
                        <p className={classes.message}>{alert.message}</p>
                    </Alert>
                    {alert.progress && <LinearProgress className={classes.progress} />}
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