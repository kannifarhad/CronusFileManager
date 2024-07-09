import React, { memo } from "react";
import DropZoneWrapper from "./DropZoneWrapper";
import FilesLoadingOverlay from "./FilesLoadingOverlay";
import ContextMenu from "./ContextMenu";
import ToasterMessages from "./ToasterMessages";

function OverlayBlocks() {

  return (
    <>
      <ToasterMessages />
      <FilesLoadingOverlay />
      <DropZoneWrapper />
      <ContextMenu />
    </>
  );
}

export default memo(OverlayBlocks);
