import React from 'react';
import {
  GlobalOutlined,
  PhoneOutlined,
  ThunderboltFilled,
  CalendarOutlined
} from '@ant-design/icons';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Workshop announcement banner" className="workshop-announcement-bar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.86rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ThunderboltFilled style={{ color: 'var(--mango-yellow)' }} />
          <strong>First Time in Sam's Culinary:</strong> One day Workshop for Master class with Sun TV MasterChef Manikandan
        </span>
        <span style={{ opacity: 0.5, display: 'inline-block' }}>|</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <CalendarOutlined style={{ color: 'var(--mango-yellow)' }} />
          10:00 AM to 5:00 PM
        </span>
        <span style={{ opacity: 0.5, display: 'inline-block' }}>|</span>
        <a
          href="https://www.samsculinaryartclass.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <GlobalOutlined />
          Visit Official Academy (samsculinaryartclass.com)
        </a>
        <span style={{ opacity: 0.5, display: 'inline-block' }}>|</span>
        <a href="tel:+918939648457" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <PhoneOutlined />
          +91 8939648457
        </a>
      </div>
    </aside>
  );
}
