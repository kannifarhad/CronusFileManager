import { memo, useCallback } from "react";
import { StyledSelectCheckbox, StyledPrivateIcon } from "../styled";
import { useFileManagerState } from "../../../ContextStore/FileManagerContext";
import { type Items } from "../../../types";
import { wasMultiSelectKeyUsed } from "../../../helpers";

function ItemSelectButton({ item }: { item: Items }) {
  const {
    operations: { handleAddSelected },
    selectedFiles,
  } = useFileManagerState();
  const isSelected = selectedFiles?.has(item);

  // Using onClick as it will be correctly
  // preventing if there was a drag
  const handleClick = useCallback(
    (event: any) => {
      if (event.defaultPrevented) {
        return;
      }
      // marking the event as used
      event.preventDefault();
      handleAddSelected(item, wasMultiSelectKeyUsed(event));
    },
    [item, handleAddSelected]
  );

  if (item.private) return <StyledPrivateIcon className="icon-lock" />;

  return <StyledSelectCheckbox checked={isSelected} onChange={handleClick} onClick={handleClick} value={item.id} />;
}

export default memo(ItemSelectButton);
