import { styled } from "@mui/material/styles";
import { Box, Checkbox } from "@mui/material";

const ITEM_HEIGHT = 50;

export const StyledGridViewContainer = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  overflowX: "hidden",
  minHeight: 0,
  height: "100%",
}));

export const StyledEmptyFolderContainer = styled(Box)(({}) => ({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  "& h6": {
    fontSize: "25px",
    opacity: "0.2",
  },
}));

export const StyledFileItem = styled(Box)(({ theme }) => ({
  margin: "10px 0px 0px 10px",
  padding: "5px",
  width: "90px",
  position: "relative",
  borderRadius: "5px",
  verticalAlign: "top",
  display: "inline-block",
  height: "90px",
  "&.fileCuted": {
    opacity: "0.5",
  },
  "&.notDragging": {
    transform: "translate(0px, 0px) !important",
  },
  "&:hover": {
    background: `${theme.cronus.fileItems.background.hover} !important`,
    "& .MuiCheckbox-root": {
      display: "block !important",
    },
  },
  "&.selectmode": {
    background: theme.cronus.fileItems.background.selectMode,
    "& .MuiCheckbox-root": {
      display: "block !important",
    },
  },
  "&.selected": {
    background: `${theme.cronus.fileItems.background.selected} !important`,
    "& .MuiCheckbox-root": {
      display: "block !important",
    },
  },
}));

export const StyledPrivateIcon = styled("span")(({}) => ({
  position: "absolute",
  right: "0",
  top: "0",
  borderRadius: "3px",
  fontSize: "12px",
  background: "#ffa600",
  color: "#fff",
  padding: "5px",
}));

export const StyledSelectCheckbox = styled(Checkbox)(({ checked }) => ({
  position: "absolute",
  top: "0px",
  left: "0px",
  padding: "0px",
  display: checked ? "block" : "none",
  background: "#ffffffa9 !important",
  height: "24px",
  borderRadius: "3px",
}));

export const StyledListTable = styled(Box)(({}) => ({
  padding: "0px",
  "& .tableHead": {
    width: "100%",
    display: "flex",
    background: "#0492f2",
    color: "#fff",
    "& div": {
      padding: "10px 0px 10px 0px",
      fontSize: "13px",
      lineHeight: "19px",
      fontWeight: "700",
    },
  },
}));

export const StyledListTableCell = styled(Box)(({}) => ({
  padding: "0px",
  height: `${ITEM_HEIGHT}px`,
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  "& .content-icon": {
    width: "20px",
    height: "20px",
    objectFit: "contain",
    // maxWidth: "50px",
    maxHeight: "30px",
    margin: "0px auto",
    display: "block",
  },
}));

export const StyledListTableRow = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "row",
  height: `${ITEM_HEIGHT}px`,
  alignItems: "center",
  width: "100%",
  borderBottom: "1px solid #ccc",
  "&:hover, &.selectmodeTable": {
    background: "#f1f1f1",
    cursor: "pointer",
  },
  "&.selected": {
    background: "#e0f0fb",
  },
}));

export const StyledItemExtension = styled("span")(({ theme }) => ({
  position: "absolute",
  left: "0",
  top: "42px",
  borderRadius: "3px",
  fontSize: "9px",
  background: theme.cronus.fileItems.extension.background,
  color: theme.cronus.fileItems.extension.color,
  padding: "1px 5px",
}));

export const StyledItemTitle = styled(Box)(({}) => ({
  fontSize: "12px",
  textAlign: "center",
  "& span": {
    textAlign: "center",
    maxHeight: "2.4em",
    lineHeight: "1.2em",
    whiteSpace: "pre-line",
    overflow: "hidden",
    textOverflow: "ellipsis",
    margin: "3px 0px 0",
    padding: "0px",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  },
  "& :hover": {
    background: "",
  },
}));

export const StyledItemInfoBox = styled(Box)(({}) => ({
  width: "100%",
  height: "50px",
  overflow: "hidden",
  borderRadius: "3px",
  "& .content-icon": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    // maxWidth: "50px",
    maxHeight: "48px",
    margin: "0px auto",
    display: "block",
  },
  "& img": {
    minWidth: "50px",
    minHeight: "50px",
    margin: "0px auto",
    display: "block",
    height: "max-content",
    width: "-webkit-fill-available",
    maxWidth: "200%",
  },
}));
