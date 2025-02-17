import { v2 as cloudinary } from 'cloudinary';
import { PayloadRequest } from 'payload';

interface StaticHandlerOptions {
  effectiveFolder?: string;
}

interface RequestParams {
  params: {
    collection: string;
    filename: string;
  };
}

/**
 * getStaticHandler - Returns a function to serve files from Cloudinary.
 */
export const getStaticHandler = ({ effectiveFolder }: StaticHandlerOptions) => {
  return async (req: PayloadRequest, { params: { filename } }: RequestParams): Promise<Response> => {
    filename = filename.split('.').slice(0, -1).join('.');
    const publicId = effectiveFolder ? `${effectiveFolder}/${filename}` : filename;
    const url = cloudinary.url(publicId, { secure: true });

    // Redirect to the Cloudinary URL
    return new Response(null, {
      status: 302,
      headers: {
        Location: url,
      },
    });
  }
};
