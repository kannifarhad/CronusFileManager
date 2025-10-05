import { memo } from "react";
import { Grid2 as Grid, FormLabel, FormControl, InputLabel, Box } from "@mui/material";
import { SettingsSelect, SettingsSelectOption } from "../styled";
import { OrderByFieldEnum, SortByFieldEnum } from "../../../types";
import { orderOptions, sortOptions } from "./constants";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";

const SortingOptions = () => {
  const {
    settings,
    operations: { handleSetOrder },
  } = useFileManagerState();

  return (
    <Box>
      <FormLabel sx={{ fontSize: "14px", fontWeight: "bold" }}>Sorting</FormLabel>
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
                <SettingsSelectOption value={option.value} key={option.name}>
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
                <SettingsSelectOption value={option.value} key={option.name}>
                  {option.name}
                </SettingsSelectOption>
              ))}
            </SettingsSelect>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(SortingOptions);
