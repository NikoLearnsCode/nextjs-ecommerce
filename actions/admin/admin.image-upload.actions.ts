'use server';

import {auth} from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import {randomUUID} from 'crypto';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PRODUCT_IMAGES = 10;

interface ValidationError {
  fileName: string;
  error: string;
}

interface UploadOptions {
  destinationPath: string;
  fileNameGenerator: (file: File, index: number) => string;
}

interface UploadResult {
  publicUrl: string;
  savedPath: string;
}

// HELPERS

// Validate a single file against global rules.
function validateImage(image: File): ValidationError | null {
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    return {
      fileName: image.name,
      error: `File type ${image.type} is not allowed.`,
    };
  }
  if (image.size > MAX_FILE_SIZE) {
    return {
      fileName: image.name,
      error: `File is too large (${(image.size / 1024 / 1024).toFixed(1)}MB). Max ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }
  if (image.size === 0) {
    return {
      fileName: image.name,
      error: 'File is empty.',
    };
  }
  return null;
}

/**
 * Generates a unique, safe filename for product images.
 */
function generateProductFileName(file: File): string {
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();

  const fileExtension = path.extname(sanitizedName);
  const baseName = path.basename(sanitizedName, fileExtension);
  return `${baseName}_${randomUUID()}${fileExtension}`;
}

// MAIN FUNCTIONS

// General helper to validate and upload images.
async function handleImageUpload(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  if (files.length === 0) {
    throw new Error('No images to upload.');
  }

  // Validate all files
  const validationErrors = files
    .map(validateImage)
    .filter(Boolean) as ValidationError[];
  if (validationErrors.length > 0) {
    const errorMessage = validationErrors
      .map((err) => `${err.fileName}: ${err.error}`)
      .join('\n');
    throw new Error(`Image validation failed:\n${errorMessage}`);
  }

  // Create destination directory
  const uploadDir = path.join(
    process.cwd(),
    'public',
    'uploads',
    options.destinationPath
  );
  try {
    await fs.mkdir(uploadDir, {recursive: true});
  } catch (error) {
    throw new Error(`Could not create upload directory: ${error}`);
  }

  // Upload files
  const uploadedFiles: UploadResult[] = [];
  const results: UploadResult[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const finalFileName = options.fileNameGenerator(file, index);
      const savePath = path.join(uploadDir, finalFileName);

      await fs.writeFile(savePath, buffer);

      const result = {
        publicUrl: `/uploads/${options.destinationPath}/${finalFileName}`,
        savedPath: savePath,
      };
      uploadedFiles.push(result);
      results.push(result);
    }
    return results;
  } catch (error) {
    // Clean up files if something fails
    for (const file of uploadedFiles) {
      try {
        await fs.unlink(file.savedPath);
      } catch (cleanupError) {
        console.warn(
          `Could not remove file during cleanup: ${file.savedPath}`,
          cleanupError
        );
      }
    }

    throw error;
  }
}

// EXPORTED FUNCTIONS

export async function uploadCategoryImages(
  desktopImage: File | null,
  mobileImage: File | null,
  categorySlug: string
): Promise<{desktopImageUrl?: string; mobileImageUrl?: string}> {
  const session = await auth();
  if (!session?.user || session.user.role !== 1) {
    throw new Error('Unauthorized. Admin access required.');
  }

  const imagesWithKeys = [
    {key: 'desktop', file: desktopImage},
    {key: 'mobile', file: mobileImage},
  ].filter((item) => item.file) as {key: 'desktop' | 'mobile'; file: File}[];

  const files = imagesWithKeys.map((item) => item.file);

  const results = await handleImageUpload(files, {
    destinationPath: path.join('categories', categorySlug),
    fileNameGenerator: (file, index) => {
      const fileExtension = path.extname(file.name);
      // Use key from `imagesWithKeys` to pick the filename
      const key = imagesWithKeys[index].key;
      return `${key}${fileExtension}`;
    },
  });

  // Map results back to the expected shape
  const urls: {desktopImageUrl?: string; mobileImageUrl?: string} = {};
  results.forEach((result, index) => {
    const key = imagesWithKeys[index].key;
    if (key === 'desktop') urls.desktopImageUrl = result.publicUrl;
    if (key === 'mobile') urls.mobileImageUrl = result.publicUrl;
  });

  return urls;
}

export async function uploadProductImages(
  images: File[],
  gender: string,
  category: string
): Promise<string[]> {
  const session = await auth();
  if (!session?.user || session.user.role !== 1) {
    throw new Error('Unauthorized. Admin access required.');
  }

  if (images.length > MAX_PRODUCT_IMAGES) {
    throw new Error(`Maximum ${MAX_PRODUCT_IMAGES} images allowed.`);
  }

  const results = await handleImageUpload(images, {
    destinationPath: path.join(gender, category),
    fileNameGenerator: generateProductFileName,
  });

  return results.map((result) => result.publicUrl);
}
