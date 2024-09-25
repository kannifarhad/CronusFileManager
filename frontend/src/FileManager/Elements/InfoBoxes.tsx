import React, { useEffect, useRef, memo, useState } from "react";
import {
  AlertTitle,
  IconButton,
  Collapse,
  LinearProgress,
} from "@mui/material";
import { Message, ActionTypes } from "../types";
import { StyledInfoBox } from "./styled";
import { useFileManagerDispatch } from "../ContextStore/FileManagerContext";
import Icon from "./Icon";

interface InfoBoxesProps {
  alert: Message;
}

const InfoBoxes: React.FC<InfoBoxesProps> = ({ alert }) => {
  const dispatch = useFileManagerDispatch();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (alert.timer) {
      closeTimer.current = setTimeout(() => {
        setOpen(false);
        dispatch({
          type: ActionTypes.REMOVE_MESSAGES,
          payload: { id: alert.id },
        });
      }, alert.timer);
    }
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current); // Cleanup the timer on unmount or when alert changes
      }
    };
  }, [alert, dispatch]);

  return (
    <Collapse in={open}>
      <>
        <StyledInfoBox
          key={alert.id}
          severity={alert.type}
          action={
            !alert.disableClose && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                  dispatch({
                    type: ActionTypes.REMOVE_MESSAGES,
                    payload: { id: alert.id },
                  });
                  if (closeTimer.current) {
                    clearTimeout(closeTimer.current); // Cleanup the timer on unmount or when alert changes
                  }
                }}
              >
                <Icon name="Cancel" />
              </IconButton>
            )
          }
        >
          <AlertTitle className="fmInfoBoxtitle">{alert.title}</AlertTitle>
          <p className="fmInfoBoxmessage">{alert.message}</p>
        </StyledInfoBox>
        {alert.progress && <LinearProgress className="fmInfoBoxprogress" />}
      </>
    </Collapse>
  );
};

export default memo(InfoBoxes);
