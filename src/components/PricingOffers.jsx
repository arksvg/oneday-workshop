import React from 'react';
import {
  DollarCircleOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  TeamOutlined,
  TagOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  MailOutlined
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
            Lock in your seat with our advance registration fee. Call our admissions desk to confirm your slot and unlock exclusive group enrollment discounts.
          </p>
        </div>

        {/* 2-Card Pricing Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            maxWidth: '900px',
            margin: '0 auto 40px'
          }}
        >
          {/* Card 1: Advance Registration Fee */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '2px solid var(--mango-yellow)',
              borderRadius: '20px',
              padding: '36px 28px',
              position: 'relative',
              boxShadow: '0 16px 40px rgba(232, 167, 16, 0.15)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--mango-yellow)',
                color: '#000000',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '800',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              Seat Advance
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>
              Advance Registration Fee
            </h3>
            <p style={{ fontSize: '0.88rem', opacity: 0.8, marginBottom: '20px' }}>
              Mandatory advance deposit to lock your training station &amp; workshop kit.
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--mango-yellow)', lineHeight: 1 }}>
                Rs. 500
              </span>
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>/ participant</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '16px' }} />
                <span>Immediate confirmed seat allocation</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '16px' }} />
                <span>Kit &amp; carving tools reserved in your name</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '16px' }} />
                <span>Adjusted towards total workshop fee on arrival</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '16px' }} />
                <span>Instant confirmation slip generated online</span>
              </li>
            </ul>

            <a
              href="#register"
              className="btn-primary"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '14px',
                fontWeight: '700',
                borderRadius: '12px'
              }}
            >
              Pay Rs. 500 &amp; Register Now
            </a>
          </div>

          {/* Card 2: Total Workshop Fees & Enrollment Call */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(46, 102, 58, 0.25)',
                  color: 'var(--text-dark)',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  marginBottom: '16px'
                }}
              >
                Direct Support &amp; Enquiries
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>
                Full Workshop Fees
              </h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.8, marginBottom: '20px' }}>
                Call our coordinator directly to reserve your slot and receive full tuition details.
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <PhoneOutlined style={{ color: 'var(--mango-yellow)', fontSize: '18px' }} />
                  <strong style={{ fontSize: '1.15rem' }}>+91 8939648457</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', opacity: 0.85 }}>
                  <MailOutlined style={{ color: 'var(--mango-yellow)' }} />
                  <span>samsculinaryartclass@gmail.com</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircleOutlined style={{ color: '#22c55e' }} />
                  <span>Individual &amp; professional pricing available</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircleOutlined style={{ color: '#22c55e' }} />
                  <span>Catering &amp; hotel management student rates</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircleOutlined style={{ color: '#22c55e' }} />
                  <span>Special weekend slots available upon request</span>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="tel:+918939648457"
                className="btn-outline"
                style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <PhoneOutlined />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/918939648457?text=Hi%20Sam's%20Culinary%20Art%20Class,%20please%20share%20the%20complete%20workshop%20fees%20for%20Chef%20Manikandan's%20One%20day%20Workshop%20for%20Master%20class."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <WhatsAppOutlined />
                <span>WhatsApp</span>
              </a>
            </div>
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
