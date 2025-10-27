import { useMemo } from "react";
import { type FileManagerState, VolumeTypes } from "../types";
import { LocalServerConnection, S3ServerConnection } from "../apiProviders";

export const useApiController = (selectedVolume: FileManagerState["selectedVolume"]) => {
  return useMemo(() => {
    if (!selectedVolume) return null;

    switch (selectedVolume.type) {
      case VolumeTypes.SERVER: {
        return new LocalServerConnection(selectedVolume.endpoint);
      }
      case VolumeTypes.S3BUCKET_BACK: {
        return new S3ServerConnection(selectedVolume.endpoint);
      }

      default:
        return null;
    }
  }, [selectedVolume]);
};

export default useApiController;
