'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Converter from './components/Converter';
import { NavbarScrollHandler } from './components/NavbarScrollHandler';
import './home.css';

const features = [
  {
    icon: '📄',
    title: 'PDF Conversions',
    description: 'Convert Images to PDF, PDF to Images, and compress PDFs',
  },
  {
    icon: '🖼️',
    title: 'Image Tools',
    description: 'Convert between formats, compress images, and optimize quality',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Process files in seconds with our optimized conversion engine',
  },
  {
    icon: '🔒',
    title: '100% Private',
    description: 'Files are never stored. All conversions happen server-side and are deleted immediately',
  },
  {
    icon: '💾',
    title: 'Batch Processing',
    description: 'Convert multiple files at once and download as ZIP',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Desktop, tablet, mobile - no installation required',
  },
];

const faqs = [
  {
    question: 'Is my data secure and private?',
    answer:
      'Absolutely. All files are processed on secure, encrypted servers using HTTPS. Files are automatically deleted within 1 hour of upload—we never permanently store, backup, sell, or share your data. Your privacy is guaranteed.',
  },
  {
    question: 'What formats and file types do you support?',
    answer:
      'We support PDF, JPEG, PNG, WebP, and TIFF. Convert between any formats, compress images or PDFs, edit PDFs, and batch process up to 50 files at once. Each format has customizable quality settings.',
  },
  {
    question: 'What are the file size and batch limits?',
    answer:
      'Individual files: up to 100MB. Batch processing: up to 50 files with a total of 500MB. For enterprise clients needing higher limits, contact our support team.',
  },
  {
    question: 'Do I need an account to use Swift Convert?',
    answer:
      'No account required! Start converting immediately. Creating a free account is optional and lets you save conversion history, access saved settings, and get priority support.',
  },
  {
    question: 'Is Swift Convert really 100% free?',
    answer:
      'Yes, completely free with unlimited conversions and no ads. We believe everyone should have access to quality conversion tools. Premium plans are optional and coming soon.',
  },
  {
    question: 'Can I use converted files commercially?',
    answer:
      'Yes, absolutely. Use converted files for any purpose—personal, commercial, or resale—without restrictions. No licensing fees or attribution required.',
  },
];

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <>
      <NavbarScrollHandler />
      <main className="home-main">
        {/* Header */}
        <header className="navbar" suppressHydrationWarning>
          <div className="container">
            <div className="navbar-content">
            <button
              className="logo"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth', left: 0 });
              }}
              aria-label="Scroll to top"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Image
                src="/favicon.svg"
                alt="Swift Convert Logo"
                width={32}
                height={32}
                className="logo-icon"
              />
              <span className="logo-text">Swift Convert</span>
            </button>
              <nav className="nav-links">
                <Link href="/docs/pdf-conversion">Guides</Link>
                <Link href="/docs/formats">Formats</Link>
                <Link href="/blog">Blog</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Convert PDFs & Images <span className="highlight">in Seconds</span>
              </h1>
              <p className="hero-subtitle">
                Free, fast, and completely private online converter. No account needed. No file storage. Just instant conversions.
              </p>
              <div className="hero-cta">
                <a href="#converter-section" className="btn btn-primary">
                  Start Converting
                </a>
                <Link href="/docs/getting-started" className="btn btn-secondary">
                  Learn More
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <strong>1M+</strong>
                  <span>Files Converted</span>
                </div>
                <div className="stat">
                  <strong>99.9%</strong>
                  <span>Uptime</span>
                </div>
                <div className="stat">
                  <strong>&lt;2s</strong>
                  <span>Avg Conversion</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-buttons-grid">
                <a href="#converter-section" className="hero-action-btn" onClick={(e) => e.currentTarget.blur()}>
                  <span className="action-icon">📄</span>
                  <span className="action-text">Convert PDF</span>
                </a>
                <a href="#converter-section" className="hero-action-btn" onClick={(e) => e.currentTarget.blur()}>
                  <span className="action-icon">🖼️</span>
                  <span className="action-text">Convert Images</span>
                </a>
                <a href="#converter-section" className="hero-action-btn" onClick={(e) => e.currentTarget.blur()}>
                  <span className="action-icon">⚡</span>
                  <span className="action-text">Compress Files</span>
                </a>
                <a href="#converter-section" className="hero-action-btn" onClick={(e) => e.currentTarget.blur()}>
                  <span className="action-icon">✏️</span>
                  <span className="action-text">Edit PDFs</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="container">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Upload</h3>
                <p>Choose your file or drag & drop</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Select</h3>
                <p>Pick your output format & settings</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Convert</h3>
                <p>Watch your file transform</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Download</h3>
                <p>Get your file instantly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Converter Section */}
        <section id="converter-section">
          <Converter />
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2>Everything You Need</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">{expandedFaq === index ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === index && (
                    <div className="faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Notice */}
        <section className="privacy-notice">
          <div className="container">
            <h3>🔒 Your Privacy is Protected</h3>
            <p>
              All files are processed on secure servers and <strong>automatically deleted</strong> after conversion.
              We never store, share, or analyze your files. No tracking pixels. No ads. Just a simple, honest tool.
            </p>
            <Link href="/privacy-policy" className="link">
              Read our privacy policy →
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Start Converting Today</h2>
            <p>Join millions of users who trust Swift Convert</p>
            <a href="#converter-section" className="btn btn-primary btn-large">
              Open Converter
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Swift Convert</h4>
              <p>Free online PDF and image converter</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link href="/docs/pdf-conversion">PDF Conversion</Link>
              <Link href="/docs/image-formats">Image Tools</Link>
              <Link href="/blog">Blog</Link>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <Link href="/docs/getting-started">Getting Started</Link>
              <Link href="/docs/api">API Documentation</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Swift Convert. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
