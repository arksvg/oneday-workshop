import React from 'react';
import {
  SafetyCertificateOutlined,
  CoffeeOutlined,
  GiftOutlined,
  StarFilled,
  CheckCircleOutlined
} from '@ant-design/icons';

export default function WorkshopInclusions() {
  const inclusions = [
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Official Recognized Certificate',
      desc: 'Accredited certificate of completion signed by Sun TV MasterChef Manikandan & Sam’s Culinary Art Class founder Mrs. M. Vahitha Jeevanandam, honoring your knife skills and botanical carving mastery.'
    },
    {
      icon: <CoffeeOutlined />,
      title: 'Veg Lunch & Refreshing Beverages',
      desc: 'Complimentary gourmet hot vegetarian lunch freshly cooked at the academy, accompanied by energizing tea, coffee, and chilled beverages throughout the entire workshop duration.'
    },
    {
      icon: <GiftOutlined />,
      title: 'Complete Workshop Kit & Tools',
      desc: 'Take home your personal workshop kit including specialized Thai fruit/vegetable carving knives, floral assembly skewers, sharpening tools, and instructional diagram sheets.'
    },
    {
      icon: <StarFilled />,
      title: 'MasterChef Personal Mentorship',
      desc: 'Direct, side-by-side guidance from MasterChef Manikandan. Every single cut, petal curve, and leaf contour is personally reviewed and perfected for every participant.'
    }
  ];

  return (
    <section id="inclusions" style={{ padding: '70px 16px', background: 'radial-gradient(circle at top, rgba(232, 167, 16, 0.08) 0%, transparent 70%)' }}>
      <div className="container">
        <div className="text-center" style={{ maxWidth: '750px', margin: '0 auto 48px' }}>
          <div className="hero-badge-glow">
            <GiftOutlined />
            <span>EVERY PARTICIPANT RECEIVES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: '800', marginBottom: '16px' }}>
            What Is <span className="gradient-text-gold">Included In Your Workshop</span>
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: '1.6' }}>
            Everything you need for an immersive, hassle-free masterclass is provided. Bring only your enthusiasm—we supply the rest.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}
        >
          {inclusions.map((item, idx) => (
            <div key={idx} className="inclusion-card">
              <div className="inclusion-icon-wrapper">
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-dark)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: '1.6', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
