export const metadata = {
  title: 'Privacy Policy - Swift Convert',
  description: 'Our privacy policy and data protection practices',
};

export default function PrivacyPolicy() {
  return (
    <article className="legal-page">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: March 31, 2026</p>

        <h2>Introduction</h2>
        <p>
          Swift Convert (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or &quot;Company&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our website and services.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Information You Provide</h3>
        <ul>
          <li><strong>Files:</strong> Any files you upload for conversion</li>
          <li><strong>Account Information:</strong> Email, username, password (if you create an account)</li>
          <li><strong>Feedback:</strong> Comments, suggestions, or support communications</li>
        </ul>

        <h3>Information We Collect Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, time spent, conversion types</li>
          <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
          <li><strong>Analytics:</strong> Performance metrics via Vercel Analytics</li>
          <li><strong>Cookies:</strong> Session cookies for functionality</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>✅ Process your file conversions</li>
          <li>✅ Improve our service and user experience</li>
          <li>✅ Provide customer support</li>
          <li>✅ Monitor service performance and security</li>
          <li>✅ Comply with legal obligations</li>
          <li>✅ Send important updates about our service</li>
        </ul>

        <h2>3. File Storage and Deletion</h2>
        <p>
          <strong>Your files are NEVER stored permanently.</strong> Here&apos;s exactly what happens:
        </p>
        <ul>
          <li>1. You upload a file</li>
          <li>2. We process it on our secure servers</li>
          <li>3. You download the converted file</li>
          <li>4. The original and processed files are automatically deleted within 1 hour</li>
          <li>5. No backup copies are kept</li>
          <li>6. No logs contain your file content</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your information:</p>
        <ul>
          <li>🔒 HTTPS encryption for all data in transit</li>
          <li>🔒 Secure server infrastructure on Vercel</li>
          <li>🔒 No storage of sensitive personal information</li>
          <li>🔒 Regular security updates and monitoring</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Vercel:</strong> Hosting and deployment (see their privacy policy)</li>
          <li><strong>Vercel Analytics:</strong> Performance metrics (privacy-first analytics)</li>
          <li><strong>Google Fonts:</strong> Font delivery</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Delete your data</li>
          <li>Opt-out of analytics tracking</li>
          <li>Port your data</li>
        </ul>

        <h2>7. Cookies</h2>
        <p>
          We use minimal cookies, only for essential functionality. You can disable cookies in your browser settings, but some features may not work properly.
        </p>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          Swift Convert is not intended for children under 13. We do not knowingly collect personal information from children under 13.
        </p>

        <h2>9. Policy Changes</h2>
        <p>
          We may update this policy occasionally. We will notify you of significant changes via email or a prominent notice on our website.
        </p>

        <h2>10. Questions?</h2>
        <p>
          If you have questions about this privacy policy or our privacy practices, please visit our <a href="/faq" style={{ color: 'var(--primary)', textDecoration: 'none' }}>FAQ page</a>.
        </p>

        <div className="legal-note">
          <strong>Note:</strong> This privacy policy is provided as-is. For any legal concerns, consult with a privacy attorney in your jurisdiction.
        </div>
      </div>
    </article>
  );
}
