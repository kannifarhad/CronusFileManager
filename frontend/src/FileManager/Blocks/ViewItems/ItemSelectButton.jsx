import React, { memo } from "react";
import {StyledSelectCheckbox, StyledPrivateIcon} from './styled';

const ItemSelectButton = ({ item }) => {
  const selectedFiles = [];
  const addSelect = ()=>{

  }
   const checkIsSelected = (item) => {
    return selectedFiles.includes(item);
  };
  let isSelected = checkIsSelected(item);

  if(item.private) return <StyledPrivateIcon className='icon-lock' />

  return (
    <StyledSelectCheckbox
      checked={isSelected}
      onChange={() => addSelect(item)}
      value={item.id}
    />
  );
};

export default memo(ItemSelectButton);
