# Cloudinary Storage for Payload

This package provides a simple way to use Cloudinary with Payload.

**NOTE:** This package integrates with `@payloadcms/plugin-cloud-storage` to provide Cloudinary storage capabilities.

## Installation

```sh
pnpm add @payloadcms/storage-cloudinary
```

## Usage

- Configure the `collections` object to specify which collections should use the Cloudinary adapter. The slug _must_ match one of your existing collection slugs.
- The `cloudinaryConfig` object should include your Cloudinary credentials: `cloud_name`, `api_key`, and `api_secret`.

```ts
import { cloudinaryStorage } from '@payloadcms/storage-cloudinary'
import { Media } from './collections/Media'

export default buildConfig({
  collections: [Media],
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
      },
      cloudinaryConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
      // Optional folder configuration
      folder: process.env.CLOUDINARY_FOLDER,
    }),
  ],
})
```

### Configuration Options

Refer to the [Cloudinary Documentation](https://cloudinary.com/documentation) for more information on setting up your Cloudinary account and available configuration options.
