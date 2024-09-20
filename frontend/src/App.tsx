import React from "react";
import FileManager from "./FileManager/index";
import { VolumeListType, VolumeTypes } from "./FileManager/types";

const volumesList: VolumeListType = [
  {
    id: "1",
    type: VolumeTypes.SERVER,
    server: "http://localhost:3131/fm",
    name: "My EC2 server",
  },
  {
    id: "2",
    type: VolumeTypes.S3BUCKET_BACK,
    server: "http://localhost:3131",
    bucket: "Documents",
    name: "S3 Server",
  },
  {
    id: "3",
    type: VolumeTypes.S3BUCKET_FRONT,
    bucket: "Documents",
    name: "S3 Front",
    region: "",
    endpoint: "",
    credentials: {
      secretAccessKey: "",
      accessKeyId: "",
    },
  },
];

const App: React.FC = () => {
  const handleCallBack = (filePath: string) => {
    console.log("Image Path Returned", filePath);
  };

  return (
    <FileManager
      height={580}
      selectItemCallback={handleCallBack}
      volumesList={volumesList}
    />
  );
};

export default App;
