export interface ImageUploading {
    (input: { image: string; folder: string; }): Promise<string>;
  }
  

  
export interface DeleteFile {
    (input: { file: string; folder: string; type: string; }): Promise<void>;
  }
  

  
export interface DeleteFileCloud {
    (input: { public_id: string; }): Promise<void>;
  }
  

  