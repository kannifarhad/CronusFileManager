import React, { useState } from "react";
import { ListItemText, Collapse, ListItemIcon, ListItemSecondaryAction, Chip, useTheme } from "@mui/material";
import { type DroppedFile, type DroppedFolder, type DroppedFilesTree, getFileIcon, formatBytes } from "../../utils/helpers";
import { ItemType } from "../../types";
import { StyledButton, StyledDropZoneFileList, StyledDropZoneFileListItem } from "./styled";
import Icon from "./Icon";
import ContentIcons from "./ContentIcons";

interface FileTreeProps {
  tree: DroppedFilesTree;
  onRemove: (index: number) => void;
  onRemoveFolder: (path: string) => void;
}

// Component to render file nodes
const FileNode: React.FC<{
  file: DroppedFile;
  onRemove: FileTreeProps["onRemove"];
}> = ({ file, onRemove }) => {
  return (
    <StyledDropZoneFileListItem>
      <ListItemIcon style={{ minWidth: "30px" }}>
        <ContentIcons name={getFileIcon(`.${file?.name?.match(/\.([^.]+)$/)?.[1]}`)} />
      </ListItemIcon>
      <ListItemText
        primary={
          <span>
            {file.name}
            {file.size && (
              <Chip
                label={formatBytes(file.size)}
                size="small"
                variant="outlined"
                style={{
                  marginLeft: "10px",
                  lineHeight: "15px",
                  height: "auto",
                  fontSize: "11px",
                }}
              />
            )}{" "}
          </span>
        }
      />
      <ListItemSecondaryAction>
        <StyledButton
          style={{
            padding: "5px",
            width: "30px",
            minWidth: "auto",
            background: "#f00",
            cursor: "pointer",
          }}
          onClick={() => onRemove(file.index)}
          aria-haspopup="true"
        >
          <Icon name="Trash" color="#fff" size={12} />
        </StyledButton>
      </ListItemSecondaryAction>
    </StyledDropZoneFileListItem>
  );
};
// Component to render folder nodes with collapsibility
const FolderNode: React.FC<{
  folder: DroppedFolder;
  onRemove: FileTreeProps["onRemoveFolder"];
  onFileRemove: FileTreeProps["onRemove"];
}> = ({ folder, onRemove, onFileRemove }) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyledDropZoneFileListItem onClick={handleToggle} style={{ cursor: "pointer" }}>
        <ListItemIcon style={{ minWidth: "30px" }}>
          <ContentIcons name={open ? "folderopen" : "folder"} size={20} />
        </ListItemIcon>
        <ListItemText primary={folder.name} />
        <ListItemSecondaryAction>
          <StyledButton
            style={{
              padding: "5px",
              width: "30px",
              minWidth: "auto",
              background: "#f00",
              cursor: "pointer",
            }}
            onClick={() => onRemove(folder.name)}
            aria-haspopup="true"
          >
            <Icon name="Trash" color="#fff" size={12} />
          </StyledButton>
        </ListItemSecondaryAction>
      </StyledDropZoneFileListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <StyledDropZoneFileList disablePadding style={{ marginLeft: "10px" }}>
          {folder.children.map((node) => {
            if (node.type === ItemType.FOLDER) {
              return <FolderNode key={node.name} folder={node} onRemove={onRemove} onFileRemove={onFileRemove} />;
            }
            return <FileNode key={node.name} file={node} onRemove={onFileRemove} />;
          })}
        </StyledDropZoneFileList>
      </Collapse>
    </>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ tree, onRemove, onRemoveFolder }) => {
  const theme = useTheme();
  const renderTree = (nodes: DroppedFilesTree) => {
    return nodes.map((node) => {
      if (node.type === ItemType.FOLDER) {
        return <FolderNode key={node.name} folder={node} onRemove={onRemoveFolder} onFileRemove={onRemove} />;
      }
      return <FileNode key={node.name} file={node} onRemove={onRemove} />;
    });
  };

  return (
    <StyledDropZoneFileList
      style={{
        borderRadius: "5px",
        border: `1px solid ${theme.cronus.dropzone.borderColor}`,
      }}
    >
      {renderTree(tree)}
    </StyledDropZoneFileList>
  );
};

export default FileTree;
