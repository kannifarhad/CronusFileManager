import React from "react";
import FileManager from "./FileManager/index";
import { type VolumeListType, VolumeTypes } from "./FileManager/types";

const volumesList: VolumeListType = [
  {
    id: "1",
    type: VolumeTypes.SERVER,
    endpoint: import.meta.env.VITE_BACKEND_URL!,
    name: "My EC2 Storage",
  },
  {
    id: "2",
    type: VolumeTypes.S3BUCKET_BACK,
    endpoint: import.meta.env.VITE_BACKEND_URL!,
    name: "S3 Bucket Storage",
  },
];

const App: React.FC = () => {
  const handleCallBack = (filePath: string) => {
    console.log("Image Path Returned", filePath);
  };

  return <FileManager height={580} selectItemCallback={handleCallBack} volumesList={volumesList} />;
};

export default App;
