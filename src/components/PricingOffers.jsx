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
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto 48px',
            background: 'radial-gradient(ellipse at top center, rgba(232, 167, 16, 0.14) 0%, var(--bg-surface-elevated) 70%)',
            border: '2px solid var(--mango-yellow)',
            borderRadius: '24px',
            padding: '42px 32px 36px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(232, 167, 16, 0.16)'
          }}
        >
          {/* Top Floating Badge */}
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, var(--mango-yellow) 0%, #d4900a 100%)',
              color: '#000000',
              padding: '6px 24px',
              borderRadius: '30px',
              fontSize: '0.82rem',
              fontWeight: '800',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(232, 167, 16, 0.35)',
              whiteSpace: 'nowrap'
            }}
          >
            ALL-INCLUSIVE WORKSHOP PACKAGE
          </div>

          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
              One Day Vegetable Carving Workshop
            </h3>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--mango-yellow)', fontSize: '0.92rem', fontWeight: '700' }}>
              <CalendarOutlined />
              <span>Date: Oct 24</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <ClockCircleOutlined />
              <span>10:00 AM to 5:00 PM</span>
            </div>
          </div>

          {/* Pricing Formula Breakdown Box: Reg Fee + Workshop Fee = Total */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(232, 167, 16, 0.35)',
              borderRadius: '20px',
              padding: '28px 24px',
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              alignItems: 'stretch'
            }}
          >
            {/* Box 1: One-time Registration Fee */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--mango-yellow)', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>
                  Step 1 • Registration Fee
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'nowrap', marginBottom: '10px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--mango-yellow)', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    Rs. 500
                  </span>
                  <span style={{ fontSize: '0.82rem', opacity: 0.75, whiteSpace: 'nowrap' }}>/ one-time</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, margin: 0, lineHeight: '1.45' }}>
                One-time registration fee for entire Sam&apos;s Culinary Art Class.
              </p>
            </div>

            {/* Box 2: Workshop Fee */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#22c55e', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>
                  Step 2 • Workshop Fee
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'nowrap', marginBottom: '10px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#22c55e', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    + Rs. 3,999
                  </span>
                  <span style={{ fontSize: '0.82rem', opacity: 0.75, whiteSpace: 'nowrap' }}>/ participant</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, margin: 0, lineHeight: '1.45' }}>
                Full-day hands-on masterclass with Sun TV MasterChef Manikandan on Oct 24.
              </p>
            </div>

            {/* Box 3: Total Fee */}
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(232, 167, 16, 0.15) 0%, rgba(20, 36, 23, 0.85) 100%)',
                border: '1.5px solid var(--mango-yellow)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(232, 167, 16, 0.12)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#ffffff', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>
                  Total Fee
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px', flexWrap: 'nowrap', marginBottom: '6px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--mango-yellow)', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    Rs. 4,499
                  </span>
                  <span style={{ fontSize: '0.82rem', opacity: 0.8, whiteSpace: 'nowrap' }}>/ total</span>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: '700', padding: '6px 10px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px' }}>
                Rs. 500 Reg Fee + Rs. 3,999 Workshop Fee
              </div>
            </div>
          </div>

          {/* Key Inclusions Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
              marginBottom: '32px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px' }} />
              <span><strong>Take-Home Vegetable Bouquet:</strong> Crafted and sculpted by you during this workshop</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px' }} />
              <span><strong>MasterChef Personal Mentorship:</strong> Direct hands-on guidance from MasterChef Manikandan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px' }} />
              <span><strong>All Tools Provided:</strong> Specialized carving knives, fresh vegetables &amp; gear in class</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px' }} />
              <span><strong>Recognized Certificate:</strong> Completion certificate signed by MasterChef Manikandan &amp; Chef Vahitha</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px' }} />
              <span><strong>Veg Lunch &amp; Refreshments:</strong> Gourmet hot vegetarian lunch, tea, coffee &amp; beverages</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '18px', marginTop: '3px' }} />
              <span><strong>One-Time Lifetime Registration:</strong> Valid across all future Sam&apos;s Culinary Art Class courses</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
            <a
              href="#register"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                fontSize: '1.05rem',
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
                gap: '8px',
                padding: '15px 24px',
                fontSize: '0.95rem',
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
                gap: '8px',
                padding: '15px 22px',
                fontSize: '0.95rem',
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
