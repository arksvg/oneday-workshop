import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { deleteFromCloudinary } from './_cloudinary.js';

dotenv.config({ override: true });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // DELETE /api/upload
  if (req.method === 'DELETE') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const target = body.url || body.publicId || req.query?.url || req.query?.publicId;

      if (!target) {
        return res.status(400).json({ success: false, error: 'url or publicId is required for deletion' });
      }

      const delResult = await deleteFromCloudinary(target);
      return res.status(200).json({ success: true, result: delResult });
    } catch (delErr) {
      console.error('API /api/upload DELETE error:', delErr);
      return res.status(500).json({ success: false, error: delErr.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { image, folder = 'sams_oneday_workshop_proofs' } = body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'Image data is required for upload' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'bvu4umtv';
    const apiKey = process.env.CLOUDINARY_API_KEY || '659229348823642';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'SfNVeLpiFHePio9kwMB0QeE3wfk';

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: 'auto',
      tags: ['sams_oneday_workshop', 'payment_proof']
    });

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes
    });
  } catch (err) {
    console.error('API /api/upload error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Image upload failed' });
  }
}
