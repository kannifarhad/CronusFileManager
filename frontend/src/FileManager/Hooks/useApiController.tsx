import { useMemo } from "react";
import { FileManagerState, VolumeTypes } from "../types";
import Ec2ServerConnection from "../Api/Ec2ServerConnection";

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
        return new Ec2ServerConnection(selectedVolume.server);
      }
      case VolumeTypes.S3BUCKET_FRONT: {
        // return new Ec2ServerConnection(selectedVolume.server);
        return null;
      }

      default:
        return null;
    }
  }, [selectedVolume]);

  return connection;
};

export default useApiController;
