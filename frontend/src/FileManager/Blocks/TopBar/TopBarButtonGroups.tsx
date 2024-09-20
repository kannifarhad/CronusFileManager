import React, { memo } from "react";
import { Tooltip, ButtonGroup } from "@mui/material";
import { StyledButton, StyledButtonGroupWrapper } from "../../Elements/styled";
import { Button } from "../../types";
import Icon from "../../Elements/Icon";

interface ButtonGroupSimpleProps {
  buttons: Button[];
}

const ButtonGroupSimple: React.FC<ButtonGroupSimpleProps> = ({ buttons }) => (
  <StyledButtonGroupWrapper>
    <ButtonGroup color="primary" aria-label="outlined primary button group">
      {buttons.map((button) => (
        <Tooltip
          key={button.title}
          title={button.title}
          aria-label={button.title}
        >
          <StyledButton
            onClick={button.onClick}
            disabled={button.disabled}
            aria-haspopup="true"
          >
            {/* {button.icon && <span className={button.icon} />} */}
            <Icon name={button.icon} color={button.disabled ? "#ccc" :"#556cd6" }/>
          </StyledButton>
        </Tooltip>
      ))}
    </ButtonGroup>
  </StyledButtonGroupWrapper>
);

export default memo(ButtonGroupSimple);
