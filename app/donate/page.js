'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './donate.css';

export default function Donate() {
  const [amount, setAmount] = useState(101);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Razorpay script asynchronously
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const quickAmounts = [
    { label: 'Chai ☕', value: 50 },
    { label: 'Pizza 🍕', value: 250 },
    { label: 'Dinner 🍽️', value: 500 },
    { label: 'Month Supply 📦', value: 1000 },
  ];

  const handleDonate = async (donationAmount) => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/donate/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: donationAmount * 100 }), // Convert to paise
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate donation');
      }

      const data = await response.json();
      
      // Initialize Razorpay checkout
      if (typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: data.key,
          order_id: data.order_id,
          amount: donationAmount * 100,
          currency: data.currency,
          name: 'Swift Convert',
          description: `Support Swift Convert - ₹${donationAmount}`,
          modal: {
            ondismiss: function() {
              try {
                setIsProcessing(false);
              } catch (e) {
                console.error('Error dismissing modal:', e);
              }
            }
          },
          handler: function (response) {
            try {
              setError('');
              setIsProcessing(false);
              alert('Thank you for your donation! 🙏 Your support helps us improve server performance and add new features.');
              setAmount(101);
              setCustomAmount('');
            } catch (e) {
              console.error('Error processing donation success:', e);
              setIsProcessing(false);
            }
          },
          prefill: {
            name: '',
            email: '',
            contact: '',
          },
          notes: {
            note_key_1: 'Swift Convert Donation',
          },
          theme: {
            color: '#fc8019',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          try {
            setIsProcessing(false);
            const errorMsg = response?.error?.description || 'Payment failed. Please try again.';
            setError(`Payment failed: ${errorMsg}`);
          } catch (e) {
            console.error('Error handling payment failure:', e);
            setIsProcessing(false);
            setError('Payment failed. Please try again.');
          }
        });
        rzp.open();
      } else {
        setError('Payment gateway not loaded. Please refresh and try again.');
      }
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Failed to process donation';
      setError(errorMessage);
    }
  };

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--ink)' }}>Support Swift Convert 💝</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Swift Convert is completely free and always will be. Your donations directly fuel server improvements, new features, and help us maintain the best possible performance for you.
          </p>
        </div>

        {/* Impact Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '25px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>⚡</p>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--ink)' }}>Server Performance</h3>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>Better hardware & infrastructure = faster conversions for everyone</p>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '25px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>✨</p>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--ink)' }}>New Features</h3>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>Development of new tools & capabilities users request</p>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '25px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>🛡️</p>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--ink)' }}>Reliability & Security</h3>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>Enhanced security measures & 99.9% uptime guarantee</p>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '25px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>🎯</p>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--ink)' }}>Sustainability</h3>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>Keep the service running and free forever</p>
          </div>
        </div>

        {/* Donation Form */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '40px', marginBottom: '40px' }}>
          <h2 style={{ marginTop: 0, color: 'var(--ink)', marginBottom: '30px' }}>Choose Your Impact 💪</h2>

          {/* Quick Amount Buttons */}
          <div style={{ marginBottom: '30px' }}>
            <p className="quick-amounts-label">Quick Amounts (INR)</p>
            <div className="quick-amounts-grid">
              {quickAmounts.map((btn) => (
                <button
                  key={btn.value}
                  className={`amount-btn ${amount === btn.value && !customAmount ? 'active' : ''}`}
                  onClick={() => {
                    try {
                      setAmount(btn.value);
                      setCustomAmount('');
                    } catch (err) {
                      console.error('Error selecting amount:', err);
                    }
                  }}
                >
                  {btn.label}
                  <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>₹{btn.value}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink)', fontWeight: '500' }}>
              Or enter a custom amount (INR):
            </label>
            <input
              type="number"
              min="10"
              value={customAmount}
              onChange={(e) => {
                try {
                  setCustomAmount(e.target.value);
                  if (e.target.value) {
                    setAmount(parseInt(e.target.value) || 101);
                  }
                } catch (err) {
                  console.error('Error updating amount:', err);
                }
              }}
              placeholder="Enter amount in INR"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Donation Button */}
          <button
            onClick={() => handleDonate(finalAmount)}
            disabled={isProcessing || finalAmount < 10}
            className={`donate-btn ${isProcessing || finalAmount < 10 ? 'disabled' : ''}`}
            style={{
              width: '100%',
              padding: '16px',
            }}
          >
            {isProcessing ? '🔄 Processing...' : `💝 Donate ₹${finalAmount}`}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '15px', fontSize: '0.9rem' }}>
            Powered by Razorpay • Secure & encrypted payment
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ color: 'var(--ink)', marginBottom: '30px' }}>Questions?</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: 'var(--ink)' }}>Is my donation secure?</h3>
              <p style={{ color: 'var(--muted)', margin: '10px 0 0 0' }}>Yes. All donations are processed through Razorpay, a trusted payment gateway with industry-standard encryption and security.</p>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: 'var(--ink)' }}>How are donations used?</h3>
              <p style={{ color: 'var(--muted)', margin: '10px 0 0 0' }}>Donations fund server costs, performance improvements, security enhancements, and new feature development. We&apos;re committed to transparency—your support directly fuels what you love about Swift Convert.</p>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: 'var(--ink)' }}>Will Swift Convert always be free?</h3>
              <p style={{ color: 'var(--muted)', margin: '10px 0 0 0' }}>Absolutely. Swift Convert will always remain completely free with unlimited conversions. Your donations help us sustain this commitment for everyone.</p>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: 'var(--ink)' }}>Can I get a receipt?</h3>
              <p style={{ color: 'var(--muted)', margin: '10px 0 0 0' }}>Yes. Check your email after donation for a receipt and transaction details from Razorpay.</p>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, color: 'var(--ink)' }}>Other ways to support?</h3>
              <p style={{ color: 'var(--muted)', margin: '10px 0 0 0' }}>Beyond donations, you can help by: sharing Swift Convert with friends, reporting bugs, suggesting features, and leaving reviews on social media. Every bit helps! 💪</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
            ← Back to Converter
          </Link>
        </div>
      </div>
    </main>
  );
}
