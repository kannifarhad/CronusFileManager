import React, { memo, FC } from "react";
import InfoBoxes from "../../Elements/InfoBoxes";
import { StyledToasterMessages } from "./styled";
import { useFileManagerState } from "../../ContextStore/FileManagerContext";
import { Message } from "../../types";

const ToasterMessages: FC = () => {
  const { messages } = useFileManagerState();

  return (
    <StyledToasterMessages>
      {messages.map((alert: Message) => (
        <InfoBoxes key={alert.id} alert={alert} />
      ))}
    </StyledToasterMessages>
  );
};

export default memo(ToasterMessages);
