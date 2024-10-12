import { styled } from "@mui/material/styles";
import { Grid, MenuItem, Popover, Select } from "@mui/material";

export const TopBarWrapper = styled(Grid)(({ theme }) => ({
  padding: "5px",
  borderBottom: `1px solid ${theme.cronus.topBar.borderColor}`,
  background: theme.cronus.topBar.background,
  flex: "none",
  overflow: "hidden",
}));

export const StyledTopBarMenuItem = styled(MenuItem)(({}) => ({
  padding: "0px",
  fontSize: "13px",
  borderRadius: "5px",
  display: "block",
  "& span": {
    fontSize: "13px",
  },
  "& label": {
    margin: "0px",
  },
  "& svg": {
    width: "15px",
  },
}));

export const SettingsPopover = styled(Popover)(({}) => ({
  padding: "0px",
  "&>div": {
    // padding: "10px",
  },
}));
export const SettingsSelectOption = styled(MenuItem)(({}) => ({
  fontSize: "13px",
}));
export const SettingsSelect = styled(Select)(({}) => ({
  fontSize: "13px",
  ".MuiSelect-root": {
    // fontSize: "12px",
  },
  ".MuiSelect-select": {
    // fontSize: "12px",
  },
}));
