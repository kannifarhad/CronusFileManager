import React, { memo, useState } from "react";
import {
  OutlinedInput,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid2 as Grid,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Icon from "../../Elements/Icon";
import { StyledTopBarMenuItem } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import useText from "../../Hooks/useTexts";

const Searching = () => {
  const [name, setName] = React.useState("");
  const [searchLocation, setSearchLocation] = useState<string | null>(null);
  const {
    // search,
    // selectedFolder
    operations: { handleSearchItems },
  } = useFileManagerState();
  const texts = useText();

  const disabled = !(name.length > 3);
  return (
    <Box sx={{ marginTop: "10px" }}>
      <FormControl
        sx={{ fontSize: "14px" }}
        fullWidth
        variant="outlined"
        size="small"
      >
        <InputLabel id="search-input-label" sx={{ fontSize: "14px" }}>
          {texts.search}
        </InputLabel>

        <OutlinedInput
          id="search-input-field"
          label={texts.search}
          inputProps={{
            "aria-label": "weight",
          }}
          sx={{ fontSize: "13px" }}
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          aria-describedby="search-input-label"
          endAdornment={
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={() => handleSearchItems(name)}
            >
              <Icon
                name="Search"
                color={disabled ? "#ccc" : "#556cd6"}
                size={14}
              />
            </IconButton>
          }
        />
        <FormHelperText id="search-input-field" sx={{ fontSize: "11px" }}>
          {texts.searchLimit}
        </FormHelperText>
      </FormControl>

      <Box sx={{ marginTop: "10px" }}>
        <Grid container sx={{ marginTop: "5px" }} spacing={1}>
          <Grid>
            <StyledTopBarMenuItem
              selected={!searchLocation}
              onClick={() => setSearchLocation(null)}
              sx={{ paddingRight: "9px" }}
            >
              <FormControlLabel
                value="EVERYWHERE"
                control={
                  <Radio
                    name="imageViewOption"
                    checked={!searchLocation}
                    value="EVERYWHERE"
                    sx={{ padding: "4px 9px" }}
                  />
                }
                label={
                  <span style={{ fontSize: "11px" }}>{texts.everywhere}</span>
                }
              />
            </StyledTopBarMenuItem>
          </Grid>
          <Grid>
            <StyledTopBarMenuItem
              selected={Boolean(searchLocation)}
              onClick={() => setSearchLocation("here")}
              sx={{ paddingRight: "9px", fontSize: "11px" }}
            >
              <FormControlLabel
                value="EVERYWHERE"
                control={
                  <Radio
                    sx={{ padding: "4px 9px" }}
                    name="imageViewOption"
                    checked={Boolean(searchLocation)}
                    value="EVERYWHERE"
                  />
                }
                label={
                  <span style={{ fontSize: "11px" }}>
                    {texts.onSelectedFolder}
                  </span>
                }
              />
            </StyledTopBarMenuItem>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(Searching);
