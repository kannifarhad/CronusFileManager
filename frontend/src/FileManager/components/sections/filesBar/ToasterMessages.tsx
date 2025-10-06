import { memo, type FC } from "react";
import InfoBoxes from "../../elements/InfoBoxes";
import { StyledToasterMessages } from "./styled";
import { useFileManagerState } from "../../../store/FileManagerContext";
import type { Message } from "../../../types";

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
