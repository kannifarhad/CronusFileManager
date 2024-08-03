import React from "react";
import FileManager from "./FileManager/index";

const App: React.FC = () => {
  const handleCallBack = (filePath: string) => {
    console.log("Image Path Returned", filePath);
  };

  return <FileManager height={580} selectItemCallback={handleCallBack} />;
};

export default App;
