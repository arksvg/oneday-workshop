import React from 'react';
import {
  TrophyOutlined,
  StarFilled,
  AimOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined
} from '@ant-design/icons';

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
      src: '/images/chef-manikandan-peacock.jpg',
      title: 'Grand Royal Peacock Sculpture',
      subtitle: 'Hand-carved from white radish, carrot feathers, and edible botanical garnishes by Chef Manikandan.'
    },
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

        {/* Gallery / Artistry Showcase */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 6px 0' }}>
                Artistry &amp; Carving Masterpieces
              </h3>
              <p style={{ fontSize: '0.92rem', opacity: 0.8, margin: 0 }}>
                Signature vegetable and fruit sculptures created by Chef Manikandan
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}>
              <CheckCircleOutlined style={{ color: '#22c55e' }} />
              <span>Exact Techniques Taught Live in Workshop</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}
          >
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
                  flexDirection: 'column'
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
                    overflow: 'hidden'
                  }}
                >
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

                <div className="gallery-caption" style={{ padding: '18px 20px', background: 'rgba(14, 25, 16, 0.95)', flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-dark)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.86rem', opacity: 0.85, margin: 0, lineHeight: '1.5' }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
