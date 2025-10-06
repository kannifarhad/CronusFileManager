import React from "react";
import FileManager from "./FileManager/index";
import { type VolumeListType, VolumeTypes } from "./FileManager/types";

const volumesList: VolumeListType = [
  {
    id: "1",
    type: VolumeTypes.SERVER,
    endpoint: import.meta.env.VITE_BACKEND_URL!,
    name: "My EC2 server",
  },
  {
    id: "2",
    type: VolumeTypes.S3BUCKET_BACK,
    endpoint: import.meta.env.VITE_BACKEND_URL!,
    bucket: "cronusfilemanager",
    name: "S3 Server Connection",
  },
  {
    id: "3",
    type: VolumeTypes.S3BUCKET_FRONT,
    bucket: "cronusfilemanager",
    name: "S3 Front Connection",
    region: "us-east-1",
    endpoint: "http://192.168.1.18:9001",
    credentials: {
      accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY!,
      secretAccessKey: import.meta.env.REACT_APP_S3_SECRET_KEY!,
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
