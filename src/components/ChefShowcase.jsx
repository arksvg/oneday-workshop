import React from 'react';
import {
  TrophyOutlined,
  StarFilled,
  SafetyCertificateOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  WhatsAppOutlined,
  ExportOutlined
} from '@ant-design/icons';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/J67g8MJwUjF25VYogReGYY?s=cl&p=a&iam=2';

export default function ChefShowcase() {
  const achievements = [
    {
      icon: <StarFilled style={{ color: 'var(--mango-yellow)', fontSize: '24px' }} />,
      title: 'Sun TV MasterChef Star',
      subtitle: 'Star of the Show',
      desc: 'Celebrated television masterchef recognized statewide for inspiring culinary performances, artistic presentation, and dynamic teaching.'
    },
    {
      icon: <TrophyOutlined style={{ color: 'var(--mango-yellow)', fontSize: '24px' }} />,
      title: '2019 International Culinary Competitions Sri Lanka',
      subtitle: 'Gold Medal Winner',
      desc: 'Awarded highest international honors competing with elite masterchefs across Asia in technical fruit and vegetable carving.'
    },
    {
      icon: <SafetyCertificateOutlined style={{ color: 'var(--mango-yellow)', fontSize: '24px' }} />,
      title: 'SICA Gold Medalist',
      subtitle: 'South India Culinary Association',
      desc: 'Recognized by the premier South India Culinary Association for excellence in classical gastronomy and culinary artistry.'
    },
    {
      icon: <TeamOutlined style={{ color: 'var(--mango-yellow)', fontSize: '24px' }} />,
      title: '2026 Maldives Overall Championship',
      subtitle: 'Academic Students Won Gold Overall Championship for Carving',
      desc: 'Mentored students to grand international victory, bringing home the Gold Overall Championship Awards in competitive carving in the Maldives.'
    }
  ];

  const galleryItems = [
    {
      src: '/images/carved-bouquet.jpg',
      title: 'Artisanal Vegetable Floral Bouquet',
      subtitle: 'Elaborate carrot leaves, white radish roses, and beetroot blossoms—the exact bouquet technique taught in this masterclass.'
    }
  ];

  return (
    <section id="chef" style={{ padding: '70px 16px', background: 'radial-gradient(ellipse at center bottom, rgba(25, 65, 33, 0.25) 0%, transparent 70%)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 50px' }}>
          <div className="hero-badge-glow">
            <TrophyOutlined />
            <span>WORLD-CLASS MENTORSHIP</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: '800', marginBottom: '16px' }}>
            Meet <span className="gradient-text-gold">Chef Manikandan</span>
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: '1.6' }}>
            Learn alongside one of India's most celebrated carving masters and television culinary personalities. With international gold medals and globally victorious students, Chef Manikandan brings real mastery to your fingertips.
          </p>
        </div>

        {/* 4 Key Accolades 2x2 Grid */}
        <div
          className="chef-achievements-2x2-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '60px'
          }}
        >
          {achievements.map((item, idx) => (
            <div key={idx} className="achievement-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'rgba(232, 167, 16, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(232, 167, 16, 0.3)'
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: 'var(--text-dark)' }}>
                    {item.title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--mango-yellow)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {item.subtitle}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', opacity: 0.85, lineHeight: '1.55', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Gallery & Video Sneak Peek Showcase */}
        <div id="workshop-video" style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--mango-yellow)', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                <PlayCircleOutlined />
                <span>Video Sneak Peek &amp; Live Artistry</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 6px 0' }}>
                Artistry, Video Teaser &amp; Masterpieces
              </h3>
              <p style={{ fontSize: '0.92rem', opacity: 0.8, margin: 0 }}>
                Witness Chef Manikandan&apos;s live carving technique and signature sculptures taught in the workshop
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e' }} />
              <span>Exact Techniques Taught Live in Masterclass</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              maxWidth: '960px',
              margin: '0 auto'
            }}
          >
            {/* Card 1: Live Video Teaser */}
            <div
              className="gallery-card"
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'var(--bg-surface-elevated)',
                border: '1.5px solid rgba(232, 167, 16, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(232, 167, 16, 0.1)'
              }}
            >
              {/* Video Player Box with Fixed Height Matching Photo Card */}
              <div
                style={{
                  width: '100%',
                  height: '480px',
                  background: 'radial-gradient(circle, rgba(232, 167, 16, 0.08) 0%, rgba(5, 10, 6, 0.98) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Live Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    zIndex: 2,
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 10px rgba(239, 68, 68, 0.5)'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
                  <span>LIVE CARVING TEASER</span>
                </div>

                <video
                  src="/workshop-video.mp4"
                  playsInline
                  autoPlay
                  loop
                  muted
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#040805'
                  }}
                  title="Chef Manikandan One Day Vegetable Carving Workshop Sneak Peek"
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>

              {/* Video Caption & Actions */}
              <div className="gallery-caption" style={{ padding: '18px 20px', background: 'rgba(14, 25, 16, 0.95)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-dark)' }}>
                    Live Workshop Carving Sneak Peek
                  </h4>
                  <p style={{ fontSize: '0.86rem', opacity: 0.85, margin: '0 0 14px 0', lineHeight: '1.5' }}>
                    Watch Sun TV MasterChef Manikandan sculpt delicate floral petals in real-time. This is the exact hands-on artistry you will practice at your personal workstation on Sunday, Nov 15.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <a
                    href={WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#25D366',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <WhatsAppOutlined />
                    <span>Join WhatsApp Group for More Clips</span>
                    <ExportOutlined />
                  </a>

                  <a
                    href="#register"
                    style={{
                      color: 'var(--mango-yellow)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    Enroll Now →
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Signature Floral Bouquet Photo */}
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="gallery-card"
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)'
                }}
              >
                {/* Full Height Image Box */}
                <div
                  style={{
                    width: '100%',
                    height: '480px',
                    background: 'radial-gradient(circle, rgba(232, 167, 16, 0.04) 0%, rgba(5, 10, 6, 0.96) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      zIndex: 2,
                      background: 'rgba(232, 167, 16, 0.9)',
                      color: '#000000',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      letterSpacing: '0.5px'
                    }}
                  >
                    SIGNATURE MASTERPIECE
                  </div>

                  <img
                    src={item.src}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>

                <div className="gallery-caption" style={{ padding: '18px 20px', background: 'rgba(14, 25, 16, 0.95)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-dark)' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.86rem', opacity: 0.85, margin: '0 0 14px 0', lineHeight: '1.5' }}>
                      {item.subtitle}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                      Take home your completed bouquet
                    </span>
                    <a
                      href="#register"
                      style={{
                        color: 'var(--mango-yellow)',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        textDecoration: 'none'
                      }}
                    >
                      Book Seat (₹500 Advance) →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated WhatsApp Group Community Callout */}
          <div
            style={{
              maxWidth: '960px',
              margin: '28px auto 0',
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(14, 25, 16, 0.95) 100%)',
              border: '1.5px solid rgba(37, 211, 102, 0.4)',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '620px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#25D366',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
                }}
              >
                <WhatsAppOutlined />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: '#ffffff', marginBottom: '2px' }}>
                  Join the Official Workshop WhatsApp Group
                </div>
                <div style={{ fontSize: '0.84rem', color: '#d1d5db', lineHeight: '1.4' }}>
                  Connect with fellow attendees, get exclusive carving practice clips, schedule updates, and interact directly with the academy team.
                </div>
              </div>
            </div>

            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '24px',
                fontWeight: '700',
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Join WhatsApp Group</span>
              <ExportOutlined />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
