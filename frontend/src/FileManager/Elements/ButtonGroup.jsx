import React from 'react';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function InputField(props) {
        const { buttons} = props;

        const buttonsComponents = buttons.map((button, i) => (
            <Button
                className={`customIconButton ${button.class}`}
                key={i}
                variant={button.varinat || 'contained'}
                color={button.color || 'primary'}
                size={button.size}
                startIcon={<Icon className={button.icon}></Icon>}
                onClick={() => button.onClick() }
            >
                {button.label}
            </Button>
        ));
        return (
            <ButtonGroup variant="text" color="primary" >
                {buttonsComponents}          
            </ButtonGroup>
        );
}
