import React, { memo,useState, forwardRef, useImperativeHandle } from "react";
import { Menu, Radio, Divider, FormControlLabel } from "@mui/material";
import { StyledTopBarMenuItem } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ImagesThumbTypeEnum, OrderByFieldEnum, SortByFieldEnum } from "../../types";

export enum SettingsMenuEnum {
  SETTINGS = 'SETTINGS',
  SEARCH = 'SEARCH',
  SORTING = 'SORTING'
}

interface MenuRef {
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, name: SettingsMenuEnum) => void;
}

const orderOptions: {
  name: string;
  value: OrderByFieldEnum ;
}[] = [
  { name: "By Name", value: OrderByFieldEnum.NAME },
  { name: "By Size", value: OrderByFieldEnum.SIZE },
  { name: "By Create Date", value: OrderByFieldEnum.DATE },
];

const sortOptions: {
  name: string;
  value: SortByFieldEnum ;
}[] = [
  { name: "Ascending", value: SortByFieldEnum.ASC },
  { name: "Descending", value: SortByFieldEnum.DESC },
]

const imageViewOptions: {
  name: string;
  value: ImagesThumbTypeEnum;
}[] = [
  { name: "Show Thumbs", value: ImagesThumbTypeEnum.THUMB },
  { name: "Show Icons", value: ImagesThumbTypeEnum.ICONS },
]

const TopBarRightMenus = forwardRef<MenuRef, any>((_, ref) => {
  const { showImages, orderFiles, operations:{ handleSetOrder, handleSetThumbView } } = useFileManagerState();
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

  if(!open) return null;

  return (
    <>
      <Menu
        id="sorting-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open === SettingsMenuEnum.SORTING}
        onClose={handleClose}
      >
        {orderOptions.map((option, index) => (
          <StyledTopBarMenuItem
            key={index}
            selected={option.value === orderFiles?.field}
            onClick={() => handleSetOrder({ ...orderFiles, field: option.value })}
          >
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  name="orderField"
                  checked={option.value === orderFiles?.field}
                  value={option.value}
                />
              }
              label={option.name}
            />
          </StyledTopBarMenuItem>
        ))}
        <Divider />
        {sortOptions.map((option, index) => (
          <StyledTopBarMenuItem
            key={index}
            selected={option.value === orderFiles.orderBy}
            onClick={() => handleSetOrder({ ...orderFiles, orderBy: option.value })}
          >
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  name="orderField"
                  checked={option.value === orderFiles.orderBy}
                  value={option.value}
                />
              }
              label={option.name}
            />
          </StyledTopBarMenuItem>
        ))}
      </Menu>

      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open === SettingsMenuEnum.SETTINGS}
        onClose={handleClose}
      >
        {imageViewOptions.map((option, index) => (
          <StyledTopBarMenuItem
            key={index}
            selected={option.value === showImages}
            onClick={() => handleSetThumbView(option.value)}        
          >
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  name="orderField"
                  checked={option.value === showImages}
                  value={option.value}
                />
              }
              label={option.name}
            />
          </StyledTopBarMenuItem>
        ))}
      </Menu>
    </>
  );
});

export default memo(TopBarRightMenus);
