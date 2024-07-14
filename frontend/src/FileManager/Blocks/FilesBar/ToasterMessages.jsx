import { memo } from "react";
import InfoBoxes from "../../Elements/InfoBoxes";
import { StyledToasterMessages} from './styled';
import {
  useFileManagerState,
} from "../../ContextStore/FileManagerContext";

const ToasterMessages = ()=> {
  const { messages }  = useFileManagerState();
  return (
      <StyledToasterMessages>
        {messages.map((alert) => (
          <InfoBoxes key={alert.id} alert={alert} />
        ))}
      </StyledToasterMessages>
  );
}


export default memo(ToasterMessages);
