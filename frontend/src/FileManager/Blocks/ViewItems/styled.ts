import { styled } from "@mui/system";
import { Box, Checkbox, Table, TableCell } from "@mui/material";

export const StyledGridViewContainer = styled(Box)(({}) => ({
  flex: 1,
  display: "flex",
  overflow: "auto",
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

export const StyledFileItem = styled(Box)(({}) => ({
  margin: "5px",
  padding: "10px",
  width: "100px",
  position: "relative",
  borderRadius: "5px",
  verticalAlign: "top",
  display: "inline-block",
  height: "100px",
  "&.fileCuted": {
    opacity: "0.5",
  },
  "&.notDragging": {
    transform: "translate(0px, 0px) !important",
  },
  "&:hover, &.selectmode": {
    background: "#f1f1f1",
    "& .MuiCheckbox-root": {
      display: "block !important",
    },
  },
  "&.selected": {
    background: "#e0f0fb",
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

export const StyledSelectCheckbox = styled(Checkbox)(({ theme, checked }) => ({
  position: "absolute",
  top: "0px",
  left: "0px",
  padding: "0px",
  display: checked ? "block" : "none",
}));

export const StyledListTable = styled(Table)(({}) => ({
  padding: "0px",

  "& .tableCell": {
    padding: "0px",
  },
  "& .tableListRow": {
    "&:hover td, &.selectmodeTable td": {
      background: "#f1f1f1",
    },
    "&.selected td": {
      background: "#e0f0fb",
    },
  },
  "& .tableHead": {
    "& th": {
      background: "#0492f2",
      color: "#fff",
      padding: "10px 0px 10px 0px",
      fontSize: "13px",
      lineHeight: "19px",
      fontWeight: "700",
    },
    "& th:first-child": {
      borderRadius: "5px 0px 0px 0px",
    },
    "& th:last-child": {
      borderRadius: "0px 5px 0px 0px",
    },
  },
}));

export const StyledListTableCell = styled(TableCell)(({}) => ({
  padding: "0px",
}));

export const StyledItemExtension = styled("span")(({}) => ({
  position: "absolute",
  left: "0",
  top: "45px",
  borderRadius: "3px",
  fontSize: "9px",
  background: "#ccc",
  color: "#fff",
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
    margin: "3px 1px 0",
    padding: "1px",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    display: "-webkit-box",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
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
  "& img": {
    minWidth: "100%",
    maxHeight: "50px",
    margin: "0px auto",
    display: "block",
  },
}));
