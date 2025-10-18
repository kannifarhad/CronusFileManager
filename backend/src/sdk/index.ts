import FileManagerSDKBase from "./FileManagerSDKBase";
import { AsyncContext } from "./helpers/context";
import LocalFileManagerSDK from "./LocalFileManagerSDK";
import S3BucketFileManagerSDK from "./S3BucketFileManagerSDK";
import { FileManagerFactoryConfig, StorageProvider } from "./types";

export class FileManagerFactory {
  private providers: Map<StorageProvider, FileManagerSDKBase> = new Map();
  private defaultProvider: StorageProvider;

  constructor(config: FileManagerFactoryConfig) {
    this.defaultProvider = config.defaultProvider;
    this.initializeProviders(config.providers);
  }

  private initializeProviders(providersConfig: FileManagerFactoryConfig["providers"]): void {
    // Initialize Local provider
    if (providersConfig[StorageProvider.LOCAL]) {
      const localSDK = new LocalFileManagerSDK(providersConfig[StorageProvider.LOCAL]);
      this.providers.set(StorageProvider.LOCAL, localSDK);
    }

    // Initialize S3 provider
    if (providersConfig[StorageProvider.S3]) {
      const s3SDK = new S3BucketFileManagerSDK(providersConfig[StorageProvider.S3]);
      this.providers.set(StorageProvider.S3, s3SDK);
    }
  }

  getProvider(provider?: StorageProvider): FileManagerSDKBase {
    const targetProvider = provider || this.defaultProvider;
    const sdk = this.providers.get(targetProvider);

    if (!sdk) {
      throw new Error(`Storage provider '${targetProvider}' is not configured`);
    }

    return sdk;
  }

  resolveProvider(): FileManagerSDKBase {
    const contextProvider = AsyncContext.getStorageProvider();
    return this.getProvider(contextProvider);
  }

  hasProvider(provider: StorageProvider): boolean {
    return this.providers.has(provider);
  }

  getAvailableProviders(): StorageProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Creates a Proxy that auto-resolves provider on each method call
   * Returns a type-safe proxy that looks like FileManagerSDKBase
   */
  createProxy(): FileManagerSDKBase {
    const self = this;

    return new Proxy({} as FileManagerSDKBase, {
      get(target, prop: string | symbol, receiver) {
        // Resolve the actual provider from context
        const provider = self.resolveProvider();
        const value = (provider as any)[prop];

        // If it's a function, bind it to the provider
        if (typeof value === "function") {
          return value.bind(provider);
        }

        return value;
      },
    });
  }
}
