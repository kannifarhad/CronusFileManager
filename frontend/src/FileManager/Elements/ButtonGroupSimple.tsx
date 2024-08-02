import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

interface ButtonData {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
}

interface ButtonGroupSimpleProps {
  buttons: ButtonData[];
}

const ButtonGroupSimple: React.FC<ButtonGroupSimpleProps> = ({ buttons }) => {
  return (
    <div className="root">
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        {buttons.map((button, index) => (
          <Button
            key={index}
            className="button"
            onClick={button.onClick}
            disabled={Boolean(button.disabled)}
          >
            {button.icon && <span className={button.icon}></span>}
            {button.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default ButtonGroupSimple;
