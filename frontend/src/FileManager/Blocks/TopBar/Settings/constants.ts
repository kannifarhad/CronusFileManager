import { ImagesThumbTypeEnum, OrderByFieldEnum, SortByFieldEnum } from "../../../types";

// eslint-disable-next-line no-shadow
export enum SettingsMenuEnum {
  SETTINGS = "SETTINGS",
  SEARCH = "SEARCH",
  SORTING = "SORTING",
}

export const orderOptions = [
  { name: "By Name", value: OrderByFieldEnum.NAME },
  { name: "By Size", value: OrderByFieldEnum.SIZE },
  { name: "By Create Date", value: OrderByFieldEnum.DATE },
];

export const sortOptions = [
  { name: "Ascending", value: SortByFieldEnum.ASC },
  { name: "Descending", value: SortByFieldEnum.DESC },
];

export const imageViewOptions = [
  { name: "Show Icons", value: ImagesThumbTypeEnum.ICONS },
  { name: "Show Thumbs", value: ImagesThumbTypeEnum.THUMB },
];

export interface SettingsPopoverMenuProps {
  anchorEl: HTMLElement | null;
  open: SettingsMenuEnum;
  onClose: () => void;
}
