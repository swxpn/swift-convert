export const metadata = {
  title: 'PDF Conversion Guide - Swift Convert',
  description: 'Complete guide to converting PDFs and creating PDFs from images',
};

export default function PdfConversion() {
  return (
    <article className="doc-article">
      <h1>PDF Conversion Guide</h1>
      
      <p className="lead">
        Learn how to convert PDFs to images, create PDFs from images, and optimize your PDF files with Swift Convert.
      </p>

      <h2>PDF → Images</h2>
      <div style={{ background: 'var(--surface-soft)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Steps:</strong> Upload PDF → Select format (JPG/PNG/WebP/TIFF) → Adjust DPI/quality → Convert</p>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--muted)' }}><strong>Best for:</strong> PNG (text documents), JPG/WebP (photos), TIFF (archival)</p>
      </div>

      <h2>Images → PDF</h2>
      <div style={{ background: 'var(--surface-soft)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Steps:</strong> Upload images → Arrange pages → Select page size (A4/Letter) → Create PDF</p>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--muted)' }}><strong>Supported formats:</strong> JPG, PNG, WebP, TIFF, BMP</p>
      </div>

      <h2>Image to Image</h2>
      <div style={{ background: 'var(--surface-soft)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Steps:</strong> Upload image → Select output format → Adjust quality/compression → Convert</p>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--muted)' }}><strong>Popular conversions:</strong> PNG→JPG (smaller size), JPG→PNG (lossless), Any→WebP (web optimized)</p>
      </div>

      <h2>Compression Levels</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ marginTop: 0, fontWeight: 'bold' }}>Low</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Best quality, larger files</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ marginTop: 0, fontWeight: 'bold' }}>Medium</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Balanced (recommended)</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ marginTop: 0, fontWeight: 'bold' }}>High</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Maximum compression, slight quality loss</p>
        </div>
      </div>

      <h2>Quick Tips & Troubleshooting</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ marginTop: 0, fontSize: '0.9rem' }}><strong>📄 Blurry text?</strong> Use PNG format or increase DPI</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ marginTop: 0, fontSize: '0.9rem' }}><strong>📊 Large files?</strong> Try JPG or WebP format instead of PNG</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ marginTop: 0, fontSize: '0.9rem' }}><strong>⚡ WebP advantage:</strong> 25-35% smaller than JPG with better quality</p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '12px', borderRadius: '8px' }}>
          <p style={{ marginTop: 0, fontSize: '0.9rem' }}><strong>🚀 Pro tip:</strong> Use batch mode to convert multiple files at once</p>
        </div>
      </div>

      <h2>Related Guides</h2>
      <ul>
        <li><a href="/docs/compression">Learn about compression</a></li>
        <li><a href="/docs/image-formats">Explore image format options</a></li>
        <li><a href="/docs/api">Use our API for automation</a></li>
      </ul>
    </article>
  );
}
