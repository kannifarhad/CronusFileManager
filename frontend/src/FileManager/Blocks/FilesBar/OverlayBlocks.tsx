import React, { memo, FC } from "react";
import DropZoneWrapper from "./DropZoneWrapper";
import FilesLoadingOverlay from "./FilesLoadingOverlay";
import ContextMenu from "./ContextMenu";
import ToasterMessages from "./ToasterMessages";

const OverlayBlocks: FC = () => (
  <>
    <ToasterMessages />
    <FilesLoadingOverlay />
    <DropZoneWrapper />
    <ContextMenu />
  </>
);

export default memo(OverlayBlocks);
