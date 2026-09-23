import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'bvu4umtv';
const apiKey = process.env.CLOUDINARY_API_KEY || '659229348823642';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'SfNVeLpiFHePio9kwMB0QeE3wfk';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

/**
 * Extracts public_id from Cloudinary URL
 */
export function extractCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?([^.]+)(?:\.[a-zA-Z0-9]+)?$/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (err) {
    console.error('Error extracting Cloudinary publicId:', err);
  }
  return null;
}

/**
 * Deletes an image from Cloudinary by its URL or public_id
 */
export async function deleteFromCloudinary(urlOrPublicId) {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') return null;

  if (urlOrPublicId.startsWith('data:') || urlOrPublicId.startsWith('blob:')) return null;

  const publicId = urlOrPublicId.startsWith('http') 
    ? extractCloudinaryPublicId(urlOrPublicId) 
    : urlOrPublicId;

  if (!publicId) {
    return null;
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return res;
  } catch (err) {
    console.error(`Cloudinary deletion error for ${publicId}:`, err);
    return { result: 'error', error: err.message };
  }
}

export { cloudinary };
