export const metadata = {
  title: 'Contact Us - Swift Convert',
  description: 'Get in touch with the Swift Convert team',
};

export default function Contact() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'var(--card)', padding: '40px', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--ink)' }}>Get in Touch</h1>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6', marginBottom: '30px' }}>Have questions or feedback? We&apos;d love to hear from you!</p>

          <div style={{ backgroundColor: 'var(--bg)', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: 'var(--primary)', fontSize: '1.1rem' }}>📧 Email</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>contact@swift-convert.com</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg)', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: 'var(--primary)', fontSize: '1.1rem' }}>💬 Support</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>support@swift-convert.com</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg)', padding: '30px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: 'var(--primary)', fontSize: '1.1rem' }}>🔒 Privacy</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>privacy@swift-convert.com</p>
          </div>
        </div>

        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '8px', border: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.3rem', marginTop: 0, color: 'var(--ink)' }}>Response Time</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>We aim to respond to all inquiries within 24 hours during business days. For urgent issues, please mention &quot;URGENT&quot; in your subject line.</p>

          <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>Report a Bug</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Found a bug? Please report it with:</p>
          <ul style={{ color: 'var(--muted)', paddingLeft: '20px', margin: '10px 0' }}>
            <li>Browser and version</li>
            <li>Operating system</li>
            <li>Steps to reproduce</li>
            <li>Expected vs actual behavior</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>Feature Requests</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Have a feature idea? Send us an email and include:</p>
          <ul style={{ color: 'var(--muted)', paddingLeft: '20px', margin: '10px 0' }}>
            <li>Feature description</li>
            <li>Your use case</li>
            <li>Why you think others would benefit</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
