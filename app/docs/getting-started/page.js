export const metadata = {
  title: 'Getting Started - Swift Convert',
  description: 'Get started with Swift Convert in minutes',
};

export default function GettingStarted() {
  return (
    <article className="doc-article">
      <h1>Getting Started with Swift Convert</h1>
      
      <p className="lead">
        Welcome to Swift Convert! This guide will help you get started with our PDF and image conversion tools in just a few minutes.
      </p>

      <h2>Quick Start In 5 Steps</h2>
      <ol>
        <li><strong>Upload</strong> - Click &quot;Choose File&quot; or drag &amp; drop your PDF or image</li>
        <li><strong>Select Format</strong> - Choose your desired output format</li>
        <li><strong>Adjust Settings</strong> - Configure quality, compression, or DPI (optional)</li>
        <li><strong>Convert</strong> - Click the &quot;Convert&quot; button</li>
        <li><strong>Download</strong> - Your file downloads automatically</li>
      </ol>

      <h2>Key Features</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>⚡ No Installation</h4>
          <p style={{ fontSize: '0.9rem', margin: '10px 0 0 0' }}>Web-based tool, start instantly</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>🔒 Privacy First</h4>
          <p style={{ fontSize: '0.9rem', margin: '10px 0 0 0' }}>Files auto-deleted after conversion</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>📦 Batch Mode</h4>
          <p style={{ fontSize: '0.9rem', margin: '10px 0 0 0' }}>Convert multiple files at once</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>✏️ Edit PDFs</h4>
          <p style={{ fontSize: '0.9rem', margin: '10px 0 0 0' }}>Rearrange, rotate & merge pages</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>📊 Full Format Support</h4>
          <p style={{ fontSize: '0.9rem', margin: '10px 0 0 0' }}>PDF, JPG, PNG, WebP, TIFF</p>
        </div>
      </div>

      <h2>Limits & Support</h2>
      <p>
        <strong>File Size:</strong> 15-30MB depending on operation type (see size warnings in converter)<br/>
        <strong>Speed:</strong> Most conversions complete in under 2 seconds<br/>
        <strong>Commercial Use:</strong> Yes, converted files can be used commercially with no restrictions
      </p>

      <h2>Next Steps</h2>
      <ul>
        <li><a href="/docs/pdf-conversion">Learn about PDF Conversion</a></li>
        <li><a href="/docs/image-formats">Explore Image Tools</a></li>
        <li><a href="/docs/compression">Read our Compression Guide</a></li>
      </ul>

      <div className="doc-tip">
        💡 <strong>Tip:</strong> Bookmark this site and check back regularly for new features and improvements!
      </div>
    </article>
  );
}
