import React, { memo, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { Box } from "@mui/material";
import Settings from "./settings";
import { SettingsMenuEnum } from "./settings/constants";
import { SettingsPopover } from "./styled";
import Searching from "./Searching";

interface MenuRef {
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, name: SettingsMenuEnum) => void;
}

const TopBarRightMenus = forwardRef<MenuRef, any>((_, ref) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<SettingsMenuEnum | null>(null);

  useImperativeHandle(ref, () => ({
    handleOpenMenu: (event, name) => {
      setOpen(name);
      setAnchorEl(event.currentTarget);
    },
  }));

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(null);
  };

  const PopOverContent = useMemo(() => {
    switch (open) {
      case SettingsMenuEnum.SETTINGS:
        return <Settings />;

      case SettingsMenuEnum.SEARCH:
        return <Searching />;

      default:
        return null;
    }
  }, [open]);

  if (!open) return null;

  return (
    <SettingsPopover
      id="settings-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(open)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ padding: "10px 10px", width: "300px" }}>{PopOverContent}</Box>
    </SettingsPopover>
  );
});

export default memo(TopBarRightMenus);
