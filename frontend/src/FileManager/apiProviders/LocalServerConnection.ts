import { BaseServerConnection } from "./BaseServerConnection";
import type { PathParam } from "./types";

export class LocalServerConnection extends BaseServerConnection {
  constructor(baseURL: string) {
    super(baseURL, "local");
  }

  getThumb(filePath: string): string {
    // Local storage: direct file path
    return `${this.baseURL}${filePath}`;
  }

  async downloadFile({ path }: PathParam): Promise<void> {
    // Local storage: direct download
    setTimeout(() => {
      window.open(`${this.baseURL}${path}`);
    }, 100);
  }
}
