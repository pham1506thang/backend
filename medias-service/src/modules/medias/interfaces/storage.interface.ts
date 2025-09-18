export interface IStorageService {
  uploadFile(file: any, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): string;
  fileExists(path: string): Promise<boolean>;
}

export interface StorageConfig {
  type: 'local' | 's3';
  localPath?: string;
  s3Config?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}
