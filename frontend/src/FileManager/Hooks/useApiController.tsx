import { useMemo } from "react";
import { type FileManagerState, VolumeTypes } from "../types";
import Ec2ServerConnection from "../api/Ec2ServerConnection";
import S3FrontConnection from "../api/S3FrontConnection";
import S3ServerConnection from "../api/S3ServerConnection";

export const useApiController = (
  selectedVolume: FileManagerState["selectedVolume"]
) => {
  const connection = useMemo(() => {
    if (!selectedVolume) return null;

    switch (selectedVolume.type) {
      case VolumeTypes.SERVER: {
        return new Ec2ServerConnection(selectedVolume.endpoint);
      }
      case VolumeTypes.S3BUCKET_BACK: {
        return new S3ServerConnection(
          selectedVolume.endpoint,
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
  return connection;
};

export default useApiController;
