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
import Icon from "../../elements/Icon";
import { StyledTopBarMenuItem } from "./styled";
import { useFileManagerState } from "../../../store/FileManagerContext";
import useText from "../../../utils/hooks/useTexts";

const Searching = () => {
  const [name, setName] = React.useState("");
  const [searchEveryWhere, setSearchEveryWhere] = useState<boolean>(true);
  const {
    selectedFolder,
    operations: { handleSearchItems },
  } = useFileManagerState();
  const texts = useText();

  const handleSearch = () => {
    const path = searchEveryWhere ? undefined : selectedFolder?.path;
    if (name.length > 2) {
      handleSearchItems(name, path);
    }
  };
  const disabled = !(name.length > 2);

  return (
    <Box sx={{ marginTop: "10px" }}>
      <FormControl sx={{ fontSize: "14px" }} fullWidth variant="outlined" size="small">
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
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={handleSearch}>
              <Icon name="Search" color={disabled ? "#ccc" : "#556cd6"} size={14} />
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
              selected={searchEveryWhere}
              onClick={() => {
                setSearchEveryWhere(true);
                handleSearch();
              }}
              sx={{ paddingRight: "9px" }}
            >
              <FormControlLabel
                checked={searchEveryWhere}
                control={<Radio name={texts.everywhere} sx={{ padding: "4px 9px" }} />}
                label={<span style={{ fontSize: "11px" }}>{texts.everywhere}</span>}
              />
            </StyledTopBarMenuItem>
          </Grid>
          <Grid>
            <StyledTopBarMenuItem
              selected={!searchEveryWhere}
              onClick={() => {
                setSearchEveryWhere(false);
                handleSearch();
              }}
              sx={{ paddingRight: "9px", fontSize: "11px" }}
            >
              <FormControlLabel
                checked={!searchEveryWhere}
                control={<Radio sx={{ padding: "4px 9px" }} name={texts.onSelectedFolder} />}
                label={<span style={{ fontSize: "11px" }}>{texts.onSelectedFolder}</span>}
              />
            </StyledTopBarMenuItem>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(Searching);
