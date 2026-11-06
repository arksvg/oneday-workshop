import React from 'react';
import {
  GlobalOutlined,
  PhoneOutlined,
  ThunderboltFilled,
  CalendarOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/J67g8MJwUjF25VYogReGYY?s=cl&p=a&iam=2';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Workshop announcement banner" className="workshop-announcement-bar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.86rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ThunderboltFilled style={{ color: 'var(--mango-yellow)' }} />
          <strong>One Day Vegetable Carving Workshop:</strong> with Sun TV MasterChef Manikandan
        </span>
        <span style={{ opacity: 0.5, display: 'inline-block' }}>|</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <CalendarOutlined style={{ color: 'var(--mango-yellow)' }} />
          <strong>Date:</strong> Nov 15 | 10:00 AM to 5:00 PM
        </span>
        <span style={{ opacity: 0.5, display: 'inline-block' }}>|</span>
        <a
          href={WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#25D366', fontWeight: '700', textDecoration: 'none' }}
        >
          <WhatsAppOutlined />
          Join Official WhatsApp Group
        </a>
        <span style={{ opacity: 0.5, display: 'inline-block' }}>|</span>
        <a
          href="https://www.samsculinaryartclass.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <GlobalOutlined />
          samsculinaryartclass.com
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
