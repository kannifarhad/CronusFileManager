import { memo } from "react";
import { Grid2 as Grid, FormLabel, Box } from "@mui/material";
import { SettingsSelect, SettingsSelectOption } from "../styled";
import { themeList } from "../../../../hooks/useCurrentTheme";
import { useFileManagerState } from "../../../../store/FileManagerContext";

const ThemeSelection = () => {
  const {
    settings,
    operations: { handleSelectTheme },
  } = useFileManagerState();

  return (
    <Box sx={{ marginTop: "10px" }}>
      <FormLabel sx={{ fontSize: "14px", fontWeight: "bold" }}>Theme</FormLabel>
      <Grid container sx={{ marginTop: "5px" }} spacing={1}>
        <SettingsSelect
          fullWidth
          value={settings.selectedTheme ?? themeList[1].id}
          size="small"
          labelId="theme-selection-label"
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
  );
};

export default memo(ThemeSelection);
