import React from 'react';
import {Tooltip, Button, ButtonGroup} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  button: {
      fontSize:'14px',
      padding:'10px 5px',
      minWidth: '35px',
      background: '#fff',
      '& span':{

      }
  },
  buttonTitle: {
    fontSize: '12px',
    textTransform: 'none',
    lineHeight: '11px',
    padding: '0px 5px'

  }
}));

export default function ButtonGroupSimple(props){
  const classes = useStyles();
  const { buttons, index } = props;
  return (
    <div className={classes.root}>
      <ButtonGroup key={index} color="primary" aria-label="outlined primary button group">
        {buttons.map((button, index)=>{
            return button.disable ?
                          <Button  key={index} className={classes.button} disabled={true} aria-haspopup="true">
                            {button.icon && <span className={`${button.icon}`}></span>}
                          </Button>
                          : 
                          <Tooltip key={index} title={button.title} aria-label={button.title}>
                            <Button  className={classes.button} onClick={button.onClick} disabled={button.disable} aria-haspopup="true">
                              {button.icon && <span className={`${button.icon}`}></span>}
                              {/* <span className={classes.buttonTitle}>{button.title}</span> */}
                            </Button>
                          </Tooltip>
                  
        })}
      </ButtonGroup>
    </div>
  );
}
