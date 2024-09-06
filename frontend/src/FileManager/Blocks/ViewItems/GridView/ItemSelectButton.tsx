import React, { memo } from "react";
import { StyledSelectCheckbox, StyledPrivateIcon } from "../styled";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import { Items } from "../../../types";

function ItemSelectButton({ item }: { item: Items }) {
  const {
    operations: { handleAddSelected },
    selectedFiles,
  } = useFileManagerState();
  const isSelected = selectedFiles?.has(item);
  if (item.private) return <StyledPrivateIcon className="icon-lock" />;

  return (
    <StyledSelectCheckbox
      checked={isSelected}
      onChange={() => handleAddSelected(item)}
      value={item.id}
    />
  );
}

export default memo(ItemSelectButton);
