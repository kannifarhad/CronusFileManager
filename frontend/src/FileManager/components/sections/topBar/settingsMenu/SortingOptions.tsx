/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Grid, FormLabel, FormControl, InputLabel, Box } from "@mui/material";
import { SettingsSelect, SettingsSelectOption } from "../styled";
import { OrderByFieldEnum, SortByFieldEnum } from "../../../../types";
import { orderOptions, sortOptions } from "./constants";
import useSettingsOperations from "../../../../hooks/useSettingsOperations";
import { useSettingsOrder } from "../../../../context";

const SortingOptions = () => {
  const orderFiles = useSettingsOrder();
  const { handleSetOrder } = useSettingsOperations();

  return (
    <Box>
      <FormLabel sx={{ fontSize: "14px", fontWeight: "bold" }}>Sorting</FormLabel>
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
