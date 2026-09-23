import React from 'react';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ArrowUpOutlined,
  CopyrightOutlined,
  SettingOutlined
} from '@ant-design/icons';

export default function Footer({ onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrapper" style={{ background: '#050a06', borderTop: '1px solid rgba(232, 167, 16, 0.25)', padding: '60px 16px 30px' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '36px',
            marginBottom: '40px'
          }}
        >
          {/* Column 1: Academy Emblem & Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo-circle.svg"
                alt="Sam's Culinary Art Class Official Crest"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = '/logo.webp';
                }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Sam&apos;s Culinary Art Class
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--mango-yellow)', letterSpacing: '0.5px' }}>
                  Professional Cooking &amp; Baking Academy
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', opacity: 0.82, lineHeight: '1.6', marginBottom: '16px' }}>
              Pioneering premier hands-on culinary education in Chennai. Partnering with Sun TV MasterChef Manikandan for exclusive masterclasses, life skills, and championship carving artistry.
            </p>

            {/* Single Line Visit Link */}
            <div style={{ marginTop: '14px' }}>
              <a
                href="https://www.samsculinaryartclass.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--mango-yellow)',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <GlobalOutlined />
                <span>Visit samsculinaryartclass.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Workshop Highlights */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>
              Workshop Highlights
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <a href="#overview" style={{ color: 'var(--text-dark)', opacity: 0.85, textDecoration: 'none' }}>
                  Overview &amp; Timing (10 AM - 5 PM)
                </a>
              </li>
              <li>
                <a href="#chef" style={{ color: 'var(--text-dark)', opacity: 0.85, textDecoration: 'none' }}>
                  Chef Manikandan's Accolades
                </a>
              </li>
              <li>
                <a href="#inclusions" style={{ color: 'var(--text-dark)', opacity: 0.85, textDecoration: 'none' }}>
                  Kit, Certificate &amp; Veg Lunch
                </a>
              </li>
              <li>
                <a href="#pricing" style={{ color: 'var(--text-dark)', opacity: 0.85, textDecoration: 'none' }}>
                  Advance Fee (Rs. 500) &amp; Group Offers
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Reach Us */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>
              Reach Us
            </h4>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px', fontSize: '0.88rem', lineHeight: '1.6' }}>
              <EnvironmentOutlined style={{ color: 'var(--mango-yellow)', marginTop: '4px', fontSize: '16px' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Anbazhaghi Bhavanam</strong>
                <span>18/21, Vishwanathapuram 3rd Street,</span><br />
                <span>Kodambakkam,</span>
                <span>Chennai - 600 024</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PhoneOutlined style={{ color: 'var(--mango-yellow)' }} />
                <a href="tel:+918939648457" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '600' }}>
                  +91 8939648457
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MailOutlined style={{ color: 'var(--mango-yellow)' }} />
                <a href="mailto:samsculinaryartclass@gmail.com" style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>
                  samsculinaryartclass@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Location Map */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>
              Location Map
            </h4>
            <div className="footer-map-container" style={{ height: '180px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(232, 167, 16, 0.3)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8153394118463!2d80.2229660745765!3d13.047423213212394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266f0b949d36f%3A0x75c3bcaba8428ec4!2s3%2F18%2C%20Viswanatha%20Puram%2C%20Kodambakkam%2C%20Chennai%2C%20Greater%20Chennai%2C%20Tamil%20Nadu%20600024!5e0!3m2!1sen!2sin!4v1784567658563!5m2!1sen!2sin"
                className="footer-map-iframe"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sam's Culinary Art Class Location Map"
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.82rem',
            opacity: 0.75
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CopyrightOutlined /> {new Date().getFullYear()} Sam&apos;s Culinary Art Classes. All Rights Reserved.
            </div>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="footer-admin-link"
              style={{
                background: 'rgba(232, 167, 16, 0.1)',
                border: '1px solid rgba(232, 167, 16, 0.3)',
                color: 'var(--mango-yellow)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '16px',
                transition: 'all 0.2s ease'
              }}
              title="Open Workshop Administration & Registrations"
            >
              <SettingOutlined style={{ fontSize: '13px' }} />
              <span>Admin Portal</span>
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              style={{
                background: 'rgba(232, 167, 16, 0.15)',
                border: '1px solid var(--mango-yellow)',
                color: 'var(--mango-yellow)',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowUpOutlined />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
