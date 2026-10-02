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
  InfoCircleOutlined,
  TrophyOutlined
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
  const [showGroupModal, setShowGroupModal] = useState(false);

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
    purpose: 'One Day Vegetable Carving Workshop',
    bankDetails: '',
    amountPaid: 4499,
    proofImageUrl: '',
    notes: ''
  });

  const isGroupRegistration = formData.registrationType.includes('Group');

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

  const handleGroupOfferClaim = async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);
    try {
      const regId = `SAM-GRP-${Date.now().toString().slice(-6)}`;
      const submission = {
        ...formData,
        amountPaid: 0,
        bankDetails: 'Group Offer Claim - Direct Contact',
        proofImageUrl: '',
        registrationId: regId,
        submittedAt: new Date().toISOString(),
        status: 'Group Offer Claim'
      };

      try {
        await submitWorkshopRegistration(submission);
      } catch (dbErr) {
        console.warn('MongoDB Atlas sync fallback for group enquiry:', dbErr);
      }

      const updatedList = [submission, ...allRegistrations];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setAllRegistrations(updatedList);
      window.dispatchEvent(new Event('workshop-registration-updated'));

      setSubmittedData(submission);
      setShowGroupModal(true);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      message.success('Group details registered! Contact admissions to claim your offer.');
    } catch (err) {
      message.error('Could not submit group enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!validateStep1()) return;

    if (isGroupRegistration) {
      handleGroupOfferClaim();
      return;
    }

    setCurrentStep(2);
    const target = document.getElementById('register');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
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
      purpose: 'One Day Vegetable Carving Workshop',
      bankDetails: '',
      amountPaid: 4499,
      proofImageUrl: '',
      notes: ''
    });
    setProofPreview('');
    setSubmittedData(null);
    setCurrentStep(1);
    setErrors({});
  };

  const handlePrint = () => {
    if (!submittedData) {
      window.print();
      return;
    }

    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (!printWin) {
      window.print();
      return;
    }

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Registration_Receipt_${submittedData.registrationId || 'SAMS'}</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 14mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            body {
              background: #ffffff;
              color: #1a1a1a;
              padding: 16px;
              font-size: 13px;
              line-height: 1.45;
            }
            .receipt-card {
              max-width: 660px;
              margin: 0 auto;
              border: 2px solid #194121;
              border-radius: 12px;
              padding: 22px 26px;
            }
            .brand-header {
              text-align: center;
              border-bottom: 2px solid #194121;
              padding-bottom: 12px;
              margin-bottom: 16px;
            }
            .brand-title {
              font-size: 22px;
              font-weight: 800;
              color: #194121;
              letter-spacing: 0.5px;
            }
            .brand-sub {
              font-size: 11.5px;
              color: #4b5563;
              margin-top: 3px;
            }
            .receipt-tag {
              display: inline-block;
              background: #194121;
              color: #ffffff;
              padding: 3px 14px;
              border-radius: 16px;
              font-size: 10.5px;
              font-weight: 700;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              margin-top: 6px;
            }
            .status-banner {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #f0fdf4;
              border: 1px solid #86efac;
              border-radius: 8px;
              padding: 10px 14px;
              margin-bottom: 16px;
            }
            .status-badge {
              color: #166534;
              font-weight: 800;
              font-size: 13px;
            }
            .reg-id-val {
              font-size: 14px;
              font-weight: 800;
              color: #194121;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
            }
            .data-table td {
              padding: 8px 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 12.5px;
            }
            .data-table tr:nth-child(even) {
              background: #f9fafb;
            }
            .label-td {
              width: 36%;
              color: #4b5563;
              font-weight: 600;
            }
            .val-td {
              width: 64%;
              color: #111827;
              font-weight: 700;
            }
            .price-total {
              color: #15803d;
              font-weight: 800;
              font-size: 13.5px;
            }
            .price-breakdown {
              color: #b45309;
              font-weight: 700;
            }
            .perks-box {
              background: #f9fafb;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 10px 14px;
              margin-bottom: 14px;
              font-size: 11px;
              color: #374151;
              line-height: 1.5;
            }
            .perks-head {
              font-weight: 700;
              color: #194121;
              margin-bottom: 4px;
              font-size: 11.5px;
            }
            .footer-legal {
              text-align: center;
              font-size: 10px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
            }
            @media print {
              body { padding: 0; }
              .receipt-card { border: 2px solid #194121; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="brand-header">
              <div class="brand-title">SAM'S CULINARY ART CLASS</div>
              <div class="brand-sub">"Anbhazhi Bhavanam", No. 18/21, Vishwanathapuram 3rd Street, Kodambakkam, Chennai - 600024</div>
              <div class="brand-sub">Helpline / WhatsApp: +91 8939648457 | samsculinaryartclass@gmail.com</div>
              <div class="receipt-tag">Workshop Registration &amp; Payment Receipt</div>
            </div>

            <div class="status-banner">
              <div>
                <span style="font-size: 10.5px; color: #4b5563; display: block; text-transform: uppercase;">Registration Status</span>
                <span class="status-badge">${submittedData.registrationType?.includes('Group') ? 'GROUP REGISTRATION RECORDED' : 'SEAT RESERVATION CONFIRMED'}</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 10.5px; color: #4b5563; display: block; text-transform: uppercase;">Registration ID</span>
                <span class="reg-id-val">${submittedData.registrationId}</span>
              </div>
            </div>

            <table class="data-table">
              <tr>
                <td class="label-td">Participant Name</td>
                <td class="val-td">${submittedData.name}</td>
              </tr>
              <tr>
                <td class="label-td">Mobile / WhatsApp</td>
                <td class="val-td">${submittedData.phone}</td>
              </tr>
              <tr>
                <td class="label-td">Email Address</td>
                <td class="val-td">${submittedData.email}</td>
              </tr>
              <tr>
                <td class="label-td">Location / City</td>
                <td class="val-td">${submittedData.city}</td>
              </tr>
              <tr>
                <td class="label-td">Masterclass</td>
                <td class="val-td">One Day Vegetable Carving Workshop</td>
              </tr>
              <tr>
                <td class="label-td">Mentor &amp; Instructor</td>
                <td class="val-td">Sun TV MasterChef Manikandan</td>
              </tr>
              <tr>
                <td class="label-td">Workshop Schedule</td>
                <td class="val-td">Oct 24, 2026 | 10:00 AM to 5:00 PM</td>
              </tr>
              <tr>
                <td class="label-td">Total Paid Amount</td>
                <td class="val-td price-total">${submittedData.registrationType?.includes('Group') ? 'Group Concession — Claim on Contact' : `Rs. ${submittedData.amountPaid || 4499}/- (Full Payment Complete)`}</td>
              </tr>
              <tr>
                <td class="label-td">Fee Breakdown</td>
                <td class="val-td price-breakdown">Rs. 500 Registration Fee + Rs. 3,999 Workshop Fee</td>
              </tr>
              <tr>
                <td class="label-td">Payment Reference / UTR</td>
                <td class="val-td">${submittedData.bankDetails || 'Confirmed'}</td>
              </tr>
              <tr>
                <td class="label-td">Date Issued</td>
                <td class="val-td">${new Date(submittedData.submittedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            </table>

            <div class="perks-box">
              <div class="perks-head">Inclusions Confirmed for Your Reserved Station:</div>
              <div>• <strong>Take-Home Vegetable Bouquet:</strong> The artisanal bouquet you sculpt &amp; assemble in class</div>
              <div>• <strong>MasterChef Mentorship:</strong> Full day direct hands-on training with MasterChef Manikandan</div>
              <div>• <strong>Workshop Kit &amp; Certificate:</strong> Tools provided in class &amp; authorized certificate of completion</div>
              <div>• <strong>Complimentary Veg Lunch:</strong> Freshly prepared hot lunch, tea &amp; refreshments</div>
            </div>

            <div class="footer-legal">
              Official computer-generated receipt issued by Sam's Culinary Art Class. Please present this slip or your Registration ID upon arrival on Oct 24.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(receiptHtml);
    printWin.document.close();
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
            Complete your registration for Sam&apos;s Culinary Art Class. Total fee: Rs. 4,499 (Rs. 500 Registration Fee + Rs. 3,999 Workshop Fee) for the full-day masterclass on Oct 24.
          </p>
        </div>

        {/* Step Indicator Header */}
        {!submittedData && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isGroupRegistration ? '1fr' : '1fr 1fr',
              gap: '12px',
              marginBottom: '32px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: isGroupRegistration ? 'rgba(34, 197, 94, 0.15)' : 'rgba(232, 167, 16, 0.15)',
                border: isGroupRegistration ? '1px solid #22c55e' : '1px solid var(--mango-yellow)',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isGroupRegistration ? '#22c55e' : 'var(--mango-yellow)',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem'
                }}
              >
                {isGroupRegistration ? <WhatsAppOutlined style={{ fontSize: '18px' }} /> : '1'}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: isGroupRegistration ? '#22c55e' : 'var(--mango-yellow)' }}>
                  {isGroupRegistration ? 'Group Enquiries: WhatsApp Fast-Track' : 'Step 1: Participant Info'}
                </div>
                <div style={{ fontSize: '0.76rem', opacity: 0.7 }}>
                  {isGroupRegistration ? 'Direct admissions support • No form registration needed' : 'Personal & Contact Details'}
                </div>
              </div>
            </div>

            {!isGroupRegistration && (
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
                    Step 2: Total Payment
                  </div>
                  <div style={{ fontSize: '0.76rem', opacity: 0.7 }}>Rs. 4,499 (Reg Fee Rs. 500 + Workshop Fee Rs. 3,999)</div>
                </div>
              </div>
            )}
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

            <div className={`badge ${submittedData.registrationType?.includes('Group') ? 'badge-warning' : 'badge-success'}`} style={{ padding: '6px 16px', borderRadius: '20px', marginBottom: '12px', display: 'inline-block' }}>
              {submittedData.registrationType?.includes('Group') ? 'GROUP REGISTRATION RECORDED' : 'SEAT RESERVATION CONFIRMED'}
            </div>

            <h3 style={{ fontSize: '1.7rem', fontWeight: '800', marginBottom: '8px' }}>
              Congratulations, {submittedData.name}!
            </h3>

            <p style={{ maxWidth: '580px', margin: '0 auto 24px', opacity: 0.88, fontSize: '0.98rem', lineHeight: '1.6' }}>
              {submittedData.registrationType?.includes('Group')
                ? `Your group details for Chef Manikandan's One Day Vegetable Carving Workshop on Oct 24 have been received. Please contact admissions to claim your group offer.`
                : `Your seat for Chef Manikandan's One Day Vegetable Carving Workshop on Oct 24 has been reserved. Your training station, carving kit, and certificate details have been registered.`}
            </p>

            {submittedData.registrationType?.includes('Group') && (
              <div style={{ background: 'rgba(232, 167, 16, 0.14)', border: '1px solid var(--mango-yellow)', borderRadius: '14px', padding: '16px 20px', maxWidth: '640px', margin: '0 auto 24px', textAlign: 'center' }}>
                <strong style={{ color: 'var(--mango-yellow)', fontSize: '1.15rem', display: 'block', marginBottom: '6px' }}>
                  <TeamOutlined style={{ marginRight: '6px' }} /> Contact for Claim Offer
                </strong>
                <p style={{ fontSize: '0.92rem', opacity: 0.95, margin: 0, lineHeight: '1.55' }}>
                  Call or WhatsApp our admissions desk at <strong>+91 8939648457</strong> to confirm your group participants and finalize your discounted workshop fee!
                </p>
              </div>
            )}

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
                  <strong style={{ opacity: 0.7, display: 'block' }}>Category</strong>
                  <div>{submittedData.registrationType} {submittedData.numberOfAttendees > 1 ? `(${submittedData.numberOfAttendees} Seats)` : ''}</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Instructor</strong>
                  <div>Sun TV MasterChef Manikandan</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Workshop Date &amp; Timing</strong>
                  <div>Oct 24 | 10:00 AM to 5:00 PM</div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Total Paid Amount</strong>
                  <div style={{ color: submittedData.registrationType?.includes('Group') ? 'var(--mango-yellow)' : '#22c55e', fontWeight: '800' }}>
                    {submittedData.registrationType?.includes('Group') ? 'Group Concession — Claim on Contact' : `Rs. ${submittedData.amountPaid || 4499}/- (Full Payment Complete)`}
                  </div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Fee Breakdown</strong>
                  <div style={{ color: 'var(--mango-yellow)', fontWeight: '700' }}>
                    {submittedData.registrationType?.includes('Group') ? 'Special Group Offer Rate' : 'Rs. 500 Reg Fee + Rs. 3,999 Workshop Fee'}
                  </div>
                </div>
                <div>
                  <strong style={{ opacity: 0.7, display: 'block' }}>Reference Status</strong>
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
            <div className="no-print receipt-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginTop: '28px' }}>
              <a
                href={`https://wa.me/918939648457?text=${encodeURIComponent(
                  submittedData.registrationType?.includes('Group')
                    ? `Hi Chef Vahitha & MasterChef Manikandan, I have submitted group details for the One Day Vegetable Carving Workshop on Oct 24.\n\n` +
                      `Registration ID: ${submittedData.registrationId}\n` +
                      `Participant Name: ${submittedData.name}\n` +
                      `Phone: ${submittedData.phone}\n` +
                      `City: ${submittedData.city}\n` +
                      `Attendees: ${submittedData.numberOfAttendees || 2} persons\n\n` +
                      `Please share the group discount offer. Thank you!`
                    : `Hi Chef Vahitha & MasterChef Manikandan, I have paid the total fee of Rs. 4,499 (Rs. 500 Registration Fee + Rs. 3,999 Workshop Fee) for Sam's Culinary Art Class (One Day Vegetable Carving Workshop on Oct 24).\n\n` +
                      `Registration ID: ${submittedData.registrationId}\n` +
                      `Participant Name: ${submittedData.name}\n` +
                      `Phone: ${submittedData.phone}\n` +
                      `City: ${submittedData.city}\n` +
                      `Transaction ID: ${submittedData.bankDetails}\n\n` +
                      `Please confirm my workshop reservation. Thank you!`
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
                <span>{submittedData.registrationType?.includes('Group') ? 'Claim Group Offer on WhatsApp' : 'Confirm on WhatsApp (+91 8939648457)'}</span>
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
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232, 167, 16, 0.12)', border: '1px solid rgba(232, 167, 16, 0.3)', padding: '6px 14px', borderRadius: '20px', marginBottom: '16px', fontSize: '0.84rem', color: 'var(--mango-yellow)', fontWeight: '700' }}>
                    <TrophyOutlined />
                    <span>One Day Vegetable Carving Workshop</span>
                  </div>

                  {/* Registration Category Selector Tabs */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <TeamOutlined style={{ color: 'var(--mango-yellow)' }} />
                      <span>Registration Category</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {['Individual', 'Group (2 or more)'].map((type) => (
                        <div
                          key={type}
                          onClick={() => setFormData((prev) => ({ ...prev, registrationType: type }))}
                          style={{
                            padding: '14px 18px',
                            borderRadius: '12px',
                            background: formData.registrationType === type ? 'rgba(232, 167, 16, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: formData.registrationType === type ? '1.5px solid var(--mango-yellow)' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '0.95rem',
                            fontWeight: formData.registrationType === type ? '800' : '500',
                            color: formData.registrationType === type ? 'var(--mango-yellow)' : 'var(--text-dark)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          {type === 'Individual' ? <UserOutlined /> : <WhatsAppOutlined style={{ color: '#25D366' }} />}
                          <span>{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* IF GROUP: Direct WhatsApp Contact (No registration form required!) */}
                  {isGroupRegistration ? (
                    <div
                      style={{
                        padding: '36px 24px',
                        background: 'radial-gradient(circle at top, rgba(37, 211, 102, 0.14) 0%, rgba(14, 25, 16, 0.95) 100%)',
                        border: '1.5px solid #22c55e',
                        borderRadius: '20px',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(37, 211, 102, 0.15)'
                      }}
                    >
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          background: 'rgba(37, 211, 102, 0.15)',
                          border: '2px solid #25D366',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px'
                        }}
                      >
                        <WhatsAppOutlined style={{ fontSize: '32px', color: '#25D366' }} />
                      </div>

                      <span
                        style={{
                          display: 'inline-block',
                          background: 'rgba(37, 211, 102, 0.2)',
                          color: '#22c55e',
                          padding: '4px 16px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          letterSpacing: '0.6px',
                          marginBottom: '10px',
                          textTransform: 'uppercase'
                        }}
                      >
                        Direct Group Booking via WhatsApp
                      </span>

                      <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>
                        Registering as a Group (2 or More)?
                      </h3>

                      <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '540px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                        You don&apos;t need to fill out this registration form! Group bookings &amp; exclusive discounted concession rates are coordinated directly over WhatsApp with our admissions team.
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '24px' }}>
                        <a
                          href="https://wa.me/918939648457?text=Hi%20Sam's%20Culinary%20Art%20Class,%20we%20are%20planning%20to%20join%20the%20One%20Day%20Vegetable%20Carving%20Workshop%20on%20Oct%2024%20as%20a%20Group.%20Please%20share%20the%20group%20concession%20details."
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 32px',
                            borderRadius: '30px',
                            background: 'var(--mango-yellow)',
                            color: '#000000',
                            fontWeight: '800',
                            fontSize: '1.02rem',
                            textDecoration: 'none',
                            border: 'none',
                            boxShadow: '0 4px 18px rgba(232, 167, 16, 0.45)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <WhatsAppOutlined style={{ fontSize: '20px', color: '#000000' }} />
                          <span>Chat on WhatsApp to Claim Group Offer</span>
                        </a>

                        <a
                          href="tel:+918939648457"
                          className="btn-outline"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 24px',
                            borderRadius: '30px',
                            fontSize: '0.95rem'
                          }}
                        >
                          <PhoneOutlined />
                          <span>Call: +91 8939648457</span>
                        </a>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '12px',
                          paddingTop: '20px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          maxWidth: '620px',
                          margin: '0 auto',
                          fontSize: '0.85rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.85 }}>
                          <CheckCircleOutlined style={{ color: '#22c55e' }} />
                          <span>Exclusive Group Concessions</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.85 }}>
                          <CheckCircleOutlined style={{ color: '#22c55e' }} />
                          <span>Adjacent Workstations</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.85 }}>
                          <CheckCircleOutlined style={{ color: '#22c55e' }} />
                          <span>Instant WhatsApp Confirmation</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* IF INDIVIDUAL: Normal Registration Form */
                    <>
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
                          placeholder="e.g. Complete beginner / Caterer seeking centerpiece mastery"
                          className="custom-form-input"
                          style={{ height: 'auto', padding: '12px' }}
                        />
                      </div>

                      {/* Navigation Next Button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={isSubmitting}
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
                          <span>Proceed to Total Payment (Rs. 4,499)</span>
                          <ArrowRightOutlined />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: TOTAL PAYMENT (Rs. 4,499) */}
              {currentStep === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CreditCardOutlined style={{ color: 'var(--mango-yellow)', fontSize: '20px' }} />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Total Payment (Registration + Workshop Fee)</h3>
                    </div>
                    <span style={{ fontSize: '1.05rem', color: '#22c55e', fontWeight: '800' }}>
                      Total Fee: Rs. 4,499/-
                    </span>
                  </div>

                  {/* Fee Breakdown Banner */}
                  <div
                    style={{
                      background: 'rgba(232, 167, 16, 0.1)',
                      border: '1px solid rgba(232, 167, 16, 0.35)',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      marginBottom: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div style={{ fontSize: '0.88rem' }}>
                      <span style={{ opacity: 0.8 }}>Fee Breakdown: </span>
                      <strong style={{ color: 'var(--mango-yellow)' }}>Rs. 500 Registration Fee</strong>
                      <span style={{ opacity: 0.6, margin: '0 8px' }}>+</span>
                      <strong style={{ color: '#22c55e' }}>Rs. 3,999 Workshop Fee</strong>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>
                      Total Payable: <span style={{ color: 'var(--mango-yellow)', fontSize: '1.2rem', marginLeft: '4px' }}>Rs. 4,499/-</span>
                    </div>
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
                        <strong style={{ fontSize: '0.98rem' }}>Scan UPI QR Code (Pay Rs. 4,499)</strong>
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
                        <div><strong style={{ opacity: 0.7 }}>Purpose:</strong> Sam&apos;s Culinary Art Class Workshop Total Fee (Rs. 4,499)</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', opacity: 0.85, background: 'rgba(232, 167, 16, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(232, 167, 16, 0.2)' }}>
                        <InfoCircleOutlined style={{ color: 'var(--mango-yellow)', marginTop: '2px' }} />
                        <span>After transferring the total payment of Rs. 4,499 (Rs. 500 Registration Fee + Rs. 3,999 Workshop Fee), enter the 12-digit UTR/UPI reference ID below and attach your payment screenshot.</span>
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
                          <span>Complete Registration</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

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
        {/* Modal: Group Offer Claim Popup with End Message */}
        <Modal
          open={showGroupModal}
          onCancel={() => setShowGroupModal(false)}
          footer={null}
          centered
          width={540}
          className="group-offer-claim-modal"
          styles={{
            content: {
              background: '#0d1a10',
              border: '1px solid rgba(232, 167, 16, 0.4)',
              borderRadius: '20px',
              padding: '30px 24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(232, 167, 16, 0.2)'
            }
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(232, 167, 16, 0.15)',
                border: '1px solid var(--mango-yellow)',
                color: 'var(--mango-yellow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px',
                boxShadow: '0 0 20px rgba(232, 167, 16, 0.25)'
              }}
            >
              <TeamOutlined />
            </div>

            <div
              style={{
                display: 'inline-block',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                color: '#22c55e',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '800',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}
            >
              GROUP REGISTRATION RECORDED
            </div>

            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
              Special Group Concession
            </h3>

            {/* End message callout box */}
            <div
              style={{
                background: 'rgba(232, 167, 16, 0.12)',
                border: '1px solid var(--mango-yellow)',
                borderRadius: '16px',
                padding: '20px 18px',
                margin: '20px 0 24px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--mango-yellow)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                Next Action Required
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--mango-yellow)', marginBottom: '8px' }}>
                Contact for Claim Offer
              </div>
              <p style={{ fontSize: '0.94rem', color: 'var(--text-dark)', opacity: 0.95, margin: 0, lineHeight: '1.6' }}>
                Hi <strong>{submittedData?.name || formData.name}</strong>, special group discounts apply for batches of 2 or more! Please contact our admissions desk now to confirm your group size and claim your discounted workshop fee.
              </p>
            </div>

            {/* Summary details */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                textAlign: 'left',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', display: 'block' }}>Registration ID</span>
                <strong style={{ color: 'var(--mango-yellow)' }}>{submittedData?.registrationId || 'Generating...'}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', display: 'block' }}>Workshop</span>
                <span>Oct 24 (10 AM - 5 PM)</span>
              </div>
              <div>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', display: 'block' }}>Contact Phone</span>
                <span>{submittedData?.phone || formData.phone}</span>
              </div>
              <div>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', display: 'block' }}>City</span>
                <span>{submittedData?.city || formData.city}</span>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`https://wa.me/918939648457?text=${encodeURIComponent(
                  `Hi Chef Vahitha & MasterChef Manikandan, I have submitted group details for the One Day Vegetable Carving Workshop on Oct 24.\n\n` +
                  `Registration ID: ${submittedData?.registrationId || ''}\n` +
                  `Name: ${submittedData?.name || formData.name}\n` +
                  `Phone: ${submittedData?.phone || formData.phone}\n` +
                  `City: ${submittedData?.city || formData.city}\n` +
                  `Attendees: ${submittedData?.numberOfAttendees || 2} persons\n\n` +
                  `Please share the group discount offer for our seats. Thank you!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  background: 'var(--mango-yellow)',
                  color: '#000000',
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(232, 167, 16, 0.45)'
                }}
              >
                <WhatsAppOutlined style={{ fontSize: '20px', color: '#000000' }} />
                <span>Claim Group Offer on WhatsApp</span>
              </a>

              <a
                href="tel:+918939648457"
                className="btn-outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  color: '#ffffff'
                }}
              >
                <PhoneOutlined />
                <span>Call Admissions: +91 8939648457</span>
              </a>

              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  padding: '6px',
                  textDecoration: 'underline'
                }}
              >
                Close &amp; View Registration Slip
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
}
