import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { getGenerateURL } from './generateURL';
import { getHandleUpload } from './handleUpload';
import { getHandleDelete } from './handleDelete';
import { getStaticHandler } from './staticHandler';
import { v2 as cloudinary } from 'cloudinary';
import { GenerateURL, HandleDelete, HandleUpload, StaticHandler } from '@payloadcms/plugin-cloud-storage/types';
import { Field } from 'payload';

export interface GeneratedAdapter {
  /**
   * Additional fields to be injected into the base collection and image sizes
   */
  fields?: Field[]
  /**
   * Generates the public URL for a file
   */
  generateURL?: GenerateURL
  handleDelete: HandleDelete
  handleUpload: HandleUpload
  name: string
  onInit?: () => void
  staticHandler: StaticHandler
}

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export interface CloudinaryStorageOptions {
  cloudinaryConfig: CloudinaryConfig;
  folder?: string;
  collections: Record<string, boolean | Record<string, unknown>>;
  enabled?: boolean;
}

/**
 * cloudinaryStorage - A factory function to create your Cloudinary storage adapter.
 */
export const cloudinaryStorage = (options: CloudinaryStorageOptions) => (incomingConfig: any) => {
  if (options.enabled === false) {
    return incomingConfig;
  }

  // Configure Cloudinary once
  cloudinary.config(options.cloudinaryConfig);

  // Create the internal adapter function
  const adapter = cloudinaryStorageInternal(options);

  // Map collections to include our adapter
  const collectionsWithAdapter = Object.entries(options.collections).reduce((acc, [slug, collOptions]) => ({
    ...acc,
    [slug]: {
      ...(collOptions === true ? {} : collOptions),
      adapter,
    },
  }), {} as Record<string, any>);

  // Disable local storage for collections using Cloudinary
  const config = {
    ...incomingConfig,
    collections: (incomingConfig.collections || []).map((collection: any) => {
      if (!collectionsWithAdapter[collection.slug]) return collection;
      return {
        ...collection,
        upload: {
          ...((typeof collection.upload === 'object' && collection.upload) || {}),
          disableLocalStorage: true,
        },
      };
    }),
  };

  return cloudStoragePlugin({
    collections: collectionsWithAdapter,
  })(config);
};

/**
 * cloudinaryStorageInternal - Creates the adapter functions for a given collection.
 */
function cloudinaryStorageInternal({ folder }: CloudinaryStorageOptions) {
  return ({ collection, prefix }: { collection: any; prefix: string }): GeneratedAdapter => {
    // Determine the effective folder (base folder or runtime prefix)
    const effectiveFolder = folder ? (prefix ? `${folder}/${prefix}` : folder) : prefix;

    return {
      name: 'cloudinary',
      generateURL: getGenerateURL({ effectiveFolder }),
      handleUpload: getHandleUpload({ effectiveFolder }),
      handleDelete: getHandleDelete({ effectiveFolder }),
      staticHandler: getStaticHandler({ effectiveFolder }),
    };
  };
}
