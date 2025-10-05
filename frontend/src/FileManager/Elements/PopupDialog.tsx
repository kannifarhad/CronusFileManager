import React, { useState, type ForwardRefRenderFunction, memo, useMemo } from "react";
import { Box, DialogActions, DialogContent, DialogTitle, Zoom, type ZoomProps } from "@mui/material";
import InputField from "./InputField";
import { StyledPopUpDialog } from "./styled";
import { useFileManagerState } from "../ContextStore/FileManagerContext";
import { type PopupData } from "../types";
import CustomButtonGroup from "./ButtonGroup";

const Transition: ForwardRefRenderFunction<unknown, ZoomProps> = (props, ref) => <Zoom ref={ref} {...props} />;

const AlertDialog: React.FC<PopupData> = ({ title, description, nameInputSets, actionButtons }) => {
  const [renameText, setRenameText] = useState<string>(nameInputSets?.value ?? "");

  const ActionButtonsList = useMemo(() => {
    if (!Array.isArray(actionButtons) || actionButtons.length === 0) return null;
    if (renameText) {
      return (
        <CustomButtonGroup
          buttons={actionButtons.map((button) => ({
            ...button,
            onClick: () => button.onClick(renameText),
          }))}
        />
      );
    }
    return <CustomButtonGroup buttons={actionButtons} />;
  }, [renameText, actionButtons]);

  return (
    <>
      <DialogTitle className="dialogTitle">{title}</DialogTitle>

      <DialogContent>
        {description && (
          <Box className="dialogDescription">
            <div>{description}</div>
          </Box>
        )}
        {nameInputSets && (
          <div className="form-group">
            <InputField
              sx={{
                marginTop: "20px",
              }}
              type="text"
              label={nameInputSets.label}
              onChange={setRenameText}
              value={renameText}
              variant="outlined"
            />
          </div>
        )}
      </DialogContent>

      <DialogActions className="dialogButtons">{ActionButtonsList}</DialogActions>
    </>
  );
};

const AlertDialogSlide: React.FC<{}> = () => {
  const { popUpData } = useFileManagerState();
  if (!popUpData) return null;

  return (
    <StyledPopUpDialog
      open={Boolean(popUpData)}
      TransitionComponent={React.forwardRef(Transition)}
      keepMounted
      // onClose={popUpData.handleClose}
      className="dialogBlock"
    >
      <AlertDialog {...popUpData} />
    </StyledPopUpDialog>
  );
};

export default memo(AlertDialogSlide);
