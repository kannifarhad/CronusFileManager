import React, { memo, useState, forwardRef, useImperativeHandle } from "react";
import {
  Radio,
  FormControlLabel,
  Grid2 as Grid,
  FormLabel,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import {
  StyledTopBarMenuItem,
  SettingsPopover,
  SettingsSelect,
  SettingsSelectOption,
} from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import {
  ImagesThumbTypeEnum,
  OrderByFieldEnum,
  SortByFieldEnum,
} from "../../types";
import { themeList } from "../../Hooks/useCurrentTheme";
// eslint-disable-next-line no-shadow
export enum SettingsMenuEnum {
  SETTINGS = "SETTINGS",
  SEARCH = "SEARCH",
  SORTING = "SORTING",
}

interface MenuRef {
  handleOpenMenu: (
    event: React.MouseEvent<HTMLElement>,
    name: SettingsMenuEnum
  ) => void;
}

const orderOptions: {
  name: string;
  value: OrderByFieldEnum;
}[] = [
  { name: "By Name", value: OrderByFieldEnum.NAME },
  { name: "By Size", value: OrderByFieldEnum.SIZE },
  { name: "By Create Date", value: OrderByFieldEnum.DATE },
];

const sortOptions: {
  name: string;
  value: SortByFieldEnum;
}[] = [
  { name: "Ascending", value: SortByFieldEnum.ASC },
  { name: "Descending", value: SortByFieldEnum.DESC },
];

const imageViewOptions: {
  name: string;
  value: ImagesThumbTypeEnum;
}[] = [
  { name: "Show Icons", value: ImagesThumbTypeEnum.ICONS },
  { name: "Show Thumbs", value: ImagesThumbTypeEnum.THUMB },
];

const TopBarRightMenus = forwardRef<MenuRef, any>((_, ref) => {
  const {
    settings,
    operations: { handleSetOrder, handleSetThumbView, handleSelectTheme },
  } = useFileManagerState();
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

  if (!open) return null;

  return (
    <SettingsPopover
      id="sorting-menu"
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
      <Box sx={{ padding: "10px 10px", width: "300px" }}>
        <Box>
          <FormLabel sx={{ fontSize: "14px", fontWeight: "bold" }}>
            Sorting
          </FormLabel>
          <Grid container sx={{ marginTop: "5px" }} spacing={1}>
            <Grid size={6}>
              <FormControl fullWidth variant="filled" size="small">
                <InputLabel id="files-orderby-label">Field</InputLabel>
                <SettingsSelect
                  value={settings.orderFiles?.field}
                  label="Field"
                  size="small"
                  labelId="files-orderby-label"
                  onClick={(event: any) => {
                    if (event.target.dataset.value) {
                      handleSetOrder({
                        ...settings.orderFiles,
                        field: event.target.dataset.value as OrderByFieldEnum,
                      });
                    }
                  }}
                >
                  {orderOptions.map((option) => (
                    <SettingsSelectOption
                      value={option.value}
                      key={option.name}
                    >
                      {option.name}
                    </SettingsSelectOption>
                  ))}
                </SettingsSelect>
              </FormControl>
            </Grid>

            <Grid size={6}>
              <FormControl fullWidth variant="filled" size="small">
                <InputLabel id="files-orderby-label">Order</InputLabel>
                <SettingsSelect
                  value={settings.orderFiles?.orderBy}
                  label="Order"
                  size="small"
                  labelId="files-orderby-label"
                  onClick={(event: any) => {
                    if (event.target.dataset.value) {
                      handleSetOrder({
                        ...settings.orderFiles,
                        orderBy: event.target.dataset.value as SortByFieldEnum,
                      });
                    }
                  }}
                >
                  {sortOptions.map((option) => (
                    <SettingsSelectOption
                      value={option.value}
                      key={option.name}
                    >
                      {option.name}
                    </SettingsSelectOption>
                  ))}
                </SettingsSelect>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <FormLabel sx={{ fontSize: "14px", fontWeight: "bold" }}>
            Theme
          </FormLabel>
          <Grid container sx={{ marginTop: "5px" }} spacing={1}>
            <SettingsSelect
              fullWidth
              value={settings.selectedTheme ?? themeList[1].id}
              size="small"
              labelId="files-orderby-label"
              onClick={(event: any) => {
                if (event.target.dataset.value) {
                  handleSelectTheme(event.target.dataset.value);
                }
              }}
            >
              {themeList.map((option) => (
                <SettingsSelectOption value={option.id} key={option.name}>
                  {option.name}
                </SettingsSelectOption>
              ))}
            </SettingsSelect>
          </Grid>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <FormLabel
            sx={{ fontSize: "14px", fontWeight: "bold", marginTop: "10px" }}
          >
            Images on files list
          </FormLabel>
          <Grid container sx={{ marginTop: "5px" }} spacing={1}>
            {imageViewOptions.map((option) => (
              <Grid size={6} key={option.name}>
                <StyledTopBarMenuItem
                  selected={option.value === settings.showImages}
                  onClick={() => handleSetThumbView(option.value)}
                >
                  <FormControlLabel
                    value={option.value}
                    control={
                      <Radio
                        name="orderField"
                        checked={option.value === settings.showImages}
                        value={option.value}
                      />
                    }
                    label={option.name}
                  />
                </StyledTopBarMenuItem>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </SettingsPopover>
  );
});

export default memo(TopBarRightMenus);
