import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ChefShowcase from './components/ChefShowcase';
import WorkshopInclusions from './components/WorkshopInclusions';
import PricingOffers from './components/PricingOffers';
import RegistrationForm from './components/RegistrationForm';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import AdminPortal from './components/AdminPortal';
import {
  WhatsAppOutlined
} from '@ant-design/icons';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin';
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('sams-theme', 'dark');

    const handleHashChange = () => {
      setIsAdminOpen(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isAdminOpen) {
      document.body.classList.add('admin-view-active');
    } else {
      document.body.classList.remove('admin-view-active');
    }
    return () => {
      document.body.classList.remove('admin-view-active');
    };
  }, [isAdminOpen]);

  const openAdmin = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setIsAdminOpen(true);
    window.location.hash = 'admin';
  };

  const closeAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  if (isAdminOpen) {
    return (
      <div className="app-shell-wrapper admin-active">
        <AdminPortal onClose={closeAdmin} />
      </div>
    );
  }

  return (
    <div className="app-shell-wrapper">
      {/* Top Banner with samsculinaryartclass.com link & phone */}
      <AnnouncementBar />

      {/* Luxury Navigation Bar */}
      <Navbar />

      {/* Main Workshop Landing Page Flow */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Chef Manikandan Spotlight & Carving Artistry */}
        <ChefShowcase />

        {/* 3. Workshop Inclusions (Kit, Veg Lunch & Beverages, Certificate) */}
        <WorkshopInclusions />

        {/* 5. Fees & Group Registration Offers */}
        <PricingOffers />

        {/* 6. Multi-Step Registration & Rs. 500 Payment Form */}
        <RegistrationForm />

        {/* 7. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Luxury Footer */}
      <Footer onOpenAdmin={openAdmin} />

      {/* Floating Action Buttons for Direct WhatsApp & Call */}
      <div
        className="floating-sticky-actions"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 999
        }}
      >
        <a
          href="https://wa.me/918939648457?text=Hi%20Sam's%20Culinary%20Art%20Class,%20I%20want%20to%20reserve%20my%20slot%20for%20Chef%20Manikandan's%20One%20Day%20Workshop!"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp (+91 8939648457)"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: '#25D366',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
            textDecoration: 'none',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <WhatsAppOutlined />
        </a>
      </div>
    </div>
  );
}
