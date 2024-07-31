import React from 'react';
import Icon from '@mui/material/Icon';
import ButtonGroup from '@mui/material/ButtonGroup';
import { ButtonProps } from '@mui/material/Button';
import { StyledActionButton } from './styled';

export interface ButtonGroupProps {
  buttons: {
    variant?: ButtonProps['variant'];
    color?: ButtonProps['color'];
    size?: ButtonProps['size'];
    icon: string;
    label: string;
    onClick: () => void;
  }[];
}

const CustomButtonGroup: React.FC<ButtonGroupProps> = ({ buttons }) => {
  const buttonComponents = buttons.map((button, i) => (
    <StyledActionButton
      key={i}
      variant={button.variant || 'contained'}
      color={button.color || 'primary'}
      size={button.size}
      startIcon={<Icon className={button.icon}></Icon>}
      onClick={button.onClick}
    >
      <span className='actionButtonLabel'>{button.label}</span>
    </StyledActionButton>
  ));

  return (
    <ButtonGroup variant="text" color="primary">
      {buttonComponents}
    </ButtonGroup>
  );
}

export default CustomButtonGroup;
