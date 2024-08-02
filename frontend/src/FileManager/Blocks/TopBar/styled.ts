import { styled } from "@mui/system";
import { Grid, MenuItem } from "@mui/material";

export const TopBarWrapper = styled(Grid)(({ theme }) => ({
  padding: "5px",
  borderBottom: "1px solid #868DAA",
  background: "#f6f7fd",
  flex: 'none',
  overflow: 'hidden',
}));

export const StyledTopBarMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "0px",
  fontSize: "13px",
  width: "250px",
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
