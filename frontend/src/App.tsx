import React from "react";
import FileManager from "./FileManager/index";
import { VolumeListType, VolumeTypes } from "./FileManager/types";

const volumesList: VolumeListType = [
  {
    id: "1",
    type: VolumeTypes.SERVER,
    endpoint: "http://localhost:3131",
    name: "My EC2 server",
  },
  {
    id: "2",
    type: VolumeTypes.S3BUCKET_BACK,
    endpoint: "http://localhost:3131",
    bucket: "cronusfilemanager",
    name: "S3 Server Connection",
  },
  {
    id: "3",
    type: VolumeTypes.S3BUCKET_FRONT,
    bucket: "cronusfilemanager",
    name: "S3 Front Connection",
    region: "us-east-1",
    endpoint: "http://192.168.1.6:9001",
    credentials: {
      accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY!,
      secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY!,
    },
  },
];

const App: React.FC = () => {
  const handleCallBack = (filePath: string) => {
    // eslint-disable-next-line no-console
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
