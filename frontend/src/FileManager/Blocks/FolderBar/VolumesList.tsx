import React, { FC, useEffect, memo } from "react";
import { Box, List } from "@mui/material";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import Icon from "../../Elements/Icon";
import { StyledVolumeMenuItem } from "./styled";
import MenuItem from "./MenuItem";

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
  return (
    <List style={{ padding: "0px" }}>
      {Array.isArray(volumesList) &&
        volumesList.map((volume) => (
          <StyledVolumeMenuItem key={volume.name}>
            <Box
              className="volumeTitleWrapper"
              onClick={() => handleSelectVolume(volume)}
            >
              <Icon name="Volume" color="#556cd6" />
              {volume.name}
            </Box>
            <Box className="volumeFolderTreeWrapper">
              {selectedVolume?.name === volume.name && <FolderTree />}
            </Box>
          </StyledVolumeMenuItem>
        ))}
    </List>
  );
};

export default memo(VolumesList);
