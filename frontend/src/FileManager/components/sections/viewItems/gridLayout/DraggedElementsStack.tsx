import { memo } from "react";
import { Box } from "@mui/material";
import type { Items, ItemsList } from "../../../../types";
import GridItemRender from "./GridItemRender";
import { ITEM_SIZE } from "./GridView";

const getRandomRotation = () => {
  return Math.floor(Math.random() * 30) - 15;
};

const DraggedElementsStack = ({ filesList }: { filesList: Items[] }) => {
  const limitedFilesList: ItemsList = filesList.slice(0, 5);

  return (
    <Box
      style={{
        position: "relative",
        width: `${ITEM_SIZE}px`,
        height: `${ITEM_SIZE}px`,
        opacity: 0.7,
      }}
    >
      {limitedFilesList.map((file, index) => (
        <Box
          key={file.id}
          style={{
            position: "absolute", // Position absolute to layer the items
            transform: `rotate(${limitedFilesList.length === 1 ? 5 : getRandomRotation()}deg)`, // Random rotation
            transition: "transform 0.3s ease", // Smooth transition on hover
            zIndex: index, // Ensures that cards are layered in correct order
            width: `${ITEM_SIZE}px`,
            height: `${ITEM_SIZE}px`,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GridItemRender item={file} />
        </Box>
      ))}
    </Box>
  );
};

export default memo(DraggedElementsStack);
