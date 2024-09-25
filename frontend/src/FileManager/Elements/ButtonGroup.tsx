import React from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ButtonProps } from "@mui/material/Button";
import { StyledActionButton } from "./styled";
import Icon from "./Icon";

export interface ButtonItemType extends Omit<ButtonProps, "sx"> {
  icon: string;
  label: string;
  onClick: (params: any) => void;
}
export type ButtonGroupProps = { buttons: ButtonItemType[] };

const CustomButtonGroup: React.FC<ButtonGroupProps> = ({ buttons }) => {
  const buttonComponents = buttons.map((button) => (
    <StyledActionButton
      key={button.label}
      {...button}
      startIcon={<Icon name={button.icon} />}
    >
      <span className="actionButtonLabel">{button.label}</span>
    </StyledActionButton>
  ));

  return (
    <ButtonGroup variant="text" color="primary">
      {buttonComponents}
    </ButtonGroup>
  );
};

export default CustomButtonGroup;
