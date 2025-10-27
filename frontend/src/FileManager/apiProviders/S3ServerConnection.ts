import { BaseServerConnection, type GetLinkResponse } from "./BaseServerConnection";
import type { PathParam } from "./types";

export class S3ServerConnection extends BaseServerConnection {
  constructor(baseURL: string) {
    super(baseURL, "s3");
  }

  getThumb(filePath: string): string {
    // S3: use thumb endpoint to get presigned URL
    return `${this.baseURL}/fm/thumb/${filePath}`;
  }

  async downloadFile({ path }: PathParam): Promise<void> {
    try {
      // S3: get presigned URL from backend
      const response = await this.axiosInstance.post<GetLinkResponse>("getlink", { path });
      const link = response.data?.link || response.data?.path;

      if (link) {
        setTimeout(() => {
          window.open(link);
        }, 100);
      } else {
        throw new Error("Failed to get download link");
      }
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  }
}
