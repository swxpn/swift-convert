import '../docs.css';

export const metadata = {
  title: 'Documentation - Swift Convert',
  description: 'Learn how to use Swift Convert for PDF and image conversions',
};

export default function DocsLayout({ children }) {
  return (
    <div className="docs-layout">
      <nav className="docs-sidebar">
        <div className="docs-nav">
          <h3>Getting Started</h3>
          <ul>
            <li><a href="/docs/getting-started">Getting Started</a></li>
            <li><a href="/docs/formats">Supported Formats</a></li>
          </ul>
          <h3>Guides</h3>
          <ul>
            <li><a href="/docs/pdf-conversion">PDF Conversion</a></li>
            <li><a href="/docs/image-formats">Image Tools</a></li>
            <li><a href="/docs/compression">Compression Guide</a></li>
          </ul>
          <h3>Advanced</h3>
          <ul>
            <li><a href="/docs/api">API Documentation</a></li>
            <li><a href="/docs/troubleshooting">Troubleshooting</a></li>
          </ul>
        </div>
      </nav>
      <main className="docs-content">
        {children}
      </main>
    </div>
  );
}
