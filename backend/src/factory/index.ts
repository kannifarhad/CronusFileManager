import { StorageTypeContext } from "./utils/storageTypeContext";
import FileManagerProviderBase from "./providers/FileManagerProviderBase";
import LocalFileManagerProvider from "./providers/LocalFileManagerProvider";
import S3BucketFileManagerProvider from "./providers/S3BucketFileManagerProvider";
import { FileManagerFactoryConfig, StorageProvider } from "./types";

export class FileManagerFactory {
  private providers: Map<StorageProvider, FileManagerProviderBase> = new Map();
  private defaultProvider: StorageProvider;

  constructor(config: FileManagerFactoryConfig) {
    this.defaultProvider = config.defaultProvider;
    this.initializeProviders(config.providers);
  }

  private initializeProviders(providersConfig: FileManagerFactoryConfig["providers"]): void {
    // Initialize Local provider
    if (providersConfig[StorageProvider.LOCAL]) {
      const localProvider = new LocalFileManagerProvider(providersConfig[StorageProvider.LOCAL]);
      this.providers.set(StorageProvider.LOCAL, localProvider);
    }

    // Initialize S3 provider
    if (providersConfig[StorageProvider.S3]) {
      const s3Provider = new S3BucketFileManagerProvider(providersConfig[StorageProvider.S3]);
      this.providers.set(StorageProvider.S3, s3Provider);
    }
  }

  getProvider(provider?: StorageProvider): FileManagerProviderBase {
    const targetProvider = provider || this.defaultProvider;
    const providerEntity = this.providers.get(targetProvider);

    if (!providerEntity) {
      throw new Error(`Storage provider '${targetProvider}' is not configured`);
    }

    return providerEntity;
  }

  resolveProvider(): FileManagerProviderBase {
    const contextProvider = StorageTypeContext.getStorageProvider();
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
   * Returns a type-safe proxy that looks like FileManagerProviderBase
   */
  createProxy(): FileManagerProviderBase {
    const self = this;

    return new Proxy({} as FileManagerProviderBase, {
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
