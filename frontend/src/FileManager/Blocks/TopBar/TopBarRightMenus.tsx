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

const themeOptions: {
  name: string;
  value: string;
}[] = [
  { name: "Dark", value: "DARK" },
  { name: "Light", value: "LIGHT" },
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
    showImages,
    orderFiles,
    operations: { handleSetOrder, handleSetThumbView },
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
                  value={orderFiles?.field}
                  label="Field"
                  size="small"
                  labelId="files-orderby-label"
                  onClick={(event: any) => {
                    if (event.target.dataset.value) {
                      handleSetOrder({
                        ...orderFiles,
                        field: event.target.dataset.value as OrderByFieldEnum,
                      });
                    }
                  }}
                >
                  {orderOptions.map((option) => (
                    <SettingsSelectOption value={option.value}>
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
                  value={orderFiles?.orderBy}
                  label="Order"
                  size="small"
                  labelId="files-orderby-label"
                  onClick={(event: any) => {
                    if (event.target.dataset.value) {
                      handleSetOrder({
                        ...orderFiles,
                        orderBy: event.target.dataset.value as SortByFieldEnum,
                      });
                    }
                  }}
                >
                  {sortOptions.map((option) => (
                    <SettingsSelectOption value={option.value}>
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
              value="DARK"
              size="small"
              labelId="files-orderby-label"
              onClick={(event: any) => {
                if (event.target.dataset.value) {
                  handleSetOrder({
                    ...orderFiles,
                    field: event.target.dataset.value as OrderByFieldEnum,
                  });
                }
              }}
            >
              {themeOptions.map((option) => (
                <SettingsSelectOption value={option.value}>
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
              <Grid size={6}>
                <StyledTopBarMenuItem
                  key={option.name}
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
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </SettingsPopover>
  );
});

export default memo(TopBarRightMenus);
