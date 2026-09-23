import React from 'react';
import {
  TrophyOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  CoffeeOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  StarFilled,
  GlobalOutlined
} from '@ant-design/icons';

export default function HeroSection() {
  return (
    <section id="overview" className="page-hero-banner" style={{ padding: '40px 16px 70px', position: 'relative' }}>
      <div className="container">
        <div className="hero-grid-2col">
          {/* Left Column: Workshop Information */}
          <div>
            {/* Announcement Pill */}
            <div className="hero-badge-glow">
              <TrophyOutlined style={{ fontSize: '15px' }} />
              <span>FIRST TIME IN SAM'S CULINARY ART CLASS</span>
            </div>

            {/* Main Headline */}
            <h1 style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)', fontWeight: '800', lineHeight: '1.18', marginBottom: '16px' }}>
              One Day Masterclass:{' '}
              <span className="gradient-text-gold" style={{ display: 'inline-block' }}>
                Basic Life Skills &amp; Bouquet Carving
              </span>
            </h1>

            {/* Mentor Highlight Banner */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(232, 167, 16, 0.12)',
                border: '1px solid rgba(232, 167, 16, 0.3)',
                padding: '10px 18px',
                borderRadius: '14px',
                marginBottom: '20px'
              }}
            >
              <StarFilled style={{ color: 'var(--mango-yellow)', fontSize: '18px' }} />
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.75, display: 'block' }}>
                  Conducted By
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                  Chef Manikandan — Sun TV MasterChef Star of the Show
                </strong>
              </div>
            </div>

            <p style={{ fontSize: '1.08rem', lineHeight: '1.65', opacity: '0.9', marginBottom: '24px', maxWidth: '620px' }}>
              Master foundational culinary knife skills, kitchen safety, and step-by-step professional vegetable and fruit floral bouquet assembly in an exclusive, hands-on full day experience.
            </p>

            {/* Timing & Format Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
              <div className="time-pill">
                {/* <span className="live-pulse-dot"></span> */}
                <ClockCircleOutlined style={{ color: 'var(--mango-yellow)' }} />
                <span><strong>Timing:</strong> 10:00 AM to 5:00 PM</span>
              </div>

              <div className="time-pill">
                <SafetyCertificateOutlined style={{ color: 'var(--mango-yellow)' }} />
                <span>100% Practical &amp; Hands-On</span>
              </div>
            </div>

            {/* Value Highlights Pill Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '32px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '10px' }}>
                <SafetyCertificateOutlined style={{ color: 'var(--mango-yellow)', fontSize: '18px' }} />
                <span style={{ fontSize: '0.86rem', fontWeight: '600' }}>Recognized Certificate</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '10px' }}>
                <CoffeeOutlined style={{ color: 'var(--mango-yellow)', fontSize: '18px' }} />
                <span style={{ fontSize: '0.86rem', fontWeight: '600' }}>Veg Lunch &amp; Beverages</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '10px' }}>
                <GiftOutlined style={{ color: 'var(--mango-yellow)', fontSize: '18px' }} />
                <span style={{ fontSize: '0.86rem', fontWeight: '600' }}>Full Workshop Kit</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <a
                href="#register"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  borderRadius: '30px'
                }}
              >
                <CheckCircleOutlined style={{ fontSize: '18px' }} />
                <span>Reserve Seat (Rs. 500 Advance)</span>
                <ArrowRightOutlined />
              </a>

              <a
                href="tel:+918939648457"
                className="btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 22px',
                  fontSize: '0.95rem',
                  borderRadius: '30px'
                }}
              >
                <PhoneOutlined />
                <span>Call for Fees &amp; Offers</span>
              </a>

            </div>
          </div>

          {/* Right Column: Hero Visual Showcase with Rounded Circle Design */}
          <div
            className="hero-image-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '30px 24px 24px',
              background: 'radial-gradient(circle at top center, rgba(232, 167, 16, 0.14) 0%, rgba(14, 25, 16, 0.96) 75%)',
              border: '1px solid rgba(232, 167, 16, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(232, 167, 16, 0.15)',
              position: 'relative'
            }}
          >
            {/* Top Star Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(14, 25, 16, 0.9)',
                border: '1px solid var(--mango-yellow)',
                color: 'var(--mango-yellow)',
                padding: '6px 18px',
                borderRadius: '30px',
                fontSize: '0.82rem',
                fontWeight: '700',
                marginBottom: '20px',
                boxShadow: '0 4px 14px rgba(232, 167, 16, 0.2)'
              }}
            >
              <StarFilled />
              <span>Sun TV MasterChef</span>
            </div>

            {/* Glowing Rounded Circular Frame */}
            <div
              style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                maxWidth: '100%',
                borderRadius: '50%',
                padding: '5px',
                background: 'linear-gradient(135deg, var(--mango-yellow) 0%, var(--green-medium) 50%, var(--mango-yellow) 100%)',
                boxShadow: '0 0 35px rgba(232, 167, 16, 0.35), 0 10px 30px rgba(0, 0, 0, 0.6)',
                marginBottom: '22px'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#070f09'
                }}
              >
                <img
                  src="/images/chef-manikandan-maroon.jpg"
                  alt="Chef Manikandan - Sun TV MasterChef Star of the Show"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {/* Info Card Content */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px 20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#ffffff', display: 'block' }}>
                    Chef Manikandan
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--mango-yellow)', fontWeight: '600' }}>
                    SICA &amp; Sri Lanka Gold Medalist
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase', display: 'block' }}>
                    Advance Seat
                  </span>
                  <strong style={{ fontSize: '1.2rem', color: '#22c55e', fontWeight: '800' }}>
                    Rs. 500/-
                  </strong>
                </div>
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', opacity: 0.85 }}>
                <span>Group Discounts on Call</span>
                <span style={{ color: 'var(--mango-yellow)', fontWeight: '600' }}>Kit &amp; Certificate Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
