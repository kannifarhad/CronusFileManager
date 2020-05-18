import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
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
  iconStyle: {
      paddingRight: '10px'
  },
  button: {
      fontSize:'12px'
  }
}));

export default function ButtonGroupSimple(props){
  const classes = useStyles();
  const { buttons, index } = props;
  return (
    <div className={classes.root}>
      <ButtonGroup key={index} color="primary" aria-label="outlined primary button group">
        {buttons.map((button, index)=>{
            return <Button key={index} className={classes.button} onClick={button.onClick} disabled={Boolean(button.disabled)}>
                        {button.icon && <span className={`${button.icon} ${classes.iconStyle}`}></span>}{button.label}
                    </Button>
        })}
      </ButtonGroup>
    </div>
  );
}
