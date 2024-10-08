import { useMemo } from "react";
import { FileManagerState, VolumeTypes } from "../types";
import Ec2ServerConnection from "../Api/Ec2ServerConnection";
import S3FrontConnection from "../Api/S3FrontConnection";
import S3ServerConnection from "../Api/S3ServerConnection";

export const useApiController = (
  selectedVolume: FileManagerState["selectedVolume"]
) => {
  const connection = useMemo(() => {
    if (!selectedVolume) return null;

    switch (selectedVolume.type) {
      case VolumeTypes.SERVER: {
        return new Ec2ServerConnection(selectedVolume.server);
      }
      case VolumeTypes.S3BUCKET_BACK: {
        return new S3ServerConnection(
          selectedVolume.server,
          selectedVolume.bucket
        );
      }
      case VolumeTypes.S3BUCKET_FRONT: {
        return new S3FrontConnection(selectedVolume);
      }

      default:
        return null;
    }
  }, [selectedVolume]);
  console.log("connection", connection);
  return connection;
};

export default useApiController;
