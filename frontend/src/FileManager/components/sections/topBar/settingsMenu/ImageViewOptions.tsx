import { memo } from "react";
import { Radio, FormControlLabel, Grid, FormLabel, Box } from "@mui/material";
import { StyledTopBarMenuItem } from "../styled";
import { imageViewOptions } from "./constants";
import { useSelectSettingsTumbs } from "../../../../context";
import useSettingsOperations from "../../../../hooks/useSettingsOperations";

const ImageViewOptions = () => {
  const showImages = useSelectSettingsTumbs();
  const { handleSetThumbView } = useSettingsOperations();

  return (
    <Box sx={{ marginTop: "10px" }}>
      <FormLabel sx={{ fontSize: "14px", fontWeight: "bold", marginTop: "10px" }}>Images on files list</FormLabel>
      <Grid container sx={{ marginTop: "5px" }} spacing={1}>
        {imageViewOptions.map((option) => (
          <Grid size={6} key={option.name}>
            <StyledTopBarMenuItem
              selected={option.value === showImages}
              onClick={() => handleSetThumbView(option.value)}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio name="imageViewOption" checked={option.value === showImages} value={option.value} />}
                label={option.name}
              />
            </StyledTopBarMenuItem>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default memo(ImageViewOptions);
