import React, { useState, useEffect } from 'react';
import { message, Modal, ConfigProvider, Pagination, DatePicker, Select, Image, theme as antdTheme } from 'antd';
import dayjs from 'dayjs';
import {
  LockOutlined,
  LogoutOutlined,
  FormOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
  ReloadOutlined,
  HomeOutlined,
  CreditCardOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  ZoomInOutlined,
  FileExcelOutlined,
  FilterOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  UserAddOutlined,
  TeamOutlined,
  PlusOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  CloseOutlined
} from '@ant-design/icons';
import {
  fetchWorkshopRegistrations,
  updateWorkshopRegistrationStatus,
  deleteWorkshopRegistrationRecord,
  submitWorkshopRegistration,
  uploadProofToCloudinary
} from '../services/workshopService';

export const STORAGE_KEY = 'sams_oneday_workshop_registrations';

export default function AdminPortal({ onClose }) {
  // Authentication Gate State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('sams_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registrations Ledger State (Empty array for production)
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending Verification' | 'Verified / Enrolled' | 'Follow-up'
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals & Details State
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [lightboxPreview, setLightboxPreview] = useState({ open: false, url: '', title: '' });

  // Offline & Group Registration Top Panel State
  const [showNewRegPanel, setShowNewRegPanel] = useState(false);
  const [isSubmittingNewReg, setIsSubmittingNewReg] = useState(false);
  const [newRegProofPreview, setNewRegProofPreview] = useState('');

  const initialNewRegForm = {
    name: '',
    phone: '',
    email: '',
    city: 'Chennai',
    registrationType: 'Individual',
    registrationSource: 'Offline Walk-in / Academy Desk',
    numberOfAttendees: 1,
    groupName: '',
    additionalMembers: '',
    purpose: 'One Day Vegetable Carving Workshop',
    amountPaid: 4499,
    feeBreakdown: 'Rs. 500 Reg Fee + Rs. 3,999 Workshop Fee',
    paymentMode: 'Cash (Paid at Academy Desk)',
    paymentStatus: 'Full Payment Complete (Rs. 4,499)',
    bankDetails: 'Cash Received at Academy Desk',
    proofImageUrl: '',
    notes: '',
    status: 'Verified / Enrolled'
  };

  const [newRegForm, setNewRegForm] = useState(initialNewRegForm);

  const [isLoading, setIsLoading] = useState(false);

  // Toggle or open registration panel above table and filter
  const handleToggleRegisterPanel = () => {
    setShowNewRegPanel((prev) => {
      const nextState = !prev;
      if (nextState) {
        setTimeout(() => {
          const el = document.getElementById('admin-register-panel');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
      return nextState;
    });
  };

  // Lock background window scroll only when applicant detail modal is open
  useEffect(() => {
    if (selectedApplicant) {
      const origHtmlOverflow = document.documentElement.style.overflow;
      const origBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.style.overflow = origBodyOverflow;
      };
    }
  }, [selectedApplicant]);

  // Load registrations from MongoDB Atlas or fallback to local storage
  const loadRegistrations = async () => {
    setIsLoading(true);
    try {
      const dbRecords = await fetchWorkshopRegistrations();
      if (Array.isArray(dbRecords)) {
        setRegistrations(dbRecords);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbRecords));
        return;
      }

      // If remote collection is currently unreachable, check localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRegistrations(parsed);
          return;
        }
      }
      setRegistrations([]);
    } catch (err) {
      console.warn('Error reading registrations from MongoDB Atlas:', err);
      setRegistrations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    loadRegistrations();

    // Listen for cross-component registration updates
    const handleStorageUpdate = () => {
      loadRegistrations();
    };
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('workshop-registration-updated', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('workshop-registration-updated', handleStorageUpdate);
    };
  }, []);

  // Save changes back to localStorage
  const saveRegistrations = (newList) => {
    setRegistrations(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new Event('workshop-registration-updated'));
  };

  // Login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Matching credentials from reference project
    const allowedEmails = [
      'admin@samsculinary.com',
      'samsculinaryartclass@gmail.com',
      'vahijeeva@gmail.com',
      'admin'
    ];
    const allowedPasswords = ['admin123'];

    if (
      allowedEmails.includes(cleanEmail) &&
      allowedPasswords.includes(cleanPass)
    ) {
      sessionStorage.setItem('sams_admin_auth', 'true');
      setIsLoggedIn(true);
      setLoginError('');
      message.success('Welcome to Sam’s Administration Hub!');
    } else {
      setLoginError('Invalid Admin Email or Password.');
    }
  };

  // Logout handler
  const handleAdminLogout = () => {
    sessionStorage.removeItem('sams_admin_auth');
    setIsLoggedIn(false);
    message.info('Logged out from Admin Portal.');
  };

  // Status Change handler
  const handleStatusChange = async (id, newStatus) => {
    const updated = registrations.map((r) => {
      if (r.id === id || r.registrationId === id) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    saveRegistrations(updated);

    if (selectedApplicant && (selectedApplicant.id === id || selectedApplicant.registrationId === id)) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }

    try {
      await updateWorkshopRegistrationStatus(id, newStatus);
    } catch (dbErr) {
      console.warn('MongoDB status update warning:', dbErr);
    }

    message.success(`Status updated to "${newStatus}" in MongoDB Atlas`);
  };

  // Delete attendee handler
  const handleDeleteRegistration = (record) => {
    if (!record) return;
    const id = record.registrationId || record.id;
    const name = record.name || 'this participant';

    Modal.confirm({
      title: 'Delete Attendee Record?',
      content: `Are you sure you want to permanently delete registration ${record.registrationId || id} for ${name}? This will remove the document from MongoDB Atlas and delete any uploaded payment proof screenshot from Cloudinary.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          message.loading({ content: 'Deleting from MongoDB Atlas & Cloudinary...', key: 'delKey' });
          await deleteWorkshopRegistrationRecord(id);

          const updated = registrations.filter(
            (r) => r.id !== id && r.registrationId !== id && r.registrationId !== record.registrationId && r.id !== record.id
          );
          saveRegistrations(updated);

          if (selectedApplicant && (selectedApplicant.id === id || selectedApplicant.registrationId === id || selectedApplicant.registrationId === record.registrationId)) {
            setSelectedApplicant(null);
          }
          message.success({ content: `Registration for ${name} permanently deleted.`, key: 'delKey' });
        } catch (err) {
          message.error({ content: 'Failed to delete record: ' + (err.message || 'Server error'), key: 'delKey' });
        }
      }
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const listToExport = filteredList.length > 0 ? filteredList : registrations;
    if (!listToExport || listToExport.length === 0) {
      message.info('No registered data available to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Registration Date',
      'Full Name',
      'Email Address',
      'Phone Number',
      'City / Location',
      'Registration Channel / Source',
      'Registration Type',
      'Attendees Count',
      'Group Name',
      'Additional Members',
      'Amount Paid (INR)',
      'Payment Method',
      'Payment Status',
      'Transaction Ref / UTR',
      'Roster Status',
      'Admin Notes'
    ];

    const rows = listToExport.map((r) => [
      `"${r.registrationId || r.id || ''}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.city || '').replace(/"/g, '""')}"`,
      `"${(r.registrationSource || 'Online Web Portal').replace(/"/g, '""')}"`,
      `"${(r.registrationType || 'Individual').replace(/"/g, '""')}"`,
      `"${r.numberOfAttendees || 1}"`,
      `"${(r.groupName || '').replace(/"/g, '""')}"`,
      `"${(r.additionalMembers || '').replace(/"/g, '""')}"`,
      `"${r.amountPaid || 500}"`,
      `"${(r.paymentMode || 'Online UPI').replace(/"/g, '""')}"`,
      `"${(r.paymentStatus || (r.status === 'Verified / Enrolled' ? 'Verified' : 'Pending')).replace(/"/g, '""')}"`,
      `"${(r.bankDetails || '').replace(/"/g, '""')}"`,
      `"${(r.status || 'Pending Verification').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Workshop_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`Exported ${listToExport.length} registration record(s) to CSV.`);
  };

  // Upload proof image for manual registration
  const handleNewRegProofUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error('Receipt image must be under 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      setNewRegProofPreview(base64);
      setNewRegForm((prev) => ({ ...prev, proofImageUrl: base64 }));
      try {
        message.loading({ content: 'Uploading proof image...', key: 'newRegImg' });
        const cdnUrl = await uploadProofToCloudinary(base64);
        if (cdnUrl) {
          setNewRegForm((prev) => ({ ...prev, proofImageUrl: cdnUrl }));
          message.success({ content: 'Proof attached successfully!', key: 'newRegImg' });
        }
      } catch (err) {
        console.warn('Cloudinary upload warning:', err);
        message.info({ content: 'Proof image attached locally.', key: 'newRegImg' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Admin Manual Registration (Offline or Group)
  const handleCreateNewRegistration = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!newRegForm.name.trim()) {
      message.error('Please enter the participant name or group contact person.');
      return;
    }
    if (!newRegForm.phone.trim()) {
      message.error('Please enter the phone / WhatsApp number.');
      return;
    }
    if (!newRegForm.city.trim()) {
      message.error('Please enter the city or location.');
      return;
    }

    setIsSubmittingNewReg(true);
    try {
      const regId = 'SAMS-' + Math.floor(100000 + Math.random() * 900000);
      const isGroup = newRegForm.registrationType.includes('Group');

      const record = {
        id: regId,
        registrationId: regId,
        name: newRegForm.name.trim(),
        phone: newRegForm.phone.trim(),
        email: newRegForm.email.trim() || 'offline@samsculinary.com',
        city: newRegForm.city.trim(),
        registrationType: newRegForm.registrationType,
        registrationSource: newRegForm.registrationSource || (isGroup ? 'Group WhatsApp / Direct Process' : 'Offline Walk-in / Academy Desk'),
        numberOfAttendees: Number(newRegForm.numberOfAttendees) || 1,
        groupName: newRegForm.groupName.trim() || '',
        additionalMembers: newRegForm.additionalMembers.trim() || '',
        purpose: 'One Day Vegetable Carving Workshop',
        amountPaid: Number(newRegForm.amountPaid) || 4499,
        feeBreakdown: newRegForm.feeBreakdown || (Number(newRegForm.amountPaid) === 4499 ? 'Rs. 500 Reg Fee + Rs. 3,999 Workshop Fee' : `Agreed Fee: Rs. ${newRegForm.amountPaid}`),
        paymentMode: newRegForm.paymentMode,
        paymentStatus: newRegForm.paymentStatus,
        bankDetails: newRegForm.bankDetails.trim() || newRegForm.paymentMode,
        proofImageUrl: newRegForm.proofImageUrl || '',
        notes: newRegForm.notes.trim() || '',
        status: newRegForm.status || 'Verified / Enrolled',
        submittedAt: new Date().toISOString()
      };

      try {
        await submitWorkshopRegistration(record);
      } catch (dbErr) {
        console.warn('MongoDB submission fallback:', dbErr);
      }

      const updated = [record, ...registrations];
      saveRegistrations(updated);

      message.success(`Successfully enrolled ${record.name} (${record.registrationId})!`);
      setNewRegForm(initialNewRegForm);
      setNewRegProofPreview('');
      setShowNewRegPanel(false);
    } catch (err) {
      console.error('Error creating registration:', err);
      message.error('Failed to create registration. Please check fields.');
    } finally {
      setIsSubmittingNewReg(false);
    }
  };

  // Filter and search logic
  const filteredList = registrations.filter((item) => {
    // 1. Search Query Filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchPhone = (item.phone || '').toLowerCase().includes(q);
      const matchEmail = (item.email || '').toLowerCase().includes(q);
      const matchCity = (item.city || '').toLowerCase().includes(q);
      const matchId = (item.registrationId || item.id || '').toLowerCase().includes(q);
      const matchTrans = (item.bankDetails || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchCity && !matchId && !matchTrans) {
        return false;
      }
    }

    // 2. Status Filter
    const itemStatus = item.status || 'Pending Verification';
    if (activeTab !== 'All' && itemStatus !== activeTab) {
      return false;
    }

    // 3. Date Range Filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const rawDate = item.submittedAt || item.createdAt || item.date;
      if (!rawDate) return false;
      const recordDate = dayjs(rawDate);
      if (!recordDate.isValid()) return false;
      if (
        recordDate.isBefore(dateRange[0].startOf('day')) ||
        recordDate.isAfter(dateRange[1].endOf('day'))
      ) {
        return false;
      }
    }

    return true;
  });

  // Clamp current page if records count shrinks
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredList.length / pageSize));
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
  }, [filteredList.length, currentPage]);

  const paginatedList = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Summary Metrics calculations
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => (r.status || 'Pending Verification') === 'Pending Verification').length;
  const verifiedCount = registrations.filter((r) => r.status === 'Verified / Enrolled').length;
  const followupCount = registrations.filter((r) => r.status === 'Follow-up').length;
  const totalFees = registrations.reduce((sum, r) => sum + (Number(r.amountPaid) || 500), 0);

  // Status badge styling helper
  const renderStatusBadge = (status) => {
    const s = status || 'Pending Verification';
    if (s === 'Verified / Enrolled') {
      return (
        <span className="admin-status-badge badge-verified">
          <CheckCircleOutlined /> Verified
        </span>
      );
    }
    if (s === 'Follow-up') {
      return (
        <span className="admin-status-badge badge-followup">
          <ClockCircleOutlined /> Follow-up
        </span>
      );
    }
    return (
      <span className="admin-status-badge badge-pending">
        <ClockCircleOutlined /> Pending Verification
      </span>
    );
  };

  // 1. LOGIN GATE VIEW
  if (!isLoggedIn) {
    return (
      <div
        className="admin-login-fullscreen"
        style={{
          minHeight: '100dvh',
          width: '100%',
          background: '#070d08',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 16px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div
            className="glass-panel admin-login-card"
            style={{
              padding: '38px 28px',
              textAlign: 'center',
              borderRadius: '20px',
              border: '1px solid rgba(232, 167, 16, 0.35)',
              background: 'rgba(12, 22, 14, 0.96)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)'
            }}
          >
            {/* Header Badge & Crest */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '18px' }}>
              <img
                src="/logo-circle.svg"
                alt="Sam's Crest"
                style={{ width: '46px', height: '46px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = '/logo.webp';
                }}
              />
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(232, 167, 16, 0.15)',
                  border: '1.5px solid var(--mango-yellow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  color: 'var(--mango-yellow)'
                }}
              >
                <LockOutlined />
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(232, 167, 16, 0.12)',
                color: 'var(--mango-yellow)',
                padding: '3px 12px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: '700',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}
            >
              <span>ACADEMY CONTROL CENTER</span>
            </div>

            <h2 className="gradient-title-green" style={{ fontSize: '1.75rem', margin: '0 0 8px 0', fontWeight: '800' }}>
              Admin Portal Access
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>
              Enter administrator credentials to view registered workshop participants, payment proofs, and admissions roster.
            </p>

            {loginError && (
              <div
                style={{
                  background: 'rgba(255, 77, 79, 0.15)',
                  border: '1px solid rgba(255, 77, 79, 0.4)',
                  color: '#ff7875',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  marginBottom: '18px',
                  textAlign: 'left'
                }}
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.84rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                  Admin Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="admin@samsculinary.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="admin-login-input"
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.84rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="admin-login-input"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '8px',
                  justifyContent: 'center',
                  padding: '12px 20px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--mango-yellow)',
                  color: '#0b100c',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(232, 167, 16, 0.35)'
                }}
              >
                <LockOutlined />
                <span>Unlock Control Center</span>
              </button>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px'
                  }}
                >
                  <HomeOutlined />
                  <span>Return to Workshop Landing Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN ADMIN CONTROL CENTER
  return (
    <div className="admin-webinars-page section-padding" style={{ minHeight: '100vh', background: '#070d08', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>

        {/* Top Header Row */}
        <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', paddingTop: '20px' }}>
          <div>
            <div className="admin-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(232, 167, 16, 0.12)', color: 'var(--mango-yellow)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '8px' }}>
              <LockOutlined />
              <span>ACADEMY CONTROL CENTER</span>
            </div>
            <h1 className="section-title gradient-title-green" style={{ fontSize: '2.1rem', margin: '4px 0 6px 0', fontWeight: '800' }}>
              Workshop Registrations Hub
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
              Live attendee submissions, Rs. 500 registration fee verification, UPI / UTR proofs, and seating roster.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleToggleRegisterPanel}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: '30px',
                background: showNewRegPanel ? 'rgba(255, 255, 255, 0.1)' : 'var(--green-medium)',
                color: '#ffffff',
                border: showNewRegPanel ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(34, 197, 94, 0.4)',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: showNewRegPanel ? 'none' : '0 4px 16px rgba(25, 65, 33, 0.4)'
              }}
            >
              {showNewRegPanel ? <CloseOutlined /> : <UserAddOutlined />}
              <span>{showNewRegPanel ? 'Close Registration Form' : '+ Register Offline / Group'}</span>
            </button>

            <button
              type="button"
              onClick={loadRegistrations}
              className="btn-outline"
              title="Refresh Registrations"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: '#fff' }}
            >
              <ReloadOutlined spin={isLoading} />
              <span>{isLoading ? 'Fetching...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: '#fff' }}
            >
              <HomeOutlined />
              <span>View Website</span>
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', background: 'rgba(255, 77, 79, 0.12)', border: '1px solid #ff4d4f', color: '#ff4d4f' }}
            >
              <LogoutOutlined />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Metric Cards */}
        <div className="admin-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          {/* Total Registrations */}
          <div className="metric-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(232, 167, 16, 0.15)', color: 'var(--mango-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              <FormOutlined />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: '800', color: 'var(--mango-yellow)' }}>
                {totalCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Registrations</span>
            </div>
          </div>

          {/* Pending Verification */}
          <div className="metric-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255, 77, 79, 0.15)', color: '#ff4d4f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              <ClockCircleOutlined />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: '800', color: '#ff4d4f' }}>
                {pendingCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Verification</span>
            </div>
          </div>

          {/* Verified / Enrolled */}
          <div className="metric-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(52, 199, 89, 0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              <CheckCircleOutlined />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: '800', color: '#22c55e' }}>
                {verifiedCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified / Enrolled</span>
            </div>
          </div>

          {/* Total Registration Fees Collected */}
          <div className="metric-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(232, 167, 16, 0.15)', color: 'var(--mango-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              <DollarOutlined />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: '800', color: 'var(--mango-yellow)' }}>
                ₹{totalFees.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registration Fees Collected</span>
            </div>
          </div>
        </div>

        {/* Ledger & Table Panel */}
        <div className="admin-table-container glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(15, 23, 17, 0.85)', border: '1px solid rgba(232, 167, 16, 0.2)' }}>

          {/* Action Row: Tabs (Top) & Export CSV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
            <div className="admin-tabs-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: 'All', count: totalCount },
                { label: 'Pending Verification', count: pendingCount },
                { label: 'Verified / Enrolled', count: verifiedCount },
                { label: 'Follow-up', count: followupCount }
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.label);
                    setCurrentPage(1);
                  }}
                  className={`admin-tab-btn ${activeTab === tab.label ? 'active' : ''}`}
                  style={{
                    background: activeTab === tab.label ? 'var(--mango-yellow)' : 'rgba(255,255,255,0.05)',
                    color: activeTab === tab.label ? '#0b100c' : '#fff',
                    border: '1px solid ' + (activeTab === tab.label ? 'var(--mango-yellow)' : 'rgba(255,255,255,0.1)'),
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: activeTab === tab.label ? '700' : '500',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    background: activeTab === tab.label ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.12)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.74rem'
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleToggleRegisterPanel}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  background: showNewRegPanel ? 'rgba(255, 255, 255, 0.1)' : 'var(--green-medium)',
                  color: '#ffffff',
                  border: showNewRegPanel ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(34, 197, 94, 0.4)',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: showNewRegPanel ? 'none' : '0 4px 12px rgba(25, 65, 33, 0.35)'
                }}
              >
                {showNewRegPanel ? <CloseOutlined /> : <UserAddOutlined />}
                <span>{showNewRegPanel ? 'Close Form' : '+ Register Attendee'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-outline"
                title="Download Excel / CSV roster of registered attendees"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontWeight: '600',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                <FileExcelOutlined />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* INLINE REGISTRATION PANEL: TOP OF TABLE & FILTER */}
          {showNewRegPanel && (
            <div
              id="admin-register-panel"
              style={{
                marginBottom: '26px',
                background: 'linear-gradient(145deg, #0a140d 0%, #112015 100%)',
                border: '1.5px solid rgba(34, 197, 94, 0.45)',
                borderRadius: '16px',
                padding: '24px 28px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(34, 197, 94, 0.2)'
              }}
            >
              {/* Header with Title and Close Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontSize: '20px' }}>
                    <UserAddOutlined />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#ffffff' }}>
                      Register Attendee (Offline / Group Process)
                    </h2>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                      Enroll offline walk-ins at desk or WhatsApp group enquiries directly into the workshop roster.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowNewRegPanel(false);
                    setNewRegForm(initialNewRegForm);
                    setNewRegProofPreview('');
                  }}
                  className="btn-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 18px',
                    borderRadius: '20px',
                    fontSize: '0.84rem',
                    fontWeight: '600',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
                  title="Close Form"
                >
                  <CloseOutlined />
                  <span>Close</span>
                </button>
              </div>

              <form onSubmit={handleCreateNewRegistration}>
                {/* Channel Selector - 2 Options Only: Individual & Group */}
                <div style={{ marginBottom: '18px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--mango-yellow)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>
                    Registration Channel &amp; Process
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {[
                      { type: 'Individual', source: 'Offline Walk-in / Academy Desk', label: 'Individual (Offline Walk-in)' },
                      { type: 'Group Process', source: 'Group Enquiry / WhatsApp Process', label: 'Group Booking / Enquiry' }
                    ].map((chan) => {
                      const isSelected = chan.type === 'Group Process'
                        ? newRegForm.registrationType === 'Group Process'
                        : (newRegForm.registrationType === 'Individual' || newRegForm.registrationType === 'Offline Walk-in');

                      return (
                        <button
                          key={chan.type}
                          type="button"
                          onClick={() => setNewRegForm((prev) => ({
                            ...prev,
                            registrationType: chan.type,
                            registrationSource: chan.source,
                            numberOfAttendees: chan.type === 'Group Process' ? (prev.numberOfAttendees > 1 ? prev.numberOfAttendees : 2) : 1
                          }))}
                          style={{
                            padding: '12px 18px',
                            borderRadius: '10px',
                            background: isSelected ? 'var(--green-medium)' : 'rgba(0, 0, 0, 0.35)',
                            border: isSelected ? '1.5px solid #22c55e' : '1.5px solid rgba(255, 255, 255, 0.25)',
                            color: '#ffffff',
                            fontWeight: isSelected ? '700' : '500',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: isSelected ? '0 4px 14px rgba(25, 65, 33, 0.45)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isSelected && <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '16px' }} />}
                          <span>{chan.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Participant Contact Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                      Participant / Contact Person Name <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newRegForm.name}
                      onChange={(e) => setNewRegForm({ ...newRegForm, name: e.target.value })}
                      className="admin-modal-field admin-login-input"
                      style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                      Phone / WhatsApp Number <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={newRegForm.phone}
                      onChange={(e) => setNewRegForm({ ...newRegForm, phone: e.target.value })}
                      className="admin-modal-field admin-login-input"
                      style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. attendee@gmail.com (optional)"
                      value={newRegForm.email}
                      onChange={(e) => setNewRegForm({ ...newRegForm, email: e.target.value })}
                      className="admin-modal-field admin-login-input"
                      style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                      City / Location <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chennai, Kodambakkam"
                      value={newRegForm.city}
                      onChange={(e) => setNewRegForm({ ...newRegForm, city: e.target.value })}
                      className="admin-modal-field admin-login-input"
                      style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                    />
                  </div>
                </div>

                {/* Group / Seating Details */}
                <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1.5px solid rgba(34, 197, 94, 0.35)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: '700', fontSize: '0.88rem', marginBottom: '12px' }}>
                    <TeamOutlined />
                    <span>Group &amp; Seating Roster Settings</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Number of Participants / Seats
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={newRegForm.numberOfAttendees}
                        onChange={(e) => setNewRegForm({ ...newRegForm, numberOfAttendees: Number(e.target.value) || 1 })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Group / Company / College Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SRM Hotel Mgmt Batch / Kumar &amp; Family"
                        value={newRegForm.groupName}
                        onChange={(e) => setNewRegForm({ ...newRegForm, groupName: e.target.value })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Additional Participant Names (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1. Anitha, 2. Vignesh, 3. Priya"
                        value={newRegForm.additionalMembers}
                        onChange={(e) => setNewRegForm({ ...newRegForm, additionalMembers: e.target.value })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Masterclass Badge info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', background: 'rgba(232, 167, 16, 0.08)', border: '1px solid rgba(232, 167, 16, 0.25)', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.84rem' }}>
                  <div>
                    <strong style={{ color: 'var(--mango-yellow)' }}>One Day Vegetable Carving Workshop</strong>
                    <span style={{ opacity: 0.7, marginLeft: '8px' }}>• Oct 24 (10:00 AM to 5:00 PM)</span>
                  </div>
                  <div style={{ color: '#22c55e', fontWeight: '700' }}>
                    Mentor: Sun TV MasterChef Manikandan
                  </div>
                </div>

                {/* Payment Details Grid */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--mango-yellow)', fontWeight: '800', display: 'block', marginBottom: '12px' }}>
                    Payment &amp; Financial Accounting
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Total Amount Collected (₹) <span style={{ color: '#ff4d4f' }}>*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={newRegForm.amountPaid}
                        onChange={(e) => setNewRegForm({ ...newRegForm, amountPaid: Number(e.target.value) || 0 })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.95rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#22c55e', fontWeight: '800' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Payment Method
                      </label>
                      <select
                        value={newRegForm.paymentMode}
                        onChange={(e) => setNewRegForm({
                          ...newRegForm,
                          paymentMode: e.target.value,
                          bankDetails: e.target.value.includes('Cash') ? 'Cash Received at Academy Desk' : newRegForm.bankDetails
                        })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.86rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                      >
                        <option value="Cash (Paid at Academy Desk)">Cash (Paid at Academy Desk)</option>
                        <option value="GPay / PhonePe UPI">GPay / PhonePe / Paytm UPI</option>
                        <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT / IMPS)</option>
                        <option value="Card Swipe / POS">Card Swipe / POS Terminal</option>
                        <option value="Pending - Pay on Arrival">Pending - Pay on Arrival (Oct 24)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Payment Status
                      </label>
                      <select
                        value={newRegForm.paymentStatus}
                        onChange={(e) => setNewRegForm({ ...newRegForm, paymentStatus: e.target.value })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.86rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                      >
                        <option value="Full Payment Complete (Rs. 4,499)">Full Payment Complete (Rs. 4,499)</option>
                        <option value="Advance / Reg Fee Paid (Rs. 500)">Advance / Reg Fee Paid (Rs. 500)</option>
                        <option value="Custom Group Concession Paid">Custom Group Concession Paid</option>
                        <option value="Pending at Venue">Pending at Venue</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Transaction / UTR / Receipt ID <span style={{ color: '#ff4d4f' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CASH-DESK-01 / UPI Ref ID"
                        value={newRegForm.bankDetails}
                        onChange={(e) => setNewRegForm({ ...newRegForm, bankDetails: e.target.value })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Roster Status
                      </label>
                      <select
                        value={newRegForm.status}
                        onChange={(e) => setNewRegForm({ ...newRegForm, status: e.target.value })}
                        className="admin-modal-field admin-login-input"
                        style={{ width: '100%', padding: '10px 14px', fontSize: '0.86rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                      >
                        <option value="Verified / Enrolled">Verified / Enrolled (Seat Confirmed)</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Follow-up">Follow-up</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Payment Proof Screenshot / Bill (Optional)
                      </label>
                      <div style={{
                        border: '1.5px dashed rgba(255, 255, 255, 0.45)',
                        borderRadius: '8px',
                        padding: '7px 12px',
                        backgroundColor: '#18261c'
                      }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNewRegProofUpload}
                          style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', width: '100%', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>

                  {newRegProofPreview && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(34, 197, 94, 0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                      <img
                        src={newRegProofPreview}
                        alt="Proof Preview"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #22c55e' }}
                      />
                      <span style={{ fontSize: '0.82rem', color: '#22c55e', fontWeight: '600' }}>Proof image attached &amp; ready to record</span>
                    </div>
                  )}
                </div>

                {/* Special Notes */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                    Admin Notes / Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Vegetarian lunch confirmed, requires left-handed carving station, group discount approved by Chef Vahitha"
                    value={newRegForm.notes}
                    onChange={(e) => setNewRegForm({ ...newRegForm, notes: e.target.value })}
                    className="admin-modal-field admin-login-input"
                    style={{ width: '100%', height: 'auto', padding: '10px 14px', fontSize: '0.88rem', border: '1.5px solid rgba(255, 255, 255, 0.5)', backgroundColor: '#18261c', borderRadius: '8px', color: '#ffffff' }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewRegPanel(false);
                      setNewRegForm(initialNewRegForm);
                      setNewRegProofPreview('');
                    }}
                    className="btn-outline"
                    style={{ padding: '9px 22px', borderRadius: '30px', fontSize: '0.88rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingNewReg}
                    className="btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 30px',
                      borderRadius: '30px',
                      background: 'var(--green-medium)',
                      color: '#ffffff',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      fontWeight: '700',
                      fontSize: '0.94rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(25, 65, 33, 0.4)'
                    }}
                  >
                    <CheckCircleOutlined />
                    <span>{isSubmittingNewReg ? 'Enrolling...' : 'Confirm & Register Attendee'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Top Controls Toolbar: Search, Status Dropdown, Date Range Picker, Clear Filters */}
          <div
            className="admin-filters-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '14px 16px',
              marginBottom: '22px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px', height: '38px', display: 'flex', alignItems: 'center' }}>
              <SearchOutlined style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: '15px', zIndex: 2, pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search name, phone, city, UTR..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="admin-search-input"
                style={{
                  width: '100%',
                  height: '38px',
                  padding: '0 12px 0 36px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  lineHeight: '38px'
                }}
              />
            </div>

            {/* Status Dropdown Filter */}
            <div style={{ minWidth: '190px', flex: '0 1 210px' }}>
              <ConfigProvider
                theme={{
                  algorithm: antdTheme.darkAlgorithm,
                  token: {
                    colorPrimary: '#e8a710',
                    colorBgContainer: 'rgba(255, 255, 255, 0.06)',
                    colorBgElevated: '#121b14',
                    colorBorder: 'rgba(255, 255, 255, 0.15)',
                    colorText: '#ffffff',
                    colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 10,
                    controlHeight: 38
                  },
                  components: {
                    Select: {
                      selectorBg: 'rgba(255, 255, 255, 0.06)',
                      colorText: '#ffffff',
                      colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                      colorBorder: 'rgba(255, 255, 255, 0.15)',
                      colorPrimaryHover: '#e8a710',
                      controlItemBgActive: 'rgba(232, 167, 16, 0.25)',
                      controlItemBgHover: 'rgba(232, 167, 16, 0.12)'
                    }
                  }
                }}
              >
                <Select
                  value={activeTab}
                  onChange={(val) => {
                    setActiveTab(val);
                    setCurrentPage(1);
                  }}
                  className="admin-status-select"
                  style={{ width: '100%' }}
                  suffixIcon={<FilterOutlined style={{ color: 'var(--mango-yellow)' }} />}
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    { value: 'Pending Verification', label: 'Pending Verification' },
                    { value: 'Verified / Enrolled', label: 'Verified / Enrolled' },
                    { value: 'Follow-up', label: 'Follow-up' }
                  ]}
                />
              </ConfigProvider>
            </div>

            {/* Date Range Picker Filter */}
            <div style={{ minWidth: '250px', flex: '0 1 280px' }}>
              <ConfigProvider
                theme={{
                  algorithm: antdTheme.darkAlgorithm,
                  token: {
                    colorPrimary: '#e8a710',
                    colorBgContainer: 'rgba(255, 255, 255, 0.06)',
                    colorBgElevated: '#121b14',
                    colorBorder: 'rgba(255, 255, 255, 0.15)',
                    colorText: '#ffffff',
                    colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 10,
                    controlHeight: 38
                  },
                  components: {
                    DatePicker: {
                      colorBgContainer: 'rgba(255, 255, 255, 0.06)',
                      colorText: '#ffffff',
                      colorTextPlaceholder: 'rgba(255, 255, 255, 0.45)',
                      colorBorder: 'rgba(255, 255, 255, 0.15)',
                      cellActiveWithRangeBg: 'rgba(232, 167, 16, 0.25)',
                      cellHoverWithRangeBg: 'rgba(232, 167, 16, 0.12)'
                    }
                  }
                }}
              >
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange(dates);
                    setCurrentPage(1);
                  }}
                  className="admin-range-picker"
                  format="YYYY-MM-DD"
                  placeholder={['Start Date', 'End Date']}
                  style={{ width: '100%' }}
                  allowClear={true}
                  suffixIcon={<CalendarOutlined style={{ color: 'var(--mango-yellow)' }} />}
                />
              </ConfigProvider>
            </div>

            {/* Reset / Clear Filters Button */}
            {(searchQuery || dateRange || activeTab !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setDateRange(null);
                  setActiveTab('All');
                  setCurrentPage(1);
                }}
                className="btn-outline"
                title="Clear all active filters"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 77, 79, 0.1)',
                  border: '1px solid rgba(255, 77, 79, 0.3)',
                  color: '#ff7875',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  height: '38px',
                  whiteSpace: 'nowrap'
                }}
              >
                <CloseCircleOutlined />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Registrations Table */}
          {filteredList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <FormOutlined style={{ fontSize: '46px', opacity: 0.4, color: 'var(--mango-yellow)', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.15rem', color: '#fff', margin: '4px 0 8px 0' }}>
                No registrations found
              </h4>
              <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 16px' }}>
                {searchQuery || dateRange || activeTab !== 'All'
                  ? 'No participants match your active search or filter criteria.'
                  : 'Workshop participant submissions will appear here automatically.'}
              </p>
              {(searchQuery || dateRange || activeTab !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setDateRange(null);
                    setActiveTab('All');
                    setCurrentPage(1);
                  }}
                  className="btn-outline"
                  style={{ padding: '6px 16px', borderRadius: '16px' }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="admin-table-responsive" style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '12px 14px' }}>Reg ID</th>
                      <th style={{ padding: '12px 14px' }}>Date</th>
                      <th style={{ padding: '12px 14px' }}>Participant &amp; City</th>
                      <th style={{ padding: '12px 14px' }}>Contact Details</th>
                      <th style={{ padding: '12px 14px' }}>Payment &amp; UTR</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.map((app) => (
                      <tr key={app.id || app.registrationId} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {/* Reg ID & Channel */}
                        <td style={{ padding: '14px' }}>
                          <strong style={{ color: 'var(--mango-yellow)', fontSize: '0.92rem' }}>
                            {app.registrationId || app.id}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {app.registrationSource && app.registrationSource.includes('Walk-in') && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)', fontWeight: '600' }}>
                                Offline Desk
                              </span>
                            )}
                            {app.registrationType && app.registrationType.includes('Group') && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: '600' }}>
                                Group ({app.numberOfAttendees || 2})
                              </span>
                            )}
                            {app.registrationSource && app.registrationSource.includes('Telephonic') && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(232, 167, 16, 0.15)', color: 'var(--mango-yellow)', border: '1px solid rgba(232, 167, 16, 0.3)', fontWeight: '600' }}>
                                Phone Call
                              </span>
                            )}
                            {(!app.registrationSource || app.registrationSource.includes('Online')) && (
                              <span style={{ fontSize: '0.72rem', opacity: 0.65 }}>
                                {app.registrationType || 'Individual'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '14px', whiteSpace: 'nowrap', opacity: 0.85 }}>
                          <div>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Today'}</div>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                            {app.submittedAt ? new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </td>

                        {/* Participant & City */}
                        <td style={{ padding: '14px' }}>
                          <strong style={{ display: 'block', fontSize: '0.94rem', color: '#fff' }}>
                            {app.name}
                          </strong>
                          {app.groupName && (
                            <span style={{ display: 'block', fontSize: '0.76rem', color: '#38bdf8', fontWeight: '500' }}>
                              Group: {app.groupName}
                            </span>
                          )}
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', opacity: 0.75, marginTop: '3px' }}>
                            <EnvironmentOutlined style={{ color: 'var(--mango-yellow)' }} />
                            <span>{app.city || 'Chennai'}</span>
                          </span>
                        </td>

                        {/* Contact */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <a
                              href={`https://wa.me/${(app.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(app.name)}!%20Regarding%20your%20registration%20(${app.registrationId || app.id})%20for%20Chef%20Manikandan's%20One%20Day%20Workshop.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              style={{ color: '#25D366', fontWeight: '600', textDecoration: 'none' }}
                            >
                              <WhatsAppOutlined /> {app.phone}
                            </a>
                          </div>
                          <div style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: '3px' }}>
                            <a href={`mailto:${app.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {app.email}
                            </a>
                          </div>
                        </td>

                        {/* Payment & UTR */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {app.proofImageUrl ? (
                              <img
                                src={app.proofImageUrl}
                                alt="Proof"
                                style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--mango-yellow)', cursor: 'pointer' }}
                                onClick={() => setLightboxPreview({ open: true, url: app.proofImageUrl, title: `${app.name} - Payment Screenshot` })}
                                title="Click to view full screenshot"
                              />
                            ) : (
                              <div style={{ width: '42px', height: '42px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', opacity: 0.4 }}>
                                <CreditCardOutlined />
                              </div>
                            )}
                            <div>
                              <strong style={{ color: '#22c55e', fontSize: '0.88rem', display: 'block' }}>
                                ₹{Number(app.amountPaid || 500).toLocaleString('en-IN')} Paid
                              </strong>
                              <span style={{ fontSize: '0.74rem', opacity: 0.75, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }} title={`${app.paymentMode || ''} - ${app.bankDetails || ''}`}>
                                {app.paymentMode ? `${app.paymentMode.split(' ')[0]} • ` : ''}{app.bankDetails || 'UTR pending'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px' }}>
                          {renderStatusBadge(app.status)}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            {/* View Detail Modal */}
                            <button
                              type="button"
                              onClick={() => setSelectedApplicant(app)}
                              className="action-btn"
                              title="View Full Application Details"
                              style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <EyeOutlined />
                            </button>

                            {/* Direct WhatsApp */}
                            <a
                              href={`https://wa.me/${(app.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(app.name)}!%20Regarding%20your%20registration%20(${app.registrationId || app.id})%20for%20Chef%20Manikandan's%20One%20Day%20Workshop.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-btn"
                              title="Direct WhatsApp"
                              style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                            >
                              <WhatsAppOutlined />
                            </a>

                            {/* Quick Verify Button if pending */}
                            {app.status !== 'Verified / Enrolled' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(app.id || app.registrationId, 'Verified / Enrolled')}
                                className="action-btn"
                                title="Mark as Verified & Confirmed"
                                style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(52, 199, 89, 0.15)', border: '1px solid #22c55e', color: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <CheckOutlined />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteRegistration(app)}
                              className="action-btn"
                              title="Delete Record"
                              style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255, 77, 79, 0.12)', border: '1px solid #ff4d4f', color: '#ff4d4f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <DeleteOutlined />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination (10 records per page) */}
              {filteredList.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginTop: '24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '16px'
                  }}
                >
                  <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.86rem' }}>
                    Showing <strong style={{ color: 'var(--mango-yellow)' }}>{Math.min((currentPage - 1) * pageSize + 1, filteredList.length)}</strong>–<strong style={{ color: 'var(--mango-yellow)' }}>{Math.min(currentPage * pageSize, filteredList.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredList.length}</strong> attendees
                    {filteredList.length !== registrations.length && (
                      <span style={{ marginLeft: '6px', color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.8rem' }}>
                        (filtered from {registrations.length} total)
                      </span>
                    )}
                  </div>

                  <ConfigProvider
                    theme={{
                      algorithm: antdTheme.darkAlgorithm,
                      token: {
                        colorPrimary: '#e8a710',
                        colorBgContainer: 'rgba(255, 255, 255, 0.05)',
                        colorText: '#ffffff'
                      }
                    }}
                  >
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredList.length}
                      showSizeChanger={false}
                      onChange={(page) => {
                        setCurrentPage(page);
                        const tableEl = document.querySelector('.admin-table-container');
                        if (tableEl) {
                          tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    />
                  </ConfigProvider>
                </div>
              )}
            </>
          )}
        </div>

        {/* 3. MODAL: APPLICANT FULL DETAILS VIEW */}
        <ConfigProvider
          theme={{
            algorithm: antdTheme.darkAlgorithm,
            token: {
              colorPrimary: '#e8a710',
              colorBgElevated: '#101712',
              colorBorderSecondary: 'rgba(232, 167, 16, 0.3)',
              colorText: '#ffffff',
              borderRadiusLG: 16
            }
          }}
        >
          <Modal
            open={!!selectedApplicant}
            onCancel={() => setSelectedApplicant(null)}
            footer={null}
            width={720}
            centered
            title={
              selectedApplicant ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--mango-yellow)', fontWeight: '700' }}>
                    Attendee File: {selectedApplicant.registrationId || selectedApplicant.id}
                  </span>
                  {renderStatusBadge(selectedApplicant.status)}
                </div>
              ) : null
            }
          >
            {selectedApplicant && (
              <div style={{ padding: '8px 0 16px' }}>
                {/* Information Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Participant Name</span>
                    <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{selectedApplicant.name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Phone / WhatsApp</span>
                    <strong style={{ fontSize: '0.95rem', color: '#25D366' }}>{selectedApplicant.phone}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Email Address</span>
                    <span style={{ fontSize: '0.92rem' }}>{selectedApplicant.email}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>City / Location</span>
                    <span style={{ fontSize: '0.92rem' }}>{selectedApplicant.city}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Registration Type</span>
                    <span style={{ fontSize: '0.92rem' }}>
                      {selectedApplicant.registrationType || 'Individual'} ({selectedApplicant.numberOfAttendees || 1} Person{selectedApplicant.numberOfAttendees > 1 ? 's' : ''})
                      {selectedApplicant.registrationSource ? ` • ${selectedApplicant.registrationSource}` : ''}
                    </span>
                  </div>
                  {selectedApplicant.groupName && (
                    <div>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Group / Organization</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--mango-yellow)' }}>{selectedApplicant.groupName}</strong>
                    </div>
                  )}
                  {selectedApplicant.paymentMode && (
                    <div>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Payment Method</span>
                      <strong style={{ fontSize: '0.92rem', color: '#22c55e' }}>{selectedApplicant.paymentMode}</strong>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Fee Amount</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--mango-yellow)' }}>₹{selectedApplicant.amountPaid || 4499}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Transaction Reference / UTR</span>
                    <span style={{ fontSize: '0.9rem', color: '#22c55e', wordBreak: 'break-all' }}>{selectedApplicant.bankDetails || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', display: 'block' }}>Registration Date</span>
                    <span style={{ fontSize: '0.9rem' }}>{selectedApplicant.submittedAt ? new Date(selectedApplicant.submittedAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                {selectedApplicant.additionalMembers && (
                  <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.88rem' }}>
                    <strong style={{ color: '#22c55e', display: 'block', marginBottom: '4px' }}>Additional Group Members:</strong>
                    <div style={{ whiteSpace: 'pre-line' }}>{selectedApplicant.additionalMembers}</div>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedApplicant.notes && (
                  <div style={{ background: 'rgba(232, 167, 16, 0.08)', border: '1px solid rgba(232, 167, 16, 0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.88rem' }}>
                    <strong style={{ color: 'var(--mango-yellow)', display: 'block', marginBottom: '4px' }}>Participant Notes / Expectations:</strong>
                    <span>{selectedApplicant.notes}</span>
                  </div>
                )}

                {/* Payment Proof Screenshot Lightbox Preview Card */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <strong style={{ fontSize: '0.92rem', color: '#22c55e' }}>
                      <CreditCardOutlined /> Payment Proof Screenshot
                    </strong>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                      ₹{selectedApplicant.amountPaid || 500} Registration Fee Confirmed
                    </span>
                  </div>

                  {selectedApplicant.proofImageUrl ? (
                    <div>
                      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '12px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070d08' }}>
                        <Image
                          src={selectedApplicant.proofImageUrl}
                          alt="Payment Proof"
                          style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }}
                          preview={{
                            mask: (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                <ZoomInOutlined /> Click to Zoom
                              </div>
                            )
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setLightboxPreview({
                          open: true,
                          url: selectedApplicant.proofImageUrl,
                          title: `${selectedApplicant.name} - Payment Proof (₹${selectedApplicant.amountPaid || 500})`
                        })}
                        className="btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '7px 16px', width: '100%', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px' }}
                      >
                        <EyeOutlined />
                        <span>View Full Screen Screenshot</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', opacity: 0.6, fontSize: '0.88rem' }}>
                      No payment screenshot file attached.
                    </div>
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedApplicant.id || selectedApplicant.registrationId, 'Verified / Enrolled')}
                      style={{ background: '#22c55e', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <CheckOutlined /> Mark Verified
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedApplicant.id || selectedApplicant.registrationId, 'Follow-up')}
                      style={{ background: 'rgba(232, 167, 16, 0.15)', color: 'var(--mango-yellow)', border: '1px solid var(--mango-yellow)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ClockCircleOutlined /> Mark Follow-up
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedApplicant.id || selectedApplicant.registrationId, 'Pending Verification')}
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Reset to Pending
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRegistration(selectedApplicant)}
                      style={{ background: 'rgba(255, 77, 79, 0.15)', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <DeleteOutlined /> Delete Attendee
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://wa.me/${(selectedApplicant.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedApplicant.name)}!%20Regarding%20your%20registration%20(${selectedApplicant.registrationId || selectedApplicant.id})%20for%20Chef%20Manikandan's%20One%20Day%20Workshop.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: '#25D366', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <WhatsAppOutlined />
                      <span>WhatsApp Attendee</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </ConfigProvider>

        {/* 4. MODAL: LIGHTBOX HIGH-RES PREVIEW */}
        <Modal
          open={lightboxPreview.open}
          onCancel={() => setLightboxPreview({ open: false, url: '', title: '' })}
          footer={null}
          centered
          width={650}
          title={lightboxPreview.title}
        >
          {lightboxPreview.url && (
            <div style={{ padding: '12px', textAlign: 'center', background: '#0a0f0b', borderRadius: '12px' }}>
              <img
                src={lightboxPreview.url}
                alt={lightboxPreview.title}
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
