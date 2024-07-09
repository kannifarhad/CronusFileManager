import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     '& > *': {
//       margin: theme.spacing(1),
//     },
//   },
//   iconStyle: {
//       paddingRight: '10px'
//   },
//   button: {
//       fontSize:'12px'
//   }
// }));

export default function ButtonGroupSimple(props){
  const { buttons, index } = props;
  return (
    <div className={'root'}>
      <ButtonGroup key={index} color="primary" aria-label="outlined primary button group">
        {buttons.map((button, index)=>{
            return <Button key={index} className={'button'} onClick={button.onClick} disabled={Boolean(button.disabled)}>
                        {button.icon && <span 
                        // className={`${button.icon} ${classes.iconStyle}`}
                        >
                          </span>}{button.label}
                    </Button>
        })}
      </ButtonGroup>
    </div>
  );
}
