// workshopService.js - Client API Service for Cloudinary Uploads & MongoDB Atlas

const API_BASE = '/api';

/**
 * Upload screenshot to Cloudinary via backend /api/upload
 * Returns permanent Cloudinary CDN URL (https://res.cloudinary.com/...)
 */
export async function uploadProofToCloudinary(imageFileOrBase64) {
  try {
    let base64Data = imageFileOrBase64;

    // If a File object is passed, convert to base64
    if (imageFileOrBase64 instanceof File) {
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFileOrBase64);
      });
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Data,
        folder: 'sams_oneday_workshop_proofs'
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.url; // Returns Cloudinary CDN URL
  } catch (err) {
    console.error('Cloudinary image upload failed:', err);
    throw err;
  }
}

/**
 * Fetch workshop registrations directly from MongoDB Atlas collection 'oneday_workshop_registrations'
 */
export async function fetchWorkshopRegistrations(status = 'All') {
  try {
    const url = status && status !== 'All'
      ? `${API_BASE}/workshop-registrations?status=${encodeURIComponent(status)}`
      : `${API_BASE}/workshop-registrations`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Could not fetch from MongoDB, falling back to local storage cache:', err);
    return null;
  }
}

/**
 * Submit new workshop registration to MongoDB Atlas
 */
export async function submitWorkshopRegistration(formData) {
  try {
    const res = await fetch(`${API_BASE}/workshop-registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Submission failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('Failed to submit to MongoDB Atlas:', err);
    throw err;
  }
}

/**
 * Update registration status in MongoDB Atlas
 */
export async function updateWorkshopRegistrationStatus(id, status, notes) {
  try {
    const res = await fetch(`${API_BASE}/workshop-registrations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes })
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('Failed to update registration status in MongoDB:', err);
    throw err;
  }
}

/**
 * Delete registration from MongoDB Atlas
 */
export async function deleteWorkshopRegistrationRecord(id) {
  try {
    const res = await fetch(`${API_BASE}/workshop-registrations`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return true;
  } catch (err) {
    console.error('Failed to delete registration from MongoDB:', err);
    throw err;
  }
}
