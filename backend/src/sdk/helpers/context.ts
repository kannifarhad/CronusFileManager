import { AsyncLocalStorage } from "async_hooks";
import { RequestContext, StorageProvider } from "../types";

export class AsyncContext {
  private static storage = new AsyncLocalStorage<RequestContext>();

  static run<T>(context: RequestContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  static getStorageProvider(): StorageProvider | undefined {
    return this.storage.getStore()?.storageProvider;
  }
}
