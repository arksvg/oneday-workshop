import React, { useState, useEffect } from 'react';
import {
  PhoneOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  MenuOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Chef Manikandan', href: '#chef' },
    { label: "What's Included", href: '#inclusions' },
    { label: 'Fees & Offers', href: '#pricing' },
    { label: 'Register Now', href: '#register', isPrimary: true },
  ];

  return (
    <header
      className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'var(--glass-blur)',
        background: isScrolled ? 'var(--glass-bg)' : 'transparent',
        borderBottom: isScrolled ? 'var(--border-subtle)' : 'none',
        transition: 'all 0.3s ease',
        padding: '12px 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        {/* Brand Logo */}
        <a href="#overview" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img
            src="/logo-circle.svg"
            alt="Sam's Culinary Art Class Official Emblem"
            style={{ width: '46px', height: '46px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = '/logo.webp';
            }}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-dark)', lineHeight: '1.1', letterSpacing: '0.5px' }}>
              Sam&apos;s Culinary Art Class
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--mango-yellow)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              One Day Masterclass Series
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links" style={{ display: 'none', alignItems: 'center', gap: '22px' }}>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              style={{
                color: link.isPrimary ? '#000' : 'var(--text-dark)',
                background: link.isPrimary ? 'var(--mango-yellow)' : 'transparent',
                padding: link.isPrimary ? '8px 18px' : '6px 0',
                borderRadius: link.isPrimary ? '30px' : '0',
                fontWeight: link.isPrimary ? '700' : '500',
                fontSize: '0.88rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: link.isPrimary ? '0 4px 14px rgba(232, 167, 16, 0.3)' : 'none'
              }}
            >
              {link.isPrimary && <CheckCircleOutlined />}
              {link.label}
            </a>
          ))}

        </nav>

        {/* Mobile Actions Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mobile-actions">
          <a
            href="tel:+918939648457"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(232, 167, 16, 0.15)',
              border: '1px solid var(--mango-yellow)',
              color: 'var(--mango-yellow)'
            }}
            title="Call Support"
          >
            <PhoneOutlined />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="mobile-hamburger-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-dark)',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-drawer"
          style={{
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--mango-yellow)',
            padding: '20px 24px',
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: link.isPrimary ? '#000' : 'var(--text-dark)',
                background: link.isPrimary ? 'var(--mango-yellow)' : 'transparent',
                padding: link.isPrimary ? '12px 18px' : '8px 0',
                borderRadius: link.isPrimary ? '8px' : '0',
                fontWeight: link.isPrimary ? '700' : '500',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {link.isPrimary && <CheckCircleOutlined />}
              {link.label}
            </a>
          ))}

          <a
            href="https://www.samsculinaryartclass.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--mango-yellow)',
              fontSize: '0.95rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <GlobalOutlined />
            Visit Official Academy (samsculinaryartclass.com)
          </a>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <a
              href="tel:+918939648457"
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <PhoneOutlined /> Call Us
            </a>
            <a
              href="https://wa.me/918939648457?text=Hi%20Sam's%20Culinary%20Art%20Class,%20I%20am%20interested%20in%20Chef%20Manikandan's%20One%20Day%20Workshop!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <WhatsAppOutlined /> WhatsApp
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .mobile-actions {
            display: none !important;
          }
          .mobile-menu-drawer {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
