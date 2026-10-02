import React from 'react';
import {
  DollarCircleOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  TeamOutlined,
  TagOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

export default function PricingOffers() {
  return (
    <section id="pricing" style={{ padding: '70px 16px', background: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 48px' }}>
          <div className="hero-badge-glow">
            <TagOutlined />
            <span>TRANSPARENT RESERVATION &amp; GROUP BENEFITS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: '800', marginBottom: '16px' }}>
            Registration &amp; <span className="gradient-text-gold">Workshop Fees</span>
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: '1.6' }}>
            Register with our one-time registration fee for Sam&apos;s Culinary Art Class. Workshop fee is ₹3,999 for the complete masterclass on Oct 24 (10:00 AM to 5:00 PM). Group discounts available!
          </p>
        </div>

        {/* Unified Single Pricing Card */}
        <div className="pricing-unified-card">
          {/* Top Floating Badge */}
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, var(--mango-yellow) 0%, #d4900a 100%)',
              color: '#000000',
              padding: '6px 20px',
              borderRadius: '30px',
              fontSize: 'clamp(0.72rem, 2.5vw, 0.82rem)',
              fontWeight: '800',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(232, 167, 16, 0.35)',
              whiteSpace: 'nowrap',
              maxWidth: '92%',
              textAlign: 'center'
            }}
          >
            ALL-INCLUSIVE WORKSHOP PACKAGE
          </div>

          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '4px' }}>
            <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
              One Day Vegetable Carving Workshop
            </h3>
            <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', color: 'var(--mango-yellow)', fontSize: '0.92rem', fontWeight: '700' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CalendarOutlined />
                <span>Date: Oct 24</span>
              </span>
              <span style={{ opacity: 0.5 }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ClockCircleOutlined />
                <span>10:00 AM to 5:00 PM</span>
              </span>
            </div>
          </div>

          {/* Pricing Formula Breakdown Box: Reg Fee + Workshop Fee = Total */}
          <div className="pricing-formula-box">
            {/* Box 1: One-time Registration Fee */}
            <div className="pricing-step-item">
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--mango-yellow)', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>
                  Step 1 • Registration Fee
                </span>
                <div className="pricing-rate-row">
                  <span className="pricing-rate-val" style={{ color: 'var(--mango-yellow)' }}>
                    Rs. 500
                  </span>
                  <span className="pricing-rate-sub">/ one-time</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, margin: 0, lineHeight: '1.45' }}>
                One-time registration fee for entire Sam&apos;s Culinary Art Class.
              </p>
            </div>

            {/* Box 2: Workshop Fee */}
            <div className="pricing-step-item">
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#22c55e', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>
                  Step 2 • Workshop Fee
                </span>
                <div className="pricing-rate-row">
                  <span className="pricing-rate-val" style={{ color: '#22c55e' }}>
                    + Rs. 3,999
                  </span>
                  <span className="pricing-rate-sub">/ participant</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, margin: 0, lineHeight: '1.45' }}>
                Full-day hands-on masterclass with Sun TV MasterChef Manikandan on Oct 24.
              </p>
            </div>

            {/* Box 3: Total Fee */}
            <div className="pricing-step-item total-box">
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#ffffff', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>
                  Total Fee
                </span>
                <div className="pricing-rate-row center">
                  <span className="pricing-rate-val large" style={{ color: 'var(--mango-yellow)' }}>
                    Rs. 4,499
                  </span>
                  <span className="pricing-rate-sub">/ total</span>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: '700', padding: '6px 10px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', wordBreak: 'break-word' }}>
                Rs. 500 Reg Fee + Rs. 3,999 Workshop Fee
              </div>
            </div>
          </div>

          {/* Key Inclusions Grid */}
          <div className="pricing-inclusions-grid">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px', flexShrink: 0 }} />
              <span><strong>Take-Home Vegetable Bouquet:</strong> Crafted and sculpted by you during this workshop</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px', flexShrink: 0 }} />
              <span><strong>MasterChef Personal Mentorship:</strong> Direct hands-on guidance from MasterChef Manikandan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px', flexShrink: 0 }} />
              <span><strong>All Tools Provided:</strong> Specialized carving knives, fresh vegetables &amp; gear in class</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px', flexShrink: 0 }} />
              <span><strong>Recognized Certificate:</strong> Completion certificate signed by MasterChef Manikandan &amp; Chef Vahitha</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px', flexShrink: 0 }} />
              <span><strong>Veg Lunch &amp; Refreshments:</strong> Gourmet hot vegetarian lunch, tea, coffee &amp; beverages</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px', flexShrink: 0 }} />
              <span><strong>One-Time Lifetime Registration:</strong> Valid across all future Sam&apos;s Culinary Art Class courses</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pricing-cta-row">
            <a
              href="#register"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: '800',
                borderRadius: '30px'
              }}
            >
              <CheckCircleOutlined style={{ fontSize: '18px' }} />
              <span>Register Now</span>
              <ArrowRightOutlined />
            </a>

            <a
              href="https://wa.me/918939648457?text=Hi%20Sam's%20Culinary%20Art%20Class,%20I%20am%20enquiring%20about%20the%20One%20Day%20Vegetable%20Carving%20Workshop%20(Rs.%20500%20Reg%20Fee%20+%20Rs.%203999%20Workshop%20Fee)%20and%20group%20discounts."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '13px 22px',
                fontSize: '0.92rem',
                borderRadius: '30px'
              }}
            >
              <WhatsAppOutlined />
              <span>Group Offers on WhatsApp</span>
            </a>

            <a
              href="tel:+918939648457"
              className="btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '13px 20px',
                fontSize: '0.92rem',
                borderRadius: '30px'
              }}
            >
              <PhoneOutlined />
              <span>Call +91 8939648457</span>
            </a>
          </div>
        </div>

        {/* Group Registration Offers Banner */}
        <div className="group-offer-banner" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '580px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232, 167, 16, 0.25)', color: 'var(--mango-yellow)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '10px' }}>
                <TeamOutlined />
                <span>ATTRACTIVE GROUP DISCOUNTS</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>
                Enrolling with Friends, Colleagues, or College Batches?
              </h3>
              <p style={{ fontSize: '0.92rem', opacity: 0.9, margin: 0, lineHeight: '1.55' }}>
                Avail special group registration offers! Attractive fee concessions apply for groups of 2 or more, culinary students, and culinary academy delegations. Call our admissions team to claim your custom group discount.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
              <a
                href="tel:+918939648457"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: '700'
                }}
              >
                <PhoneOutlined />
                <span>Claim Group Offer</span>
              </a>

              <a
                href="https://www.samsculinaryartclass.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textAlign: 'center',
                  fontSize: '0.84rem',
                  color: 'var(--mango-yellow)',
                  textDecoration: 'underline',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <GlobalOutlined />
                <span>Explore samsculinaryartclass.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
