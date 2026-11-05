
import React from 'react';
import {
  SafetyCertificateOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  FormOutlined
} from '@ant-design/icons';

const GOOGLE_FORM_REGISTER_URL =
  'https://forms.gle/apADmiAttyFzYj516';

const WHATSAPP_REGISTER_URL =
  `https://wa.me/918939648457?text=${encodeURIComponent(
    "Hi Sam's Culinary Art Class, I would like to register for the Vegetable Carving Workshop on Nov 15."
  )}`;

const WHATSAPP_SUPPORT_URL =
  `https://wa.me/918939648457?text=${encodeURIComponent(
    "Hi Sam's Culinary Art Class, I have a question about the Vegetable Carving Workshop registration."
  )}`;

export default function RegistrationForm() {
  return (
    <section
      id="register"
      style={{
        padding: '70px 16px 90px',
        background:
          'radial-gradient(circle at center top, rgba(232, 167, 16, 0.09) 0%, transparent 65%)'
      }}
    >
      <div
        className="container"
        style={{ maxWidth: '920px', margin: '0 auto' }}
      >
        {/* Section Header */}
        <div
          className="text-center"
          style={{ marginBottom: '32px' }}
        >
          <div className="hero-badge-glow">
            <SafetyCertificateOutlined />
            <span>OFFICIAL WORKSHOP REGISTRATION PORTAL</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
              fontWeight: '800',
              marginBottom: '14px',
              letterSpacing: '-0.5px'
            }}
          >
            Reserve Your{' '}
            <span className="gradient-text-gold">
              Workshop Slot
            </span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              opacity: 0.9,
              maxWidth: '680px',
              margin: '0 auto 20px',
              lineHeight: '1.6'
            }}
          >
            Fill out the official registration form to secure
            your workstation. Pay ₹500 registration fee to
            confirm your seat (for group-of-2 bookings,
            registration is adjusted on arrival).
          </p>

          {/* Quick Details Badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '16px'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(232, 167, 16, 0.1)',
                border: '1px solid rgba(232, 167, 16, 0.3)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.86rem',
                color: 'var(--mango-yellow)',
                fontWeight: '600'
              }}
            >
              <CalendarOutlined />
              <span>Sun, Nov 15 • 10:00 AM – 5:00 PM</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.86rem',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              <EnvironmentOutlined
                style={{ color: 'var(--mango-yellow)' }}
              />
              <span>
                Sam's Culinary Art Class, Kodambakkam, Chennai
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.86rem',
                color: '#22c55e',
                fontWeight: '700'
              }}
            >
              <CheckCircleOutlined />
              <span>
                Direct Mentorship with Chef Manikandan
              </span>
            </div>
          </div>
        </div>

        {/* Quick Registration Action Banner Card */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(232, 167, 16, 0.12) 0%, rgba(20, 28, 22, 0.95) 100%)',
            border: '2px solid rgba(232, 167, 16, 0.5)',
            borderRadius: '20px',
            padding: '28px 24px',
            marginBottom: '28px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
            textAlign: 'center'
          }}
        >
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: '800',
              marginBottom: '10px',
              color: '#ffffff'
            }}
          >
            Ready to Enroll? Instant Google Form Registration
          </h3>

          <p
            style={{
              fontSize: '0.95rem',
              color: '#d1d5db',
              maxWidth: '620px',
              margin: '0 auto 20px',
              lineHeight: '1.5'
            }}
          >
            Click below to open the official registration form
            directly in Google Forms, submit your details, and
            lock your seat in just 2 minutes!
          </p>

          <div
            style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <a
              href={GOOGLE_FORM_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                fontSize: '1.05rem',
                fontWeight: '800',
                borderRadius: '30px',
                textDecoration: 'none',
                boxShadow:
                  '0 4px 20px rgba(232, 167, 16, 0.4)'
              }}
            >
              <FormOutlined style={{ fontSize: '18px' }} />
              <span>Open Official Google Form</span>
              <ExportOutlined />
            </a>

            <a
              href={WHATSAPP_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 24px',
                fontSize: '0.98rem',
                fontWeight: '700',
                borderRadius: '30px',
                textDecoration: 'none'
              }}
            >
              <WhatsAppOutlined
                style={{ color: '#25D366', fontSize: '18px' }}
              />
              <span>Register via WhatsApp</span>
            </a>
          </div>

          {/* 3 Step Process */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '26px',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 16px',
                borderRadius: '12px'
              }}
            >
              <div
                style={{
                  color: 'var(--mango-yellow)',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  marginBottom: '4px'
                }}
              >
                STEP 1
              </div>

              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px'
                }}
              >
                Fill Form Details
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#9ca3af'
                }}
              >
                Enter your name, mobile, city, and dietary preference.
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 16px',
                borderRadius: '12px'
              }}
            >
              <div
                style={{
                  color: 'var(--mango-yellow)',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  marginBottom: '4px'
                }}
              >
                STEP 2
              </div>

              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px'
                }}
              >
                ₹500 Seat Advance
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#9ca3af'
                }}
              >
                Pay registration fee via UPI / GPay to confirm workstation.
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 16px',
                borderRadius: '12px'
              }}
            >
              <div
                style={{
                  color: '#22c55e',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  marginBottom: '4px'
                }}
              >
                STEP 3
              </div>

              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px'
                }}
              >
                Instant Confirmation
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#9ca3af'
                }}
              >
                Get workshop admission pass & schedule on WhatsApp.
              </div>
            </div>
          </div>
        </div>

        {/* Direct Google Form Registration Card */}
        <div
          className="googleform-embed-card"
          style={{
            background: '#ffffff',
            border: '2px solid rgba(232, 167, 16, 0.45)',
            borderRadius: '20px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
            padding: '40px 24px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'rgba(232, 167, 16, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FormOutlined
              style={{
                fontSize: '36px',
                color: '#d97706'
              }}
            />
          </div>

          <h3
            style={{
              color: '#111827',
              fontSize: '1.4rem',
              fontWeight: '800',
              marginBottom: '10px'
            }}
          >
            Vegetable Carving Workshop Registration
          </h3>

          <p
            style={{
              color: '#6b7280',
              fontSize: '0.95rem',
              maxWidth: '580px',
              margin: '0 auto 24px',
              lineHeight: '1.7'
            }}
          >
            Complete your registration through our official
            Google Forms portal. Submit your details to proceed
            with your workshop seat reservation.
          </p>

          <a
            href={GOOGLE_FORM_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px 30px',
              fontSize: '1rem',
              fontWeight: '800',
              borderRadius: '30px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(232, 167, 16, 0.3)'
            }}
          >
            Open Official Registration Form
            <ExportOutlined />
          </a>

          <div
            style={{
              marginTop: '24px',
              padding: '12px 16px',
              background: '#f9fafb',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              color: '#4b5563',
              fontSize: '0.85rem'
            }}
          >
            <CheckCircleOutlined style={{ color: '#16a34a' }} />
            <span>
              Official and secure Google Forms registration
            </span>
          </div>
        </div>

        {/* Helpline & Support Bar */}
        <div
          style={{
            marginTop: '28px',
            padding: '18px 24px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div
              style={{
                fontWeight: '700',
                fontSize: '0.95rem',
                color: '#ffffff',
                marginBottom: '2px'
              }}
            >
              Need assistance with your seat reservation or group booking?
            </div>

            <div
              style={{
                fontSize: '0.82rem',
                opacity: 0.75
              }}
            >
              Direct admissions helpline: +91 8939648457
              {' • '}
              samsculinaryartclass@gmail.com
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}
          >
            <a
              href={WHATSAPP_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '24px',
                fontWeight: '700',
                fontSize: '0.88rem',
                textDecoration: 'none'
              }}
            >
              <WhatsAppOutlined style={{ fontSize: '16px' }} />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href="tel:+918939648457"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid var(--border-color)',
                padding: '9px 18px',
                borderRadius: '24px',
                fontWeight: '600',
                fontSize: '0.88rem',
                textDecoration: 'none'
              }}
            >
              <PhoneOutlined />
              <span>Call Admissions</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
