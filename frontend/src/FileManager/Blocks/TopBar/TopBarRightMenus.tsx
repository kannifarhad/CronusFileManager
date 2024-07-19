import React, { memo, forwardRef, useImperativeHandle } from "react";
import { Menu, Radio, Divider, FormControlLabel } from "@mui/material";
import { StyledTopBarMenuItem } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { ImagesThumbTypeEnum } from "../../types";

interface MenuRef {
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, name: string) => void;
}

const options = [
  {
    name: "By Name",
    value: "name",
  },
  {
    name: "By Size",
    value: "size",
  },
  {
    name: "By Create Date",
    value: "date",
  },
];

const TopBarRightMenus = forwardRef<MenuRef, any>((_, ref) => {
  const {
    orderFiles,
    setSorting,
    filterSorting,
    setImagesSettings,
  } = {
    orderFiles: { field: "", orderBy: "" },
    setSorting: () => {},
    filterSorting: () => {},
    setImagesSettings: () => {},
  };

  const { itemsViewType, showImages, operations:{} } = useFileManagerState();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState({
    sorting: false,
    search: false,
    settings: false,
  });

  useImperativeHandle(ref, () => ({
    handleOpenMenu: (event, name) => {
      console.log("asdasdasd");
      switch (name) {
        case "sorting":
          setOpen({
            sorting: true,
            search: false,
            settings: false,
          });
          break;
        case "search":
          setOpen({
            sorting: false,
            search: true,
            settings: false,
          });
          break;
        case "settings":
          setOpen({
            sorting: false,
            search: false,
            settings: true,
          });
          break;
        default:
          break;
      }
      setAnchorEl(event.currentTarget);
    },
  }));

  const handleSetOrderBy = (orderBy: string) => {
    // setSorting(orderBy, orderFiles.field);
    filterSorting();
  };

  const handleSetOrderField = (field: string) => {
    // setSorting(orderFiles.orderBy, field);
    filterSorting();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen({ sorting: false, search: false, settings: false });
  };

  const handleSetSettings = (imagePreview: string) => {
    // setImagesSettings(imagePreview);
  };

  return (
    <>
      <Menu
        id="sorting-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(open.sorting)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <StyledTopBarMenuItem
            key={index}
            selected={option.value === orderFiles?.field}
          >
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  name="orderField"
                  checked={option.value === orderFiles?.field}
                  onChange={() => handleSetOrderField(option.value)}
                  value={option.value}
                />
              }
              label={option.name}
            />
          </StyledTopBarMenuItem>
        ))}
        <Divider />
        <StyledTopBarMenuItem selected={"asc" === orderFiles?.orderBy}>
          <FormControlLabel
            control={
              <Radio
                name="orderby"
                checked={"asc" === orderFiles?.orderBy}
                onChange={() => handleSetOrderBy("asc")}
                value="asc"
              />
            }
            label="Ascending"
          />
        </StyledTopBarMenuItem>
        <StyledTopBarMenuItem selected={"desc" === orderFiles?.orderBy}>
          <FormControlLabel
            control={
              <Radio
                name="orderby"
                checked={"desc" === orderFiles?.orderBy}
                onChange={() => handleSetOrderBy("desc")}
                value="desc"
              />
            }
            label="Descending"
          />
        </StyledTopBarMenuItem>
      </Menu>

      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(open.settings)}
        onClose={handleClose}
      >
        <StyledTopBarMenuItem selected={showImages === ImagesThumbTypeEnum.THUMB}>
          <FormControlLabel
            control={
              <Radio
                name="imageSettings"
                checked={showImages === ImagesThumbTypeEnum.THUMB}
                onChange={() => {
                  handleSetSettings(ImagesThumbTypeEnum.THUMB);
                }}
                value={ImagesThumbTypeEnum.THUMB}
              />
            }
            label="Show Thumbs"
          />
        </StyledTopBarMenuItem>
        <StyledTopBarMenuItem selected={showImages === ImagesThumbTypeEnum.ICONS}>
          <FormControlLabel
            control={
              <Radio
                name="imageSettings"
                checked={showImages === ImagesThumbTypeEnum.ICONS}
                onChange={() => {
                  handleSetSettings(ImagesThumbTypeEnum.ICONS);
                }}
                value={ImagesThumbTypeEnum.ICONS}
              />
            }
            label="Show Icons"
          />
        </StyledTopBarMenuItem>
      </Menu>
    </>
  );
});

export default memo(TopBarRightMenus);
