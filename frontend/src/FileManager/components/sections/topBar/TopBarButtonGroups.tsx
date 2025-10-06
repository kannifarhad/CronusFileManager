import React, { memo } from "react";
import { Tooltip, ButtonGroup, useTheme } from "@mui/material";
import { StyledButton, StyledButtonGroupWrapper } from "../../elements/styled";
import { type Button } from "../../../types";
import Icon from "../../elements/Icon";

interface ButtonGroupSimpleProps {
  buttons: Button[];
}

const ButtonGroupSimple: React.FC<ButtonGroupSimpleProps> = ({ buttons }) => {
  const theme = useTheme();

  return (
    <StyledButtonGroupWrapper>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        {buttons.map((button) => (
          <Tooltip
            key={button.title}
            title={button.title}
            aria-label={button.title}
          >
            <span>
              <StyledButton
                onClick={button.onClick}
                disabled={button.disabled}
                aria-haspopup="true"
              >
                <Icon
                  name={button.icon}
                  color={
                    button.disabled
                      ? theme.cronus.iconButton.disabledColor
                      : theme.cronus.iconButton.activeColor
                  }
                />
              </StyledButton>
            </span>
          </Tooltip>
        ))}
      </ButtonGroup>
    </StyledButtonGroupWrapper>
  );
};

export default memo(ButtonGroupSimple);
