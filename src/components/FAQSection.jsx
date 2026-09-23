import React, { useState } from 'react';
import {
  QuestionCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

export default function FAQSection() {
  // Enforce single item expansion: only one open at a time
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqData = [
    {
      question: 'Who can attend this One Day Workshop?',
      answer: 'This workshop is open to anyone passionate about culinary arts—complete beginners, home cooking enthusiasts, hotel management students, aspiring food entrepreneurs, and professional catering staff. No prior carving experience is needed as Chef Manikandan begins from foundational knife holding and safety principles.'
    },
    {
      question: 'What is included in the workshop kit provided to participants?',
      answer: 'Each registered student receives a dedicated workshop kit containing specialized Thai carving knives, precision paring instruments, floral arrangement skewers, botanical display foam, and step-by-step carving reference sheets to practice at home.'
    },
    {
      question: 'Is lunch and refreshments provided during the day?',
      answer: 'Yes! A gourmet, freshly cooked vegetarian lunch is provided to all participants at 1:15 PM, along with tea, coffee, and refreshing beverages throughout the morning and afternoon sessions.'
    },
    {
      question: 'How does the Rs. 500 advance registration fee work?',
      answer: 'The Rs. 500 advance fee confirms and locks your seat, workstation, and personal workshop kit. Because seats are strictly limited to ensure 1-on-1 attention from Chef Manikandan, this advance ensures your spot is secured. The balance workshop fee is payable upon arrival.'
    },
    {
      question: 'How do I claim group registration offers or discounts?',
      answer: 'If registering as a group of 2 or more, or representing a college, hotel management institute, or family team, attractive fee concessions are available. Call or WhatsApp our admissions coordinator at +91 8939648457 to claim your exclusive group offer.'
    },
    {
      question: 'Where will the workshop take place?',
      answer: "The masterclass will be hosted at the main training academy of Sam's Culinary Art Class, located at No. 18/21, Vishwanathapuram 3rd Street, Kodambakkam, Chennai - 600024. Landmark and route directions will also be sent to your WhatsApp after registration."
    }
  ];

  return (
    <section id="faq" style={{ padding: '80px 16px', background: 'var(--bg-surface)' }}>
      <div className="container" style={{ maxWidth: '840px', margin: '0 auto' }}>
        {/* Section Header */}
        <div className="text-center" style={{ marginBottom: '46px' }}>
          <div className="hero-badge-glow">
            <QuestionCircleOutlined />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: '800', marginBottom: '14px' }}>
            Frequently Asked <span className="gradient-text-gold">Questions</span>
          </h2>
          <p style={{ fontSize: '1.02rem', opacity: 0.88, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Click on any question below to expand the answer. Only one answer expands at a time for optimal clarity.
          </p>
        </div>

        {/* Custom Luxury Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  background: isOpen ? 'rgba(18, 34, 22, 0.95)' : 'var(--bg-surface-elevated)',
                  border: isOpen ? '1px solid var(--mango-yellow)' : '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '16px',
                  boxShadow: isOpen ? '0 8px 24px rgba(232, 167, 16, 0.12)' : 'var(--shadow-sm)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden'
                }}
              >
                {/* Clickable Header Button */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-dark)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Left: Number badge + Question text */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1rem',
                        fontWeight: '800',
                        color: isOpen ? 'var(--mango-yellow)' : 'rgba(255, 255, 255, 0.4)',
                        minWidth: '28px',
                        letterSpacing: '1px'
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '1.04rem',
                        fontWeight: '700',
                        color: isOpen ? 'var(--mango-yellow)' : 'var(--text-dark)',
                        lineHeight: '1.4',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {item.question}
                    </span>
                  </div>

                  {/* Right: Expand/Collapse Action Icon Badge */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      minWidth: '36px',
                      borderRadius: '50%',
                      background: isOpen ? 'var(--mango-yellow)' : 'rgba(232, 167, 16, 0.12)',
                      border: isOpen ? '1px solid var(--mango-yellow)' : '1px solid rgba(232, 167, 16, 0.3)',
                      color: isOpen ? '#000000' : 'var(--mango-yellow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '800',
                      transition: 'all 0.25s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    title={isOpen ? 'Click to collapse' : 'Click to expand'}
                  >
                    {isOpen ? <MinusOutlined /> : <PlusOutlined />}
                  </div>
                </button>

                {/* Animated Collapsible Body */}
                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 22px 68px',
                      borderTop: '1px solid rgba(232, 167, 16, 0.15)',
                      marginTop: '4px'
                    }}
                  >
                    <div
                      style={{
                        paddingTop: '16px',
                        fontSize: '0.94rem',
                        opacity: 0.9,
                        lineHeight: '1.68',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
