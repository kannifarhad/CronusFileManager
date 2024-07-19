import React from 'react';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { ButtonProps } from '@mui/material/Button';

interface InputFieldProps {
  buttons: {
    class?: string;
    variant?: ButtonProps['variant'];
    color?: ButtonProps['color'];
    size?: ButtonProps['size'];
    icon: string;
    label: string;
    onClick: () => void;
  }[];
}

const InputField: React.FC<InputFieldProps> = ({ buttons }) => {
  const buttonComponents = buttons.map((button, i) => (
    <Button
      className={`customIconButton ${button.class || ''}`}
      key={i}
      variant={button.variant || 'contained'}
      color={button.color || 'primary'}
      size={button.size}
      startIcon={<Icon className={button.icon}></Icon>}
      onClick={button.onClick}
    >
      {button.label}
    </Button>
  ));

  return (
    <ButtonGroup variant="text" color="primary">
      {buttonComponents}
    </ButtonGroup>
  );
}

export default InputField;
