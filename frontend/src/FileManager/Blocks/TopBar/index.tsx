import React, { memo, useRef, useMemo, useCallback } from "react";
import { Grid2 as Grid } from "@mui/material";
import TopBarButtonGroups from "./TopBarButtonGroups";
import TopBarRightMenus from "./TopBarRightMenus";
import { SettingsMenuEnum } from "./Settings/constants";
import { TopBarWrapper } from "./styled";
import { Button } from "../../types";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import useGenerateActionButtons from "../../Hooks/useGenerateActionButtons";

interface MenuRef {
  handleOpenMenu: (
    event: React.MouseEvent<HTMLElement>,
    name: SettingsMenuEnum
  ) => void;
}

const TopBar: React.FC<{}> = () => {
  const menuListRef = useRef<MenuRef>(null);
  const state = useFileManagerState();
  const { topbar } = useGenerateActionButtons({ state });

  const handleOpenMenu = useCallback(
    (...props: [React.MouseEvent<HTMLElement>, SettingsMenuEnum]) => {
      if (menuListRef.current?.handleOpenMenu) {
        menuListRef.current.handleOpenMenu(...props);
      }
    },
    [menuListRef]
  );

  const additionalButtons: Button[] = useMemo(
    () => [
      {
        title: "Search",
        icon: "Search",
        onClick: (e) => handleOpenMenu(e, SettingsMenuEnum.SEARCH),
        disabled: !state.selectedVolume,
      },
      {
        title: "Settings",
        icon: "settings",
        onClick: (e) => handleOpenMenu(e, SettingsMenuEnum.SETTINGS),
        disabled: false,
      },
    ],
    [handleOpenMenu, state.selectedVolume]
  );

  return (
    <TopBarWrapper container>
      {topbar.map((groups, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid key={index}>
          <TopBarButtonGroups buttons={groups} />
        </Grid>
      ))}
      <Grid style={{ marginLeft: "auto" }}>
        <TopBarButtonGroups buttons={additionalButtons} />
        <TopBarRightMenus ref={menuListRef} />
      </Grid>
    </TopBarWrapper>
  );
};

export default memo(TopBar);
