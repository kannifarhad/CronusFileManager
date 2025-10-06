import { type FC, useEffect, memo } from "react";
import { Box, List, useTheme } from "@mui/material";
import { useFileManagerState } from "../../../store/FileManagerContext";
import Icon from "../../elements/Icon";
import { StyledVolumeMenuItem } from "./styled";
import MenuItem from "./MenuItem";
import { classNames } from "../../../helpers";

const FolderTree = () => {
  const {
    foldersList,
    operations: { handleInitFileManagerData },
  } = useFileManagerState();

  useEffect(() => {
    handleInitFileManagerData();
  }, [handleInitFileManagerData]);

  return <MenuItem item={foldersList} />;
};

interface VolumesListProps {}

const VolumesList: FC<VolumesListProps> = () => {
  const {
    volumesList,
    operations: { handleSelectVolume },
    selectedVolume,
  } = useFileManagerState();
  const theme = useTheme();
  return (
    <List style={{ padding: "0px" }}>
      {Array.isArray(volumesList) &&
        volumesList.map((volume) => (
          <StyledVolumeMenuItem
            key={volume.name}
            className={classNames({
              isActive: selectedVolume?.name === volume.name,
            })}
          >
            <Box className="volumeTitleWrapper" onClick={() => handleSelectVolume(volume)}>
              <Icon
                name="Volume"
                color={theme.cronus.folderBar.volumeIconBack}
                size={18}
                style={{ margin: "0px 10px 0px 5px" }}
              />
              {volume.name}
            </Box>
            <List className="volumeFolderTreeWrapper">{selectedVolume?.name === volume.name && <FolderTree />}</List>
          </StyledVolumeMenuItem>
        ))}
    </List>
  );
};

export default memo(VolumesList);
