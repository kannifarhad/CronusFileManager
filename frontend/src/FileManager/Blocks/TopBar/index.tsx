import React, { memo, useRef, useMemo, useCallback } from "react";
import TopBarButtonGroups from "./TopBarButtonGroups";
import { Grid } from "@mui/material";
import TopBarRightMenus from "./TopBarRightMenus";
import { TopBarWrapper } from "./styled";
import { Button } from "../../types";

interface MenuRef {
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, name: string) => void;
}

const TopBar: React.FC<{
  buttons: Button[][];
}> = ({ buttons }) => {
  const menuListRef = useRef<MenuRef>(null);

  const handleOpenMenu = useCallback(
    (...props: [React.MouseEvent<HTMLElement>, string]) => {
      if (menuListRef.current?.handleOpenMenu) {
        console.log("menuListRef", menuListRef.current.handleOpenMenu);
        menuListRef.current.handleOpenMenu(...props);
      } else {
        console.error("Topbar menu doesn't have handleOpenMenu function");
      }
    },
    [menuListRef]
  );

  const additionalButtons: Button[] = useMemo(
    () => [
      {
        title: "Sorting",
        icon: "icon-settings",
        onClick: (e) => handleOpenMenu(e, "sorting"),
        disabled: false,
      },
      {
        title: "Settings",
        icon: "icon-settings-1",
        onClick: (e) => handleOpenMenu(e, "settings"),
        disabled: false,
      },
    ],
    [handleOpenMenu]
  );

  return (
    <TopBarWrapper container>
      {buttons.map((groups, index) => (
        <Grid item key={index}>
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
