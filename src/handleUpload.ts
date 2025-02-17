import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

interface HandleUploadOptions {
  effectiveFolder?: string;
}

interface FileData {
  filename: string;
  tempFilePath?: string;
  buffer?: Buffer;
  mimeType?: string;
}

interface HandleUploadParams {
  data: any;
  file: FileData;
}

/**
 * getHandleUpload - Returns a function to handle file uploads to Cloudinary without using streamifier.
 */
export const getHandleUpload = ({ effectiveFolder }: HandleUploadOptions) =>
  async ({ data, file }: HandleUploadParams): Promise<any> => {
    const uploadOptions: UploadApiOptions = {};
    if (effectiveFolder) {
      uploadOptions.folder = effectiveFolder;
    }
    // Use the original filename as the public_id in Cloudinary
    uploadOptions.public_id = file.filename.split('.').slice(0, -1).join('.');

    if (file.tempFilePath) {
      await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
      return data;
    }

    if (file.buffer) {
      // Convert the buffer into a Base64-encoded data URI
      const base64 = file.buffer.toString('base64');
      const dataUri = `data:${file.mimeType};base64,${base64}`;
      await cloudinary.uploader.upload(dataUri, uploadOptions);
      return data;
    }

    throw new Error('No file data provided for upload');
  };
