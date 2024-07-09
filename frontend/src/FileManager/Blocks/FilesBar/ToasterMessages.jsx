import React, { memo, } from "react";
import InfoBoxes from "../../Elements/InfoBoxes";
import { StyledToasterMessages} from './styled';

const ToasterMessages = ()=> {
  const messages =[];
  return (
      <StyledToasterMessages>
        {messages.map((alert, index) => (
          <InfoBoxes key={index} alert={alert} />
        ))}
      </StyledToasterMessages>
  );
}


export default memo(ToasterMessages);
