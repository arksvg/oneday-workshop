import React, { useEffect, useState } from 'react';
import {
  SafetyCertificateOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const FORMFACADE_SCRIPT_URL =
  'https://formfacade.com/include/102129220728346922387/form/1FAIpQLSdti3LHROPRiCsNIQWYgga34XuZL2vpHDPNfEvHnTei_-wNkA/classic.js?div=ff-compose';

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let checkInterval = null;
    let timeoutId = null;

    const loadFormFacade = () => {
      setIsLoading(true);
      setHasError(false);

      // 1. If window.formFacade already exists, try invoking its load method
      if (window.formFacade && typeof window.formFacade.load === 'function') {
        try {
          window.formFacade.load('#ff-compose');
        } catch (err) {
          console.warn('FormFacade load error, will re-inject script:', err);
        }
      }

      // 2. Remove existing script tag if any to allow fresh execution
      const existingScript = document.getElementById('formfacade-script');
      if (existingScript) {
        existingScript.remove();
      }

      // 3. Inject new script tag
      const script = document.createElement('script');
      script.id = 'formfacade-script';
      script.src = FORMFACADE_SCRIPT_URL;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Script loaded successfully; wait a brief moment for form DOM population
        timeoutId = setTimeout(() => {
          setIsLoading(false);
        }, 800);
      };

      script.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };

      document.body.appendChild(script);

      // 4. Polling check to hide loading state as soon as FormFacade renders its child elements
      checkInterval = setInterval(() => {
        const composeEl = document.getElementById('ff-compose');
        if (composeEl && composeEl.children.length > 0) {
          setIsLoading(false);
          if (checkInterval) clearInterval(checkInterval);
        }
      }, 300);
    };

    loadFormFacade();

    // Prevent clicking/focusing the "Other" text input from unselecting the checkbox/radio
    const isOtherInput = (el) => {
      if (!el || el.tagName !== 'INPUT' || el.type !== 'text') return false;
      return (
        el.name?.includes('other_option_response') ||
        el.id?.includes('other_option_response') ||
        Boolean(el.closest('.ff-form-check-other')) ||
        Boolean(el.closest('[class*="other"]'))
      );
    };

    const handleOtherClickCapture = (e) => {
      const target = e.target;
      if (isOtherInput(target)) {
        // Stop click from bubbling up to FormFacade's parent div inline onclick handler
        e.stopPropagation();

        // Ensure the associated checkbox/radio remains or becomes checked
        const container = target.closest('.ff-form-check-other') || target.closest('.ff-form-check') || target.parentElement;
        if (container) {
          const checkInput = container.querySelector('input[type="checkbox"], input[type="radio"]');
          if (checkInput && !checkInput.checked) {
            checkInput.checked = true;
            checkInput.dispatchEvent(new Event('change', { bubbles: true }));
            checkInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }
    };

    const handleOtherFocusCapture = (e) => {
      const target = e.target;
      if (isOtherInput(target)) {
        const container = target.closest('.ff-form-check-other') || target.closest('.ff-form-check') || target.parentElement;
        if (container) {
          const checkInput = container.querySelector('input[type="checkbox"], input[type="radio"]');
          if (checkInput && !checkInput.checked) {
            checkInput.checked = true;
            checkInput.dispatchEvent(new Event('change', { bubbles: true }));
            checkInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }
    };

    document.addEventListener('click', handleOtherClickCapture, true);
    document.addEventListener('focusin', handleOtherFocusCapture, true);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('click', handleOtherClickCapture, true);
      document.removeEventListener('focusin', handleOtherFocusCapture, true);
    };
  }, []);

  const handleReload = () => {
    const composeEl = document.getElementById('ff-compose');
    if (composeEl) {
      composeEl.innerHTML = '';
    }
    setIsLoading(true);
    setHasError(false);

    const existingScript = document.getElementById('formfacade-script');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'formfacade-script';
    script.src = `${FORMFACADE_SCRIPT_URL}&_r=${Date.now()}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoading(false);
    script.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    document.body.appendChild(script);
  };

  return (
    <section
      id="register"
      style={{
        padding: '70px 16px 90px',
        background: 'radial-gradient(circle at center top, rgba(232, 167, 16, 0.09) 0%, transparent 65%)'
      }}
    >
      <div className="container" style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* Section Header */}
        <div className="text-center" style={{ marginBottom: '32px' }}>
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
            Reserve Your <span className="gradient-text-gold">Workshop Slot</span>
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
            Fill out the official registration form below to secure your workstation. Pay ₹500 registration fee to confirm your seat (for group-of-2 bookings, registration is adjusted on arrival).
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
              <EnvironmentOutlined style={{ color: 'var(--mango-yellow)' }} />
              <span>Sam's Culinary Art Class, Kodambakkam, Chennai</span>
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
              <span>Direct Mentorship with Chef Manikandan</span>
            </div>
          </div>
        </div>

        {/* Embedded FormFacade Container Card */}
        <div
          className="formfacade-embed-card"
          style={{
            background: '#ffffff',
            border: '2px solid rgba(232, 167, 16, 0.45)',
            borderRadius: '20px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35), 0 0 30px rgba(232, 167, 16, 0.1)',
            padding: '24px 20px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '620px'
          }}
        >
          {/* Top Card Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '14px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrophyOutlined style={{ color: '#d97706', fontSize: '18px' }} />
              <span style={{ fontWeight: '800', fontSize: '0.98rem', letterSpacing: '0.2px', color: '#111827' }}>
                Vegetable Carving Workshop Registration Form
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleReload}
                title="Reload Registration Form"
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ReloadOutlined />
                <span>Reload</span>
              </button>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdti3LHROPRiCsNIQWYgga34XuZL2vpHDPNfEvHnTei_-wNkA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                title="Open directly in Google Forms"
                style={{
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  color: '#92400e',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontWeight: '700'
                }}
              >
                <span>Google Form Direct Link</span>
                <ExportOutlined />
              </a>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                minHeight: '400px'
              }}
            >
              <LoadingOutlined style={{ fontSize: '38px', color: '#d97706', marginBottom: '16px' }} spin />
              <p style={{ fontSize: '1.05rem', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                Loading Registration Form...
              </p>
              <p style={{ fontSize: '0.88rem', color: '#6b7280', maxWidth: '420px', textAlign: 'center' }}>
                Connecting to official FormFacade registration portal. Please wait a moment.
              </p>
            </div>
          )}

          {/* Error Fallback */}
          {hasError && !isLoading && (
            <div
              style={{
                padding: '36px 20px',
                textAlign: 'center',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                margin: '20px 0'
              }}
            >
              <h4 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '1.15rem', fontWeight: '700' }}>
                Unable to load embedded form automatically
              </h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, maxWidth: '480px', margin: '0 auto 18px', lineHeight: '1.5' }}>
                This can happen due to strict browser tracking prevention or ad-blockers. You can directly access the official Google Form below or reach out via WhatsApp.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdti3LHROPRiCsNIQWYgga34XuZL2vpHDPNfEvHnTei_-wNkA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '24px' }}
                >
                  <ExportOutlined />
                  <span>Open Form in New Tab</span>
                </a>
                <a
                  href="https://wa.me/918939648457?text=Hi%20Sam's%20Culinary%20Art%20Class,%20I%20would%20like%20to%20register%20for%20the%20Vegetable%20Carving%20Workshop%20on%20Nov%2015."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '24px' }}
                >
                  <WhatsAppOutlined style={{ color: '#25D366' }} />
                  <span>Register on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* THE FORMFACADE DIV TARGET */}
          <div
            id="ff-compose"
            style={{
              minHeight: isLoading ? '0px' : '450px',
              display: hasError ? 'none' : 'block'
            }}
          />
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
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff', marginBottom: '2px' }}>
              Need assistance with your seat reservation or group booking?
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.75 }}>
              Direct admissions helpline: +91 8939648457 • samsculinaryartclass@gmail.com
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/918939648457?text=Hi%20Sam's%20Culinary%20Art%20Class,%20I%20have%20a%20question%20about%20the%20Vegetable%20Carving%20Workshop%20registration."
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
