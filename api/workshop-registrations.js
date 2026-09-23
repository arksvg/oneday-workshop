import {
  getWorkshopRegistrations,
  insertWorkshopRegistration,
  updateWorkshopRegistration,
  deleteWorkshopRegistration
} from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/workshop-registrations
    if (req.method === 'GET') {
      const status = req.query?.status;
      let records = await getWorkshopRegistrations();

      if (status && status !== 'All') {
        records = records.filter(
          (r) => (r.status || '').toLowerCase() === status.toLowerCase()
        );
      }

      return res.status(200).json({ success: true, data: records });
    }

    // POST /api/workshop-registrations
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const {
        name,
        email,
        phone,
        city,
        registrationType = 'Individual',
        numberOfAttendees = 1,
        purpose = 'Basic Life Skills & Vegetable Floral Bouquet Carving',
        bankDetails = '',
        amountPaid = 500,
        proofImageUrl = '',
        notes = '',
        registrationId
      } = body;

      if (!name || !email || !phone || !bankDetails) {
        return res.status(400).json({
          success: false,
          error: 'Required fields missing (name, email, phone, bankDetails)'
        });
      }

      const timestamp = Date.now();
      const generatedRegId = registrationId || `SAM-ODW-${timestamp.toString().slice(-6)}`;

      const newRegistration = {
        registrationId: generatedRegId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: (city || 'Chennai').trim(),
        registrationType,
        numberOfAttendees: Number(numberOfAttendees) || 1,
        purpose,
        bankDetails: bankDetails.trim(),
        amountPaid: Number(amountPaid) || 500,
        proofImageUrl,
        notes: notes ? notes.trim() : '',
        status: 'Pending Verification',
        submittedAt: new Date().toISOString()
      };

      const saved = await insertWorkshopRegistration(newRegistration);
      return res.status(201).json({ success: true, data: saved });
    }

    // PUT /api/workshop-registrations
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { id, status, notes } = body;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Registration id is required' });
      }

      const updateFields = {};
      if (status !== undefined) updateFields.status = status;
      if (notes !== undefined) updateFields.notes = notes;

      const updated = await updateWorkshopRegistration(id, updateFields);
      return res.status(200).json({ success: true, data: updated });
    }

    // DELETE /api/workshop-registrations
    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const id = body.id || req.query?.id;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Registration id is required' });
      }

      const result = await deleteWorkshopRegistration(id);
      return res.status(200).json({ success: true, result });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('API /api/workshop-registrations error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}
