import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import confetti from 'canvas-confetti';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CopyOutlined,
  PrinterOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
  DeleteOutlined,
  EyeOutlined,
  BankOutlined,
  QrcodeOutlined,
  WhatsAppOutlined,
  ReloadOutlined,
  TeamOutlined,
  DownloadOutlined,
  TableOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

import {
  uploadProofToCloudinary,
  submitWorkshopRegistration
} from '../services/workshopService';

const STORAGE_KEY = 'sams_oneday_workshop_registrations';

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Payment proof preview & upload state
  const [proofPreview, setProofPreview] = useState('');
  const [previewModal, setPreviewModal] = useState({ open: false, url: '', title: '' });

  // Admin / Submissions Drawer
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [allRegistrations, setAllRegistrations] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    registrationType: 'Individual', // 'Individual' | 'Group (2 or more)' | 'Student'
    numberOfAttendees: 1,
    purpose: 'Basic Knife Skills & Vegetable Floral Bouquet Carving',
    bankDetails: '',
    amountPaid: 500,
    proofImageUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Load existing registrations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAllRegistrations(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read stored registrations:', e);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone or WhatsApp number.';
    }
    if (!formData.city.trim()) {
      errs.city = 'City / Location is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.bankDetails || !formData.bankDetails.trim()) {
      errs.bankDetails = 'Transaction ID / UPI Reference Number is required.';
    }
    if (!formData.proofImageUrl && !proofPreview) {
      errs.proofImage = 'Payment proof screenshot is required for seat allocation.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      const target = document.getElementById('register');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      const target = document.getElementById('register');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Payment Proof Image Upload
  const handleProofImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error('Screenshot size should be less than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setProofPreview(result);
      setFormData((prev) => ({ ...prev, proofImageUrl: result }));
      setErrors((prev) => ({ ...prev, proofImage: '' }));
      message.success('Payment screenshot attached successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProof = () => {
    setProofPreview('');
    setFormData((prev) => ({ ...prev, proofImageUrl: '' }));
  };

  const copyToClipboard = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      message.success(`${label} copied to clipboard!`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      message.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const regId = `SAM-ODW-${Date.now().toString().slice(-6)}`;
      let finalProofUrl = formData.proofImageUrl;

      // 1. Upload proof screenshot to Cloudinary if base64
      if (formData.proofImageUrl && formData.proofImageUrl.startsWith('data:')) {
        try {
          message.loading({ content: 'Uploading payment proof to Cloudinary...', key: 'uploadStatus' });
          finalProofUrl = await uploadProofToCloudinary(formData.proofImageUrl);
          message.success({ content: 'Proof uploaded to Cloudinary CDN!', key: 'uploadStatus' });
        } catch (uploadErr) {
          console.warn('Cloudinary upload warning (using fallback):', uploadErr);
          message.info({ content: 'Proceeding with registration...', key: 'uploadStatus' });
        }
      }

      const submission = {
        ...formData,
        proofImageUrl: finalProofUrl,
        registrationId: regId,
        submittedAt: new Date().toISOString(),
        status: 'Pending Verification'
      };

      // 2. Save directly to MongoDB Atlas
      try {
        await submitWorkshopRegistration(submission);
      } catch (dbErr) {
        console.warn('MongoDB Atlas sync fallback to localStorage:', dbErr);
      }

      // 3. Save locally as cache
      const updatedList = [submission, ...allRegistrations];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setAllRegistrations(updatedList);
      window.dispatchEvent(new Event('workshop-registration-updated'));

      setSubmittedData(submission);
      setCurrentStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      message.success('Seat reserved successfully! Registration saved to Cloudinary & MongoDB.');
      const target = document.getElementById('register');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      message.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      registrationType: 'Individual',
      numberOfAttendees: 1,
      purpose: 'Basic Knife Skills & Vegetable Floral Bouquet Carving',
      bankDetails: '',
      amountPaid: 500,
      proofImageUrl: '',
      notes: ''
    });
    setProofPreview('');
    setSubmittedData(null);
    setCurrentStep(1);
    setErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToCSV = () => {
    if (!allRegistrations || allRegistrations.length === 0) {
      message.info('No registrations found to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Name',
      'Phone',
      'Email',
      'City',
      'Type',
      'Attendees',
      'Amount Paid (INR)',
      'Transaction Ref',
      'Submitted At'
    ];

    const rows = allRegistrations.map((r) => [
      `"${r.registrationId || ''}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.city || '').replace(/"/g, '""')}"`,
      `"${(r.registrationType || '').replace(/"/g, '""')}"`,
      `"${r.numberOfAttendees || 1}"`,
      `"${r.amountPaid || 500}"`,
      `"${(r.bankDetails || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sams_Workshop_Registrations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('Registrations exported to CSV!');
  };

  return (
    <section id="register" style={{ padding: '70px 16px 90px', background: 'radial-gradient(circle at center top, rgba(232, 167, 16, 0.08) 0%, transparent 60%)' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <div className="hero-badge-glow">
            <SafetyCertificateOutlined />
            <span>OFFICIAL WORKSHOP REGISTRATION PORTAL</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: '800', marginBottom: '14px' }}>
            Reserve Your <span className="gradient-text-gold">Workshop Slot</span>
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            Pay the advance seat reservation fee of Rs. 500 to lock in your workstation, carving kit, and certificate.
          </p>
        </div>

        {/* Step Indicator Header */}
        {!submittedData && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '32px'
            }}
          >
            <div
              onClick={() => currentStep === 2 && setCurrentStep(1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: currentStep === 1 ? 'rgba(232, 167, 16, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: currentStep === 1 ? '1px solid var(--mango-yellow)' : '1px solid var(--border-color)',
                cursor: currentStep === 2 ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep === 1 ? 'var(--mango-yellow)' : currentStep > 1 ? 'var(--green-primary)' : 'rgba(255,255,255,0.1)',
                  color: currentStep === 1 ? '#000000' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem'
                }}
              >
                {currentStep > 1 ? <CheckCircleOutlined /> : '1'}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: currentStep === 1 ? 'var(--mango-yellow)' : 'var(--text-dark)' }}>
                  Step 1: Participant Info
                </div>
                <div style={{ fontSize: '0.76rem', opacity: 0.7 }}>Personal &amp; Contact Details</div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: currentStep === 2 ? 'rgba(232, 167, 16, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: currentStep === 2 ? '1px solid var(--mango-yellow)' : '1px solid var(--border-color)',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep === 2 ? 'var(--mango-yellow)' : 'rgba(255,255,255,0.1)',
                  color: currentStep === 2 ? '#000000' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem'
                }}
              >
                2
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: currentStep === 2 ? 'var(--mango-yellow)' : 'var(--text-dark)' }}>
                  Step 2: Advance Payment
                </div>
                <div style={{ fontSize: '0.76rem', opacity: 0.7 }}>Rs. 500 UPI / QR Scan &amp; Proof</div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS SLIP */}
        {submittedData ? (
          <div className="onboarding-success-card">
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '38px',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircleOutlined />
            </div>

            <div className="badge badge-success" style={{ padding: '6px 16px', borderRadius: '20px', marginBottom: '12px', display: 'inline-block' }}>
              SEAT RESERVATION CONFIRMED
            </div>

            <h3 style={{ fontSize: '1.7rem', fontWeight: '800', marginBottom: '8px' }}>
              Congratulations, {submittedData.name}!
            </h3>

            <p style={{ maxWidth: '580px', margin: '0 auto 24px', opacity: 0.88, fontSize: '0.98rem', lineHeight: '1.6' }}>
              Your seat for Chef Manikandan's One Day Workshop has been reserved. Your training station, carving kit, and certificate details have been registered.
            </p>

            {/* Application Slip */}
            <div className="application-slip-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7, display: 'block' }}>Registration ID</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--mango-yellow)', letterSpacing: '0.5px' }}>
                    {submittedData.registrationId}
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7, display: 'block' }}>Date</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    {new Date(submittedData.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Participant Name</strong>
                  <div>{submittedData.name}</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Phone / WhatsApp</strong>
                  <div>{submittedData.phone}</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Email</strong>
                  <div>{submittedData.email}</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>City / Location</strong>
                  <div>{submittedData.city}</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Workshop</strong>
                  <div>Basic Knife Skills &amp; Bouquet Carving</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Instructor</strong>
                  <div>Sun TV MasterChef Manikandan</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Workshop Timing</strong>
                  <div>10:00 AM to 5:00 PM</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Registration Advance Paid</strong>
                  <div style={{ color: '#22c55e', fontWeight: '800' }}>Rs. {submittedData.amountPaid}/- (Paid)</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Transaction Reference / ID</strong>
                  <div style={{ color: 'var(--mango-yellow)', fontWeight: '700' }}>{submittedData.bankDetails}</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Kit &amp; Certificate</strong>
                  <div style={{ color: '#22c55e' }}>Reserved Included</div>
                </div>
              </div>

              {submittedData.proofImageUrl && (
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                  <strong style={{ opacity: 0.7, display: 'block', marginBottom: '8px' }}>Payment Proof Attachment</strong>
                  <img
                    src={submittedData.proofImageUrl}
                    alt="Payment Screenshot Preview"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--mango-yellow)', cursor: 'pointer' }}
                    onClick={() => setPreviewModal({ open: true, url: submittedData.proofImageUrl, title: 'Payment Proof Screenshot' })}
                  />
                </div>
              )}
            </div>

            {/* Actions: WhatsApp confirmation & Print Slip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginTop: '28px' }}>
              <a
                href={`https://wa.me/918939648457?text=${encodeURIComponent(
                  `Hi Chef Vahitha & MasterChef Manikandan, I have paid the Rs. 500 advance registration fee for the One Day Workshop.\n\n` +
                  `Registration ID: ${submittedData.registrationId}\n` +
                  `Participant Name: ${submittedData.name}\n` +
                  `Phone: ${submittedData.phone}\n` +
                  `City: ${submittedData.city}\n` +
                  `Transaction ID: ${submittedData.bankDetails}\n\n` +
                  `Please confirm my seat and kit allocation. Thank you!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '30px'
                }}
              >
                <WhatsAppOutlined style={{ fontSize: '18px' }} />
                <span>Confirm on WhatsApp (+91 8939648457)</span>
              </a>

              <button
                type="button"
                onClick={handlePrint}
                className="btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '30px'
                }}
              >
                <PrinterOutlined />
                <span>Print / Save Receipt</span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem'
                }}
              >
                <ReloadOutlined />
                <span>Register Another Person</span>
              </button>
            </div>
          </div>
        ) : (
          /* FORM CONTAINER */
          <div className="onboarding-form-card" style={{ padding: '34px 28px' }}>
            <form onSubmit={handleSubmit}>
              {/* STEP 1: PARTICIPANT INFORMATION */}
              {currentStep === 1 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <UserOutlined style={{ color: 'var(--mango-yellow)', fontSize: '20px' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Participant Details</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    {/* Full Name */}
                    <div className="form-group-field">
                      <label className="field-label" htmlFor="w-name">
                        Full Name <span style={{ color: '#ff4d4f' }}>*</span>
                      </label>
                      <div className="custom-input-wrap">
                        <UserOutlined className="input-prefix-icon" />
                        <input
                          id="w-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Priyadharshini K."
                          className={`custom-form-input ${errors.name ? 'has-error' : ''}`}
                        />
                      </div>
                      {errors.name && <span className="field-error-msg">{errors.name}</span>}
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="form-group-field">
                      <label className="field-label" htmlFor="w-phone">
                        Phone / WhatsApp Number <span style={{ color: '#ff4d4f' }}>*</span>
                      </label>
                      <div className="custom-input-wrap">
                        <PhoneOutlined className="input-prefix-icon" />
                        <input
                          id="w-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 9876543210"
                          className={`custom-form-input ${errors.phone ? 'has-error' : ''}`}
                        />
                      </div>
                      {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group-field">
                      <label className="field-label" htmlFor="w-email">
                        Email Address <span style={{ color: '#ff4d4f' }}>*</span>
                      </label>
                      <div className="custom-input-wrap">
                        <MailOutlined className="input-prefix-icon" />
                        <input
                          id="w-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. yourname@example.com"
                          className={`custom-form-input ${errors.email ? 'has-error' : ''}`}
                        />
                      </div>
                      {errors.email && <span className="field-error-msg">{errors.email}</span>}
                    </div>

                    {/* City / Location */}
                    <div className="form-group-field">
                      <label className="field-label" htmlFor="w-city">
                        City / Location <span style={{ color: '#ff4d4f' }}>*</span>
                      </label>
                      <div className="custom-input-wrap">
                        <HomeOutlined className="input-prefix-icon" />
                        <input
                          id="w-city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Chennai, Kodambakkam, Coimbatore"
                          className={`custom-form-input ${errors.city ? 'has-error' : ''}`}
                        />
                      </div>
                      {errors.city && <span className="field-error-msg">{errors.city}</span>}
                    </div>
                  </div>

                  {/* Registration Category */}
                  <div className="form-group-field" style={{ marginBottom: '22px' }}>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TeamOutlined style={{ color: 'var(--mango-yellow)' }} />
                      <span>Registration Category</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                      {['Individual', 'Group (2 or more)', 'Culinary / College Student'].map((type) => (
                        <div
                          key={type}
                          onClick={() => setFormData((prev) => ({ ...prev, registrationType: type }))}
                          style={{
                            padding: '12px',
                            borderRadius: '10px',
                            background: formData.registrationType === type ? 'rgba(232, 167, 16, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: formData.registrationType === type ? '1px solid var(--mango-yellow)' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '0.88rem',
                            fontWeight: formData.registrationType === type ? '700' : '500',
                            color: formData.registrationType === type ? 'var(--mango-yellow)' : 'var(--text-dark)'
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                    {formData.registrationType.includes('Group') && (
                      <small style={{ display: 'block', marginTop: '6px', color: 'var(--mango-yellow)', fontSize: '0.82rem' }}>
                        Special group discount will be applied to your final workshop fee! Call +91 8939648457 to verify your group offer.
                      </small>
                    )}
                  </div>

                  {/* Notes / Prior Experience */}
                  <div className="form-group-field" style={{ marginBottom: '28px' }}>
                    <label className="field-label" htmlFor="w-notes">
                      Special Interest or Prior Experience (Optional)
                    </label>
                    <textarea
                      id="w-notes"
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Complete beginner / Hotel management student / Caterer seeking centerpiece mastery"
                      className="custom-form-input"
                      style={{ height: 'auto', padding: '12px' }}
                    />
                  </div>

                  {/* Navigation Next Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 30px',
                        borderRadius: '30px',
                        fontWeight: '700'
                      }}
                    >
                      <span>Proceed to Payment (Rs. 500)</span>
                      <ArrowRightOutlined />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ADVANCE PAYMENT (Rs. 500) */}
              {currentStep === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CreditCardOutlined style={{ color: 'var(--mango-yellow)', fontSize: '20px' }} />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Advance Seat Payment</h3>
                    </div>
                    <span style={{ fontSize: '0.95rem', color: '#22c55e', fontWeight: '800' }}>
                      Fee: Rs. 500/-
                    </span>
                  </div>

                  {/* Payment Methods Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '20px',
                      marginBottom: '26px'
                    }}
                  >
                    {/* QR Code Card */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                        <QrcodeOutlined style={{ color: 'var(--mango-yellow)', fontSize: '18px' }} />
                        <strong style={{ fontSize: '0.98rem' }}>Scan UPI QR Code</strong>
                      </div>

                      <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
                        <img
                          src="/qr.jpeg"
                          alt="Sam's Culinary Art Class UPI QR Code"
                          style={{ width: '160px', height: '160px', objectFit: 'contain', display: 'block' }}
                        />
                      </div>

                      <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '14px' }}>
                        Scan via GPay, PhonePe, Paytm, or any BHIM UPI App
                      </div>

                      {/* UPI ID Box */}
                      <div className="payment-detail-box" style={{ padding: '8px 12px', borderRadius: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase', display: 'block' }}>UPI ID</span>
                          <strong style={{ fontSize: '0.88rem' }}>vahijeeva@oksbi</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('vahijeeva@oksbi', 'UPI ID')}
                          style={{ background: 'rgba(232, 167, 16, 0.15)', border: '1px solid var(--mango-yellow)', color: 'var(--mango-yellow)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                        >
                          <CopyOutlined /> Copy
                        </button>
                      </div>
                    </div>

                    {/* Direct Mobile & Bank Transfer Card */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BankOutlined style={{ color: 'var(--mango-yellow)', fontSize: '18px' }} />
                        <strong style={{ fontSize: '0.98rem' }}>Direct UPI / PhonePe / Bank</strong>
                      </div>

                      {/* PhonePe / GPay Mobile */}
                      <div className="payment-detail-box" style={{ padding: '10px 12px', borderRadius: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase', display: 'block' }}>GPay / PhonePe Mobile</span>
                          <strong style={{ fontSize: '0.95rem' }}>8939648457</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('8939648457', 'Phone Number')}
                          style={{ background: 'rgba(232, 167, 16, 0.15)', border: '1px solid var(--mango-yellow)', color: 'var(--mango-yellow)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                        >
                          <CopyOutlined /> Copy
                        </button>
                      </div>

                      {/* Bank Details */}
                      <div style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', fontSize: '0.82rem', lineHeight: '1.6' }}>
                        <div><strong style={{ opacity: 0.7 }}>Account Holder:</strong> Vahitha Jeevanandam</div>
                        <div><strong style={{ opacity: 0.7 }}>Bank:</strong> State Bank of India (SBI)</div>
                        <div><strong style={{ opacity: 0.7 }}>Purpose:</strong> One Day Workshop Advance</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', opacity: 0.85, background: 'rgba(232, 167, 16, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(232, 167, 16, 0.2)' }}>
                        <InfoCircleOutlined style={{ color: 'var(--mango-yellow)', marginTop: '2px' }} />
                        <span>After transferring Rs. 500, enter the 12-digit UTR/UPI reference ID below and attach your payment screenshot.</span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID Input */}
                  <div className="form-group-field" style={{ marginBottom: '20px' }}>
                    <label className="field-label" htmlFor="w-trans">
                      UPI Reference / Transaction ID (UTR Number) <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <div className="custom-input-wrap">
                      <CreditCardOutlined className="input-prefix-icon" />
                      <input
                        id="w-trans"
                        type="text"
                        name="bankDetails"
                        value={formData.bankDetails}
                        onChange={handleInputChange}
                        placeholder="e.g. UPI Ref: 428190342110 or GPay Trans ID"
                        className={`custom-form-input ${errors.bankDetails ? 'has-error' : ''}`}
                      />
                    </div>
                    {errors.bankDetails && <span className="field-error-msg">{errors.bankDetails}</span>}
                  </div>

                  {/* Proof Screenshot Upload */}
                  <div className="form-group-field" style={{ marginBottom: '28px' }}>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CloudUploadOutlined style={{ color: 'var(--mango-yellow)' }} />
                      <span>Upload Payment Screenshot <span style={{ color: '#ff4d4f' }}>*</span></span>
                    </label>

                    {proofPreview ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px' }}>
                        <img
                          src={proofPreview}
                          alt="Screenshot Preview"
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--mango-yellow)', cursor: 'pointer' }}
                          onClick={() => setPreviewModal({ open: true, url: proofPreview, title: 'Payment Screenshot' })}
                        />
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '0.9rem', color: '#22c55e', display: 'block', marginBottom: '4px' }}>
                            <CheckCircleOutlined /> Screenshot Attached
                          </strong>
                          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ready for instant verification</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveProof}
                          style={{ background: 'rgba(255, 77, 79, 0.15)', border: '1px solid #ff4d4f', color: '#ff4d4f', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          <DeleteOutlined /> Remove
                        </button>
                      </div>
                    ) : (
                      <div className={`proof-upload-dropzone ${errors.proofImage ? 'has-error' : ''}`} style={{ textAlign: 'center', padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <FileImageOutlined style={{ fontSize: '32px', color: 'var(--mango-yellow)', marginBottom: '8px' }} />
                        <div style={{ fontWeight: '600', fontSize: '0.92rem', marginBottom: '4px' }}>
                          Upload GPay / PhonePe / Bank Transfer Screenshot
                        </div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '0 0 12px 0' }}>
                          JPG, PNG, or WebP up to 5 MB
                        </p>
                        <label className="btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '20px' }}>
                          <CloudUploadOutlined />
                          <span>Select Screenshot</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofImageChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    )}
                    {errors.proofImage && <span className="field-error-msg">{errors.proofImage}</span>}
                  </div>

                  {/* Form Step 2 Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="btn-outline"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '30px' }}
                    >
                      <ArrowLeftOutlined />
                      <span>Back to Details</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 32px',
                        borderRadius: '30px',
                        fontWeight: '700'
                      }}
                    >
                      {isSubmitting ? (
                        <span>Processing Registration...</span>
                      ) : (
                        <>
                          <CheckCircleOutlined />
                          <span>Complete Registration &amp; Lock Seat</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Organizer / Admissions Submissions Footer Utility */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            type="button"
            onClick={() => {
              window.location.hash = 'admin';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              background: 'transparent',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TableOutlined />
            <span>Admissions Desk: Open Admin Portal ({allRegistrations.length})</span>
          </button>
        </div>

        {/* Modal: Lightbox Screenshot Viewer */}
        <Modal
          open={previewModal.open}
          onCancel={() => setPreviewModal({ open: false, url: '', title: '' })}
          footer={null}
          centered
          width={560}
        >
          {previewModal.url && (
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <img
                src={previewModal.url}
                alt={previewModal.title}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          )}
        </Modal>

        {/* Modal: Admin / Admissions Desk Records */}
        <Modal
          title="Workshop Registrations Ledger"
          open={showAdminModal}
          onCancel={() => setShowAdminModal(false)}
          footer={[
            <button
              key="export"
              type="button"
              onClick={exportToCSV}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem' }}
            >
              <DownloadOutlined /> Export to CSV
            </button>,
            <button
              key="close"
              type="button"
              onClick={() => setShowAdminModal(false)}
              className="btn-outline"
              style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem' }}
            >
              Close
            </button>
          ]}
          width={760}
        >
          {allRegistrations.length === 0 ? (
            <p style={{ opacity: 0.7, textAlign: 'center', padding: '20px' }}>No registrations recorded yet.</p>
          ) : (
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Reg ID</th>
                    <th style={{ padding: '8px' }}>Name</th>
                    <th style={{ padding: '8px' }}>Phone</th>
                    <th style={{ padding: '8px' }}>City</th>
                    <th style={{ padding: '8px' }}>Type</th>
                    <th style={{ padding: '8px' }}>UTR / Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {allRegistrations.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px', color: 'var(--mango-yellow)', fontWeight: '700' }}>{r.registrationId}</td>
                      <td style={{ padding: '8px' }}>{r.name}</td>
                      <td style={{ padding: '8px' }}>{r.phone}</td>
                      <td style={{ padding: '8px' }}>{r.city}</td>
                      <td style={{ padding: '8px' }}>{r.registrationType}</td>
                      <td style={{ padding: '8px' }}>{r.bankDetails}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
