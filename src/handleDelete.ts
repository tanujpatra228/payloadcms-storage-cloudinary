import { v2 as cloudinary } from 'cloudinary';

interface HandleDeleteOptions {
  effectiveFolder?: string;
}

interface HandleDeleteParams {
  doc: { prefix?: string };
  filename: string;
}

/**
 * getHandleDelete - Returns a function to handle file deletion from Cloudinary.
 */
export const getHandleDelete = ({ effectiveFolder }: HandleDeleteOptions) => async ({ doc, filename }: HandleDeleteParams): Promise<void> => {
  const folderPath = effectiveFolder || doc.prefix || '';
  filename = filename.split('.').slice(0, -1).join('.');
  const publicId = folderPath ? `${folderPath}/${filename}` : filename;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};
