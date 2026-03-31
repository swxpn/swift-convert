export const metadata = {
  title: 'Supported Formats - Swift Convert',
  description: 'Complete list of supported file formats and conversion options',
};

export default function Formats() {
  return (
    <article className="doc-article">
      <h1>Supported Formats</h1>
      
      <p className="lead">
        Swift Convert supports PDF and all major image formats with unlimited conversions between them.
      </p>

      <h2>Formats Overview</h2>
      
      <h3>📄 PDF</h3>
      <p><strong>Use for:</strong> Documents, reports, archives</p>
      <p>Convert PDFs to images or create PDFs from images. Compress to reduce file size.</p>

      <h3>🖼️ JPG / JPEG</h3>
      <p><strong>Best for:</strong> Photographs, graphics, web use</p>
      <p>Lossy compression for smaller file sizes with good quality. Ideal for photos.</p>

      <h3>📋 PNG</h3>
      <p><strong>Best for:</strong> Documents, screenshots, text</p>
      <p>Lossless compression preserves text clarity. Supports transparency.</p>

      <h3>⚡ WebP</h3>
      <p><strong>Best for:</strong> Web use, modern applications</p>
      <p>Modern format combining JPG and PNG benefits. 25-35% smaller than JPG with better quality.</p>

      <h3>🏢 TIFF</h3>
      <p><strong>Best for:</strong> Professional printing, archival</p>
      <p>Professional-grade format. Lossless compression for highest quality.</p>

      <h2>Quick Conversion Guide</h2>
      <div style={{ background: 'var(--surface-soft)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>From</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>To</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '10px' }}>PDF</td>
              <td style={{ padding: '10px' }}>JPG, PNG, WebP, TIFF</td>
              <td style={{ padding: '10px' }}>Extracting pages as images</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '10px' }}>JPG</td>
              <td style={{ padding: '10px' }}>PNG, WebP, TIFF, PDF</td>
              <td style={{ padding: '10px' }}>Converting photographs</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '10px' }}>PNG</td>
              <td style={{ padding: '10px' }}>JPG, WebP, TIFF, PDF</td>
              <td style={{ padding: '10px' }}>Reducing document size</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '10px' }}>WebP</td>
              <td style={{ padding: '10px' }}>JPG, PNG, TIFF, PDF</td>
              <td style={{ padding: '10px' }}>Converting web images</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>TIFF</td>
              <td style={{ padding: '10px' }}>JPG, PNG, WebP, PDF</td>
              <td style={{ padding: '10px' }}>Converting professional files</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Recommended Formats By Use Case</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>📝 Documents & Text</h4>
          <p><strong>Use:</strong> PNG</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Preserves text clarity</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>📸 Photographs</h4>
          <p><strong>Use:</strong> JPG / WebP</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Excellent quality-to-size</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>🌐 Web Use</h4>
          <p><strong>Use:</strong> WebP</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Modern & optimized</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>📦 Archival</h4>
          <p><strong>Use:</strong> TIFF / PNG</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Highest quality</p>
        </div>
      </div>
    </article>
  );
}
