'use client';

import { useState } from 'react';
import styles from './page.module.css';

const FAQ_DATA = [
  {
    category: 'Orders & Shipping',
    questions: [
      { q: 'How long does delivery take?', a: 'Domestic orders (India) are delivered within 7-14 business days. International orders take 14-21 business days depending on destination.' },
      { q: 'Do you offer free shipping?', a: 'Yes! Free shipping on all domestic orders above ₹10,000 and international orders above $500.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once shipped, you'll receive a tracking number via email. You can also track it from your account under "My Orders".' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide via DHL, FedEx, and India Post EMS. International duties and taxes are the buyer's responsibility.' },
    ],
  },
  {
    category: 'Returns & Exchange',
    questions: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. The rug must be in original, unused condition with no stains or damage.' },
      { q: 'How do I initiate a return?', a: 'Email us at info@loomistrystudio.com with your order number. We'll respond within 24 hours with return instructions.' },
      { q: 'Can I exchange for a different size?', a: 'Yes, exchanges are available subject to stock availability. Any price difference will be charged or refunded.' },
      { q: 'Are custom rugs returnable?', a: 'Custom-made and personalized rugs are non-returnable as they are made specifically for you.' },
    ],
  },
  {
    category: 'Products & Materials',
    questions: [
      { q: 'Are your rugs handmade?', a: 'Yes, 100%. Every rug is handcrafted by skilled artisans in Bhadohi, India — the carpet capital of the world. No machines are used.' },
      { q: 'What materials do you use?', a: 'We use premium natural materials: New Zealand wool, pure silk, cotton, jute, viscose, and bamboo silk. All dyes are natural/vegetable-based.' },
      { q: 'How do I care for my rug?', a: 'Vacuum regularly, rotate every 6 months, blot spills immediately, and get professional cleaning every 12-18 months. See our full Care Guide for details.' },
      { q: 'What's the difference between hand-knotted and hand-tufted?', a: 'Hand-knotted rugs are tied knot by knot (taking months), offering unmatched durability and detail. Hand-tufted rugs use a tufting gun on canvas — faster to make, softer pile, more affordable.' },
    ],
  },
  {
    category: 'Custom Orders',
    questions: [
      { q: 'Can I order a custom size?', a: 'Yes! We offer custom sizing for most of our designs. Pricing is calculated per square foot. Visit our Custom Rugs page to get started.' },
      { q: 'How long does a custom rug take?', a: 'Custom orders typically take 4-8 weeks depending on size, complexity, and material. We'll give you an estimated timeline with your quote.' },
      { q: 'Can I choose my own colors and patterns?', a: 'Absolutely. You can specify colors, patterns, materials, and dimensions. Upload inspiration images and our artisans will bring your vision to life.' },
      { q: 'Is there a minimum order for custom rugs?', a: 'No minimum. We accept single custom orders as well as bulk/wholesale requests.' },
    ],
  },
  {
    category: 'Payments',
    questions: [
      { q: 'What payment methods do you accept?', a: 'For India: Razorpay (UPI, cards, NetBanking). For International: Stripe (Visa, Mastercard, Amex). We also accept bank transfers for wholesale orders.' },
      { q: 'Is my payment secure?', a: 'Yes. All payments are processed through Razorpay and Stripe — both PCI-DSS compliant with bank-grade encryption.' },
      { q: 'Do you offer EMI/installments?', a: 'EMI options are available through Razorpay for select Indian banks. The option will appear at checkout if eligible.' },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      <p className={styles.subtitle}>Everything you need to know about our handmade rugs, orders, and services.</p>

      <div className={styles.faqList}>
        {FAQ_DATA.map((section, si) => (
          <div key={si} className={styles.category}>
            <h2 className={styles.categoryTitle}>{section.category}</h2>
            <div className={styles.accordion}>
              {section.questions.map((item, qi) => {
                const key = `${si}-${qi}`;
                const isOpen = openItems[key];
                return (
                  <div key={qi} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                    <button className={styles.question} onClick={() => toggle(key)}>
                      <span>{item.q}</span>
                      <svg className={styles.chevron} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className={styles.answer}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contact}>
        <h3>Still have questions?</h3>
        <p>Our team is happy to help. Reach out anytime.</p>
        <div className={styles.contactLinks}>
          <a href="https://wa.me/917428917452" className={styles.contactBtn}>Chat on WhatsApp</a>
          <a href="mailto:info@loomistrystudio.com" className={styles.contactBtnAlt}>Email Us</a>
        </div>
      </div>
    </div>
  );
}
