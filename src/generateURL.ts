import { v2 as cloudinary } from 'cloudinary';

interface GenerateURLOptions {
  effectiveFolder?: string;
}

export interface GenerateURLParams {
  filename: string;
  prefix?: string;
}

/**
 * getGenerateURL - Returns a function that generates a public URL for a file.
 */
export const getGenerateURL = ({ effectiveFolder }: GenerateURLOptions) => ({ filename, prefix = '' }: GenerateURLParams): string => {
  const folderPath = effectiveFolder || prefix || '';
  filename = filename.split('.').slice(0, -1).join('.');
  const publicId = folderPath ? `${folderPath}/${filename}` : filename;
  return cloudinary.url(publicId, { secure: true });
};
