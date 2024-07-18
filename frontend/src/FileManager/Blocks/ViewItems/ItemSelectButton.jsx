import React, { memo } from "react";
import {StyledSelectCheckbox, StyledPrivateIcon} from './styled';
import { useFileManagerState } from "../../ContextStore/FileManagerContext";

const ItemSelectButton = ({ item }) => {
  const { operations:{ handleAddSelected }, selectedFiles }  = useFileManagerState();
  
  if(item.private) return <StyledPrivateIcon className='icon-lock' />
  const isSelected = selectedFiles?.has(item);
  return (
    <StyledSelectCheckbox
      checked={isSelected}
      onChange={() => handleAddSelected(item)}
      value={item.id}
    />
  );
};

export default memo(ItemSelectButton);
